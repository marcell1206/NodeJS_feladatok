import pool from '../utils/db.js';
import express from 'express';

const statisztikaRouter = express.Router();

statisztikaRouter.get('/filmek', async (req, res) => {
    //vetitesenkenti adatok
    let sql = 'SELECT filmek.cim AS film, COUNT(foglalasok.vetites_id) AS eladottJegy, vetitesek.jegyar * (COUNT(foglalasok.vetites_id)) AS bevetel, ROUND((COUNT(foglalasok.vetites_id) * 100) / NULLIF(SUM(termek.sorok * termek.szekek), 0), 1) AS telitettseg FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id GROUP BY foglalasok.vetites_id ORDER BY bevetel DESC;';

    try {
        const [eredmenyek] = await pool.query(sql);
        res.json(eredmenyek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során!' });
    }
});

export default statisztikaRouter;