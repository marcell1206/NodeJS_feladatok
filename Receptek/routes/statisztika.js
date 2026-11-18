import pool from '../utils/db.js';
import express from 'express';

const statisztikaRouter = express.Router();

statisztikaRouter.get('/kategoriak', async (req, res) => {
    let sql = 'SELECT receptek.kategoria, COUNT(receptek.id) AS receptDb, ROUND(AVG(receptek.ido)) AS atlagIdo, ROUND(AVG(alk.teljes_koltseg)) AS atlagKoltseg FROM receptek LEFT JOIN ( SELECT recept_id, SUM(recept_hozzavalok.mennyiseg * hozzavalok.egysegar) AS teljes_koltseg FROM recept_hozzavalok JOIN hozzavalok ON hozzavalok.id = recept_hozzavalok.hozzavalo_id GROUP BY recept_id ) alk ON receptek.id = alk.recept_id GROUP BY receptek.kategoria';

    try {
        const [eredmenyek] = await pool.query(sql);
        res.json(eredmenyek);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során!' });
    }
});

export default statisztikaRouter;