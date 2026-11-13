import 'dotenv/config';
import express from 'express';
import szallasokRouter from './routes/szallasok.js';
import varosokRouter from './routes/varosok.js';
import orszagokRouter from './routes/orszagok.js';
import ajanlatRouter from './routes/ajanlat.js';
import legjobbRouter from './routes/legjobb.js';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.use('/szallasok', szallasokRouter);
app.use('/varosok', varosokRouter);
app.use('/orszagok', orszagokRouter);
app.use('/ajanlat', ajanlatRouter);
app.use('/legjobb', legjobbRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});