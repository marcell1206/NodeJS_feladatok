import pool from '../utils/db.js';
import express from 'express';

const varosokRouter = express.Router();

varosokRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { minSzallas } = req.query;

    if (minSzallas) {
        params.push(minSzallas);
        szurok.push(` HAVING COUNT(szallasok.varos_id) >= ?`)
    }

    let sql = 'SELECT varosok.id, varosok.nev, varosok.orszag, COUNT(szallasok.varos_id) as szallasDb, MIN(szallasok.ar) as legolcsobb, ROUND(AVG(szallasok.ar), 0) AS atlagAr FROM `varosok` LEFT JOIN szallasok ON szallasok.varos_id = varosok.id GROUP BY varosok.nev';

    if (szurok.length > 0) {
        sql += ` ${szurok}`;
    }

    sql += ' ORDER BY varosok.nev';

    try {
        let [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezése során!' });
    }
});

varosokRouter.get('/:id/szallasok', async (req, res) => {
    const { id } = req.params;

    try {
        let sql = 'SELECT varosok.nev, szallasok.nev FROM varosok LEFT JOIN szallasok ON szallasok.varos_id = varosok.id WHERE varosok.id = ?';
        let [eredmeny] = await pool.query(sql, [id]);

        if (id >= 7) {
            return res.status(404).json({ hiba: 'A megadott id nem található!' });
        }

        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezése során!' });
    }
})

export default varosokRouter;