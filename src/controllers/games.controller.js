import { db } from "../database/database.connection.js";

export function getGames(req, res) {
    db.query(`SELECT * FROM games`)
    .then((response)=>res.send(response.rows))
    .catch((err)=>res.status(500).send(err.message))
}

export async function postGames(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body
    try {
        const namesList = await db.query(`SELECT games.name FROM games`)
        console.log(namesList.rows)
        if (namesList.rows.length>0&&namesList.rows.find((n) => name === n.name)) return res.sendStatus(409)
        await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
            VALUES ($1, $2, $3, $4)`,
            [name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}