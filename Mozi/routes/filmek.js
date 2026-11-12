import pool from '../utils/db.js';
import express from 'express';

const filmekRouter = express.Router();

filmekRouter.get('/', async (req, res) => {
    let sql = 'SELECT filmek.id, filmek.cim, filmek.hossz, filmek.korhatar, COUNT(DISTINCT vetitesek.id) AS vetitesDB, COUNT(foglalasok.vetites_id) AS eladottJegy FROM filmek LEFT JOIN vetitesek ON vetitesek.film_id = filmek.id LEFT JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id GROUP BY vetitesek.film_id ORDER BY filmek.cim';

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error){
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során!' });
    }
});

filmekRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [filmRows] = await pool.query('SELECT * FROM filmek WHERE id = ?', [id]);
        if (filmRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott film nem található!' });
        }

        const film = filmRows[0];
        const [vetitesekRows] = await pool.query()
    }
})

export default filmekRouter;