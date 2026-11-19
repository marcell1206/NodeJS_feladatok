import pool from '../utils/db.js';
import express from 'express';

const utkozesekRouter = express.Router();

utkozesekRouter.get('/', async (req, res) => {
    let sql = 'SELECT diakok.nev, szakkorok.nap FROM diakok LEFT JOIN jelentkezesek ON jelentkezesek.diak_id = diakok.id LEFT JOIN szakkorok ON szakkorok.id = jelentkezesek.szakkor_id'
})