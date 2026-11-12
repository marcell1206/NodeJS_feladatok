import pool from '../utils/db.js';
import express from 'express';

const allatokRouter = express.Router();

allatokRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { faj } = req.query;

    if (faj) {
        params.push(faj);
        szurok.push(`allatok.faj = ?`);
    }

    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes, gazdak.nev AS gazda FROM allatok JOIN gazdak ON gazdak.id = allatok.gazda_id`

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    try {
        const [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az lekérdezés során!' });
    }
});

allatokRouter.get('/kezeles-nelkul', async (req, res) => {
    let sql = `SELECT allatok.id, allatok.nev, allatok.faj, gazdak.nev from allatok JOIN gazdak ON gazdak.id = allatok.gazda_id LEFT JOIN kezelesek ON kezelesek.allat_id = allatok.id WHERE kezelesek.id IS NULL`;

    try {
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az lekérdezés során!' });
    }
});

allatokRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [allatRows] = await pool.query('SELECT allatok.id, allatok.nev, allatok.faj, allatok.szuletes from allatok WHERE id = ?', [id]);
        if (allatRows.length === 0)
        {
            return res.status(404).json({ hiba: 'A megadott állat nem található!' });
        }

        const allat1 = allatRows[0];
        const [gazdaRows] = await pool.query('SELECT gazdak.id, gazdak.nev, gazdak.telefon FROM gazdak LEFT JOIN allatok ON allatok.gazda_id = gazdak.id WHERE allatok.id = ?', [id]);
        allat1.gazda = gazdaRows;
        res.json(allat1);

        const allat2 = allatRows[1]
        const [kezelesekRows] = await pool.query('SELECT kezelesek.id, kezelesek.datum, kezelesek.leiras, kezelesek.dij FROM kezelesek LEFT JOIN allatok ON allatok.id = kezelesek.allat_id WHERE allat_id = 2 ORDER BY datum;');
        allat2.kezelesek = kezelesekRows;
        res.json(allat2);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }
});

export default allatokRouter;