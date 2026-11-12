import pool from '../utils/db.js';
import express from 'express';

const legjobbRouter = express.Router();

legjobbRouter.get('/:szam', async (req, res) => {
    const { szam } = req.params;

    let sql = (`SELECT nev FROM szallasok ORDER BY ertekeles DESC LIMIT ${szam}`);

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }

    /*try {
        const [eredmeny] = await pool.query('SELECT nev FROM szallasok ORDER BY ertekeles DESC LIMIT ?', [szam]);
        res.json(eredmeny)
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok.' });
    }*/

})

export default legjobbRouter;