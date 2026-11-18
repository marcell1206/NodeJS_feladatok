import pool from '../utils/db.js';
import express from 'express';

const hozzavalokRouter = express.Router();

hozzavalokRouter.get('/', async (req, res) => {
    let sql = 'SELECT hozzavalok.id, hozzavalok.nev, hozzavalok.mertekegyseg, hozzavalok.egysegar, COUNT(recept_hozzavalok.hozzavalo_id) AS receptDb FROM hozzavalok LEFT JOIN recept_hozzavalok ON recept_hozzavalok.hozzavalo_id = hozzavalok.id LEFT JOIN receptek ON receptek.id = recept_hozzavalok.recept_id GROUP BY recept_hozzavalok.hozzavalo_id ORDER BY COUNT(recept_hozzavalok.hozzavalo_id) DESC, hozzavalok.nev';

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

hozzavalokRouter.get('/nemhasznalt', async (req, res) => {
    let sql = 'SELECT hozzavalok.id, hozzavalok.nev FROM hozzavalok LEFT JOIN recept_hozzavalok ON recept_hozzavalok.hozzavalo_id = hozzavalok.id LEFT JOIN receptek ON receptek.id = recept_hozzavalok.recept_id GROUP BY recept_hozzavalok.recept_id HAVING (COUNT(recept_hozzavalok.hozzavalo_id)) = 0';

    try {
        const [eredmeny] = await pool.query(sql);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
         res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
})

export default hozzavalokRouter;