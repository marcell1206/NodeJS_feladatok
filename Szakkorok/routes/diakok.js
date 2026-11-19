import pool from '../utils/db.js';
import express from 'express';

const diakokRouter = express.Router();

diakokRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { osztaly } = req.query;

    if (osztaly == undefined ) {
        res.status(400).json({ hiba: 'Az osztály paraméter hiányzik.' });
    }

    let sql = 'SELECT diakok.id, diakok.nev, diakok.osztaly, COUNT(jelentkezesek.szakkor_id) AS szakkorDb FROM diakok LEFT JOIN jelentkezesek ON jelentkezesek.diak_id = diakok.id';

    if (osztaly) {
        params.push(osztaly);
        szurok.push(`diakok.osztaly = ?`);
    }

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join()}`;
    }

    sql += ' GROUP BY jelentkezesek.diak_id';

    try {
        let [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

diakokRouter.get('/szakkor-nelkul', async (req, res) => {
    let sql = 'SELECT diakok.nev FROM diakok LEFT JOIN jelentkezesek ON jelentkezesek.diak_id = diakok.id WHERE jelentkezesek.diak_id IS NULL;'

    try {
        let [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

diakokRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [diakRows] = await pool.query('SELECT diakok.nev FROM diakok WHERE diakok.id = ?', [id]);
        if (diakRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott diák nem található!' });
        }

        const diak = diakRows[0];
        const [szakkorokRows] = await pool.query('SELECT szakkorok.id, szakkorok.nev, szakkorok.tanar, szakkorok.nap FROM szakkorok LEFT JOIN jelentkezesek ON jelentkezesek.szakkor_id = szakkorok.id LEFT JOIN diakok ON diakok.id = jelentkezesek.diak_id WHERE diakok.id = ?', [id]);
        diak.szakkorok = szakkorokRows;
        res.json(diak);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }
}) 

export default diakokRouter;