import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export function getRent(req, res) {
    db.query(`SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName" FROM rentals
    JOIN games ON rentals."gameId" = games.id
    JOIN customers ON rentals."customerId" = customers.id`)
        .then((result) => {
            result.rows.map((e) => {
                e.customer = { id: e.customerId, name: e.customerName }
                e.game = { id: e.gameId, name: e.gameName }
                delete e.gameName
                delete e.customerName
            })
            const formatedObject = result.rows.map(obj => ({
                ...obj,
                rentDate: new Date(obj.rentDate).toISOString().split('T')[0]
            }))
            res.send(formatedObject)
        })
        .catch((err) => res.status(500).send(err.message))
}

export async function postRent(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const today = dayjs("2023-05-02").format('YYYY-MM-DD')
    try {
        const existCustomer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
        const existGame = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId])
        const amountGame = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`, [gameId])
        const totalGames = amountGame.rows.length
        if (existCustomer.rows.length === 0 || !existGame.rows.length === 0 || totalGames >= existGame.rows[0].stockTotal) return res.sendStatus(400)
        const originalPrice = daysRented * existGame.rows[0].pricePerDay
        await db.query(`INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, today, daysRented, null, originalPrice, null])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function finalizeRent(req, res) {
    const { id } = req.params
    const today = new Date(dayjs().format("YYYY-MM-DD"))
    try {
        const existId = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        if (existId.rows.length === 0) return res.sendStatus(404)
        if (existId.rows[0].returnDate !== null) return res.sendStatus(400)
        const rentDate = dayjs(existId.rows[0].rentDate).format('YYYY-MM-DD');
        const diffTime = dayjs(today).diff(rentDate, 'days');
        let delay = Math.max(0, diffTime - existId.rows[0].daysRented+1);
        const delayFee = delay * (existId.rows[0].originalPrice/existId.rows[0].daysRented);
        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [today, delayFee, id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRent(req, res) {
    const { id } = req.params
    try {
        const existId = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])
        if (existId.rows.length === 0) return res.sendStatus(404)
        if (existId.rows[0].returnDate === null) return res.sendStatus(400)
        await db.query(`DELETE FROM rentals WHERE id=$1`, [id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}