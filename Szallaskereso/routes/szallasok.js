import pool from '../utils/db.js';
import express from 'express';

const szallasokRouter = express.Router();

szallasokRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { varos } = req.query;
    const { medence } = req.query;
    let { minCsillag, maxAr } = req.query;

    if (minCsillag > 5) {
        res.status(400).json({ hiba: 'A megadott minimum értékelés nagy!' });
    }

    /*if (medence !== 'true' || medence !== 'false') {
        res.status(400).json({ hiba: 'A megadott érték a medencéhez nem megfelelő!' });
    }*/

    if (varos) {
        params.push(varos);
        szurok.push(`varosok.nev = ?`);
    }

    if (medence) {
        params.push(medence === 'true' ? 1 : 0);
        szurok.push(`szallasok.medence = ?`);
    }

    if (minCsillag) {
        params.push(Number(minCsillag));
        szurok.push(`szallasok.ertekeles >= ?`);
    }

    if (maxAr) {
        params.push(Number(maxAr));
        szurok.push(`szalasok.ar <= ?`);
    }

    //let sql = 'SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, szallasok.csillag, szallasok.ar, szallasok.medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id ORDER BY szallasok.ar;'
    let sql = 'SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, szallasok.csillag, szallasok.ar, CASE WHEN szallasok.medence = 0 THEN "False" WHEN szallasok.medence = 1 THEN "True" END AS medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id';

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ' ORDER BY szallasok.ar'

    try {
        const [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során!' });
    }
});

szallasokRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [szallasRows] = await pool.query('SELECT szallasok.id, szallasok.nev, varosok.nev, varosok.orszag, szallasok.csillag, szallasok.ar, CASE WHEN szallasok.medence = 0 THEN "False" WHEN szallasok.medence = 1 THEN "True" END AS medence, szallasok.ertekeles FROM szallasok JOIN varosok ON varosok.id = szallasok.varos_id WHERE szallasok.id = ?', [id]);
        if (szallasRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott szállás nem található!' });
        }
        res.json(szallasRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezése során!' });
    };
});

export default szallasokRouter;