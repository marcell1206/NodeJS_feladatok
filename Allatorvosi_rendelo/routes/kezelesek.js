import pool from '../utils/db.js';
import express, { Router } from 'express';

const kezelesekRouter = express.Router();

kezelesekRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { faj } = req.query;
    let { tol, ig } = req.query;

    if ((tol !== undefined && isNaN(Number(tol))) || (ig !== undefined && isNaN(Number(ig)))) {
        res.status(400).json({ hiba: 'A -tol, -ig paraméter nem szám!' });
        return;
    }

    if (tol !== undefined && ig !== undefined && Number(tol) > Number(ig)) {
        [tol, ig] = [ig, tol];
    };

    if (faj) {
        params.push(faj);
        szurok.push(`allatok.faj = ?`);
    }

    if (tol) {
        params.push(Number(tol));
        szurok.push(`kezelesek.datum >= ?`);
    }

    if (ig) {
        params.push(Number(ig));
        szurok.push(`kezelesek.datum <= ?`);
    }

    let sql = `SELECT kezelesek.id, kezelesek.datum, allatok.nev AS allat, allatok.faj, gazdak.nev AS gazda, kezelesek.leiras, kezelesek.dij FROM kezelesek JOIN allatok ON kezelesek.allat_id = allatok.id JOIN gazdak ON allatok.gazda_id = gazdak.id`;

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

export default kezelesekRouter;