import pool from '../utils/db.js';
import express from 'express';

const receptekRouter = express.Router();

receptekRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];
    
    const { kategoria, maxIdo } = req.query;

    if (maxIdo !== undefined && !Number(maxIdo)) {
        return res.status(400).json({ hiba: 'A maximum idő nem számérték!' });
    }

    let sql = 'SELECT receptek.id, receptek.nev, receptek.kategoria, receptek.adag, receptek.ido, COUNT(recept_hozzavalok.recept_id) AS hozzavaloDb, ROUND(SUM(recept_hozzavalok.mennyiseg * hozzavalok.egysegar), 0) AS koltseg FROM receptek LEFT JOIN recept_hozzavalok ON recept_hozzavalok.recept_id = receptek.id LEFT JOIN hozzavalok ON hozzavalok.id = recept_hozzavalok.hozzavalo_id';

    if (kategoria) {
        params.push(kategoria),
        szurok.push(`receptek.kategoria = ?`);
    }

    if (maxIdo) {
        params.push(maxIdo);
        szurok.push(`receptek.ido <= ?`);
    }

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join(' AND ')}`;
    }

    sql += ' GROUP BY recept_hozzavalok.recept_id ORDER BY receptek.nev';

    try {
        const [eredmeny] = await pool.query(sql, params);
        if (eredmeny.length === 0) {
            return res.status(400).json({ hiba: 'A megadott kategória nem található!' });
        }
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

receptekRouter.get('/kereses', async (req, res) => {
    let params = [];
    let szurok = [];

    const { van } = req.query;

    if (van) {
        params.push(van);
        szurok.push(` hozzavalok.nev = ?`)
    }

    let sql = 'SELECT receptek.id, receptek.nev, receptek.kategoria FROM receptek LEFT JOIN recept_hozzavalok ON recept_hozzavalok.recept_id = receptek.id LEFT JOIN hozzavalok ON hozzavalok.id = recept_hozzavalok.hozzavalo_id';

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join()}`;
    }
    else {
        return res.status(400).json({ hiba: 'A paraméter hiányzik az url-ből.' });
    }

    try {
        const [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

receptekRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { adag } = req.params;

    try {
        const [receptRows] = await pool.query('SELECT * FROM receptek WHERE receptek.id = ?', [id]);
        if (receptRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott recept nem található!' });
        }

        const recept1 = receptRows[0];
        const [hozzavalokRows] = await pool.query('SELECT hozzavalok.id, hozzavalok.nev, recept_hozzavalok.mennyiseg, hozzavalok.mertekegyseg, ROUND(recept_hozzavalok.mennyiseg * hozzavalok.egysegar) AS koltseg FROM hozzavalok LEFT JOIN recept_hozzavalok ON recept_hozzavalok.hozzavalo_id = hozzavalok.id LEFT JOIN receptek ON receptek.id = recept_hozzavalok.recept_id WHERE receptek.id = ? ORDER BY hozzavalok.nev', [id]);
        recept1.hozzavalok = hozzavalokRows;
        res.json(recept1);

        let recept2 = receptRows[1];
        const [koltsegRows] = await pool.query('SELECT SUM(ROUND(recept_hozzavalok.mennyiseg * hozzavalok.egysegar)) AS koltseg, ROUND(SUM(ROUND(recept_hozzavalok.mennyiseg * hozzavalok.egysegar) / receptek.adag)) AS adagonkent FROM receptek LEFT JOIN recept_hozzavalok ON recept_hozzavalok.recept_id = receptek.id LEFT JOIN hozzavalok ON hozzavalok.id = recept_hozzavalok.hozzavalo_id WHERE receptek.id = ?', [id]);
        recept2.koltseg = koltsegRows;
        res.json(recept2);
    } catch (error) {
        console.error(error)
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
});

receptekRouter.post('/:id/hozzavalok', async (req, res) => {
    const { recept_id, hozzavaloId, mennyiseg } = req.body;

    if (hozzavaloId.length === 0) {
        return res.status(404).json({ hiba: 'A megadott hozzávaló nem található!' });
    }
    if (recept_id.length === 0) {
        return res.status(404).json({ hiba: 'A megadott ID nem található!' });
    }
    if (mennyiseg < 0) {
        return res.status(400).json({ hiba: 'A megadott mennyiség nem megfelelő.' });
    }

    let sql = 'INSERT INTO recept_hozzavalok (recept_id, hozzavalo_id, mennyiseg) VALUES (?, ?, ?)';

        try {
        const [eredmeny] = await pool.query(sql,[recept_id, hozzavaloId, mennyiseg]);
        res.status(201).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a művelet során.' });
    }
});

receptekRouter.delete('/:id/hozzavalok', async (req, res) => {
    const { recept_id, hozzavaloId } = req.body;

    let sql = 'DELETE FROM recept_hozzavalok WHERE recept_id = ? AND hozzavalo_id = ?';

    try {
        const [eredmeny] = await pool.query(sql, recept_id, hozzavaloId);
        res.status(204).json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a művelet során.' });
    }
})

export default receptekRouter;