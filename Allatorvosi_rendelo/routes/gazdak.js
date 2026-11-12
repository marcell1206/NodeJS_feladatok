import pool from '../utils/db.js';
import express from 'express';

const gazdakRouter = express.Router();

gazdakRouter.get('/', async (req, res) => {
    const { varos } = req.query;

    let sql = 'SELECT gazdak.id, gazdak.nev, gazdak.varos, COUNT(allatok.gazda_id) as allatDb FROM `gazdak` JOIN allatok ON allatok.gazda_id = gazdak.id GROUP BY allatok.gazda_id ORDER BY nev';

    const params = []

    if (varos) {
        sql = 'SELECT nev FROM `gazdak` WHERE varos = ? ORDER BY nev';
        params.push(varos);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

gazdakRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ hiba: 'Az id paraméternek számnak kell lennie!' });
    }

    try {
        const [gazdaRows] = await pool.query('SELECT id, nev, telefon, varos FROM gazdak WHERE id = ?', [id]);
        if (gazdaRows.length === 0)
        {
            return res.status(404).json({ hiba: 'A megadott gazda nem található!' });
        }

        const gazda = gazdaRows[0];
        const [allatokRows] = await pool.query('SELECT a.id AS id, a.nev AS nev, a.faj AS faj, a.szuletes AS szuletes FROM `gazdak` LEFT JOIN allatok a ON a.gazda_id = gazdak.id WHERE gazdak.id = ?',  [id]);
        gazda.allatok = allatokRows;
        res.json(gazda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }
});                                     

export default gazdakRouter;