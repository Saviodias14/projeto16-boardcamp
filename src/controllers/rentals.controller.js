import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export function getRent(req, res){
    
}

export async function postRent(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const today = dayjs().format('YYYY-MM-DD')
    try{
        const existCustomer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
        const existgame = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId])
        if(!existCustomer.rows[0]||!existgame.rows[0]) return res.sendStatus(400)
        const originalPrice = daysRented*existgame.rows[0].pricePerDay
        await db.query(`INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, today, daysRented, null, originalPrice, null])
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err.message)
    }
}