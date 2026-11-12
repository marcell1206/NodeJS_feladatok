import pool from '../utils/db.js';
import express from 'express';

const ajanlatRouter = express.Router();

ajanlatRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { varos, ej, fo } = req.query;

    let sql = 'SELECT szallasok.nev, szallasok.csillag, szallasok.ar AS ArFoEj FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id';

    /*if (varos !== undefined || ej !== undefined || fo !== undefined) {
        res.status(400).json({ hiba: 'Egy vagy több paraméter hibásan van megadva' });
        return;
    }*/

    if (ej && fo) {
        params.push(ej, fo)
        sql = 'SELECT szallasok.nev, szallasok.csillag, szallasok.ar AS ArFoEj, ROUND(((ar * ?) * ?), 0) AS osszesen FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id';
    }

    if (varos) {
        params.push(varos);
        szurok.push(`varosok.nev = ?`);
    }

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    try {
        let [eredmeny] = await pool.query(sql, params);
        if (eredmeny.length === 0) {
            return res.status(404).json({ hiba: 'A megadott városban nem található szállás!' });
        };
        res.json({ "varos": varos, "ej": ej, "fo": fo, eredmeny });
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }
});

export default ajanlatRouter;