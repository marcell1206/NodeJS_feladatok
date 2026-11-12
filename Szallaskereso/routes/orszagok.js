import pool from '../utils/db.js';
import express from 'express';

const orszagokRouter = express.Router();

orszagokRouter.get('/', async (req, res) => {
    let sql = 'SELECT varosok.orszag, COUNT(DISTINCT varosok.nev) AS varosDB, COUNT(szallasok.varos_id) AS szallasDb, ROUND(AVG(szallasok.ertekeles), 1) AS atlagErtekeles FROM `varosok` LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.orszag;';

    try {
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezése során!' });
    }
});

export default orszagokRouter;