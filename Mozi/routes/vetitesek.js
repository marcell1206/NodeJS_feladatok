import pool from '../utils/db.js';
import express from 'express';

const vetitesekRouter = express.Router();

vetitesekRouter.get('/', async (req, res) => {
    let params = [];
    let szurok = [];

    const { datum } = req.query;

    /*if (datum !== undefined && ) {
        return res.status(400).json({ hiba: 'A megadott dátummal nem találató vetítés.' });
    }*/

    if (datum) {
        params.push(datum);
        szurok.push(`DATE(vetitesek.kezdes) = ?`);
    }

    let sql = `SELECT vetitesek.id, filmek.cim AS film, termek.nev AS terem, DATE_FORMAT(vetitesek.kezdes, '%Y-%m-%d %H:%i') AS kezdes, DATE_FORMAT(vetitesek.kezdes + INTERVAL filmek.hossz MINUTE, '%H:%i') AS veg, vetitesek.jegyar, termek.sorok * termek.szekek - COUNT(foglalasok.vetites_id) AS szabadHely FROM vetitesek LEFT JOIN filmek ON filmek.id = vetitesek.film_id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id`;

    if (szurok.length > 0) {
        sql += ` WHERE ${szurok.join()}`;
    }

    sql += ' GROUP BY vetitesek.id ORDER BY vetitesek.kezdes'

    try {
        const [eredmeny] = await pool.query(sql, params);
        res.json(eredmeny);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt az adatok lekérdezése során.' });
    }
});

vetitesekRouter.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [vetitesRows] = await pool.query('SELECT vetitesek.id, filmek.cim AS film, termek.nev AS terem, vetitesek.kezdes, vetitesek.jegyar, termek.sorok, termek.szekek, COUNT(foglalasok.vetites_id) AS foglaltDb, termek.sorok * termek.szekek - COUNT(foglalasok.vetites_id) as szabadHely FROM vetitesek LEFT JOIN filmek ON filmek.id = vetitesek.film_id LEFT JOIN termek ON termek.id = vetitesek.terem_id LEFT JOIN foglalasok ON foglalasok.vetites_id = vetitesek.id WHERE vetitesek.id = ? GROUP BY foglalasok.vetites_id', [id]);
        if (vetitesRows.length === 0) {
            return res.status(404).json({ hiba: 'A megadott vetítés id nem található!' });
        }

        const vetites = vetitesRows[0]
        const [foglalasokRows] = await pool.query('SELECT foglalasok.sor, foglalasok.szek FROM foglalasok LEFT JOIN vetitesek ON vetitesek.id = foglalasok.vetites_id WHERE vetitesek.id = ?', [id]);
        vetites.foglalasok = foglalasokRows;
        res.json(vetites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ hiba: 'Hiba történt a lekérdezés során.' });
    }
})

export default vetitesekRouter;