import { db } from "../database/database.connection.js";

export function getCustomers(req, res) {
    db.query(`SELECT * FROM customers`)
        .then((response) => {
            const formatedObject = response.rows.map(obj => ({
                ...obj,
                birthday: new Date(obj.birthday).toISOString().split('T')[0]
            }))
            res.send(formatedObject)
        })
        .catch((err) => res.status(500).send(err.message))
}

export async function getCustomersById(req, res) {
    const { id } = req.params
    try {
        const costumer = await db.query(`SELECT * FROM customers WHERE id = $1`, [id])
        if (!costumer.rows.length) return res.sendStatus(404)
        res.send({
            ...costumer.rows[0],
            birthday: new Date(costumer.rows[0].birthday).toISOString().split('T')[0]
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body
    try {
        const cpfList = await db.query(`SELECT customers.cpf FROM customers`)
        if (cpfList.rows.length > 0 && cpfList.rows.find((c) => cpf === c.cpf)) return res.sendStatus(409)
        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function putCustomers(req, res) {
    const  id  = Number(req.params.id)
    const { name, phone, cpf, birthday } = req.body
    try {
        const cpfList = await db.query(`SELECT customers.cpf, customers.id FROM customers`)
        const existCpf = cpfList.rows.some((c) => {
            return c.cpf === cpf&&c.id!==id
        })
        if (existCpf) return res.sendStatus(409)
        await db.query(`
            UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5`,
            [name, phone, cpf, birthday, id])
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}