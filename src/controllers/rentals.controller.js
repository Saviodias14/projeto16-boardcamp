import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export function getRent(req, res) {
    db.query(`SELECT rentals.*, games.name AS "gameName", customers.name AS "customerName" FROM rentals
    JOIN games ON rentals."gameId" = games.id
    JOIN customers ON rentals."customerId" = customers.id`)
        .then((result) => {
            result.rows.map((e) => {
                e.custumer = { id: e.customerId, name: e.customerName }
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
    const today = dayjs().format('YYYY-MM-DD')
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