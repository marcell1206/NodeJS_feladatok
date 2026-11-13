import pool from '../utils/db.js';
import express from 'express';

const foglalasokRouter = express.Router();

foglalasokRouter.post('/', async (req, res) => {
    const { vetites_id, nev, sor, szek } = req.body;

    /*if (!vetitesId || !nev || !sor || !szek) {
        return res.status(404).json({ hiba: 'Egy vagy több érték hiányzik a foglalásból!' });
    }*/

    let sql = 'INSERT INTO foglalasok (vetites_id, nev, sor, szek) VALUES (?, ?, ?, ?)';

    console.log(vetites_id); // 5
    console.log(nev);       // "Kiss Anna"
    console.log(sor);       // 3
    console.log(szek);      // 4

    try {
        const [eredmeny] = await pool.query(sql,[vetites_id, nev, sor, szek]);
        res.status(201).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a művelet során.' });
    }
});

foglalasokRouter.delete('/:id', async (req, res) => {
    const { id } = req.body;

    let sql = 'DELETE FROM foglalasok WHERE id = ?';

    try {
        const [eredmeny] = await pool.query(sql, id);
        res.status(204).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a művelet során.' });
    }
});

export default foglalasokRouter;