import pool from '../utils/db.js';
import express from 'express';

const munkalapokRouter = express.Router();

munkalapokRouter.get('/', async (req, res) => {
    let sql = 'SELECT munkalapok.id, munkalapok.rendszam, ugyfelek.nev AS ugyfel, munkalapok.felvetel, munkalapok.leiras, munkalapok.statusz, munkalapok.munkaora, (munkalapok.munkaora * 12000) AS munkadij, COALESCE(alkatreszek_osszeg.alkatreszDij, 0) AS alkatreszDij, ((munkalapok.munkaora * 12000) + COALESCE(alkatreszek_osszeg.alkatreszDij, 0)) AS vegosszeg FROM munkalapok LEFT JOIN ugyfelek ON ugyfelek.id = munkalapok.ugyfel_id LEFT JOIN ( SELECT munkalap_id, SUM(db * ar) AS alkatreszDij FROM felhasznalasok JOIN alkatreszek ON alkatreszek.id = felhasznalasok.alkatresz_id GROUP BY munkalap_id ) AS alkatreszek_osszeg ON alkatreszek_osszeg.munkalap_id = munkalapok.id ORDER BY munkalapok.felvetel';

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

export default munkalapokRouter;