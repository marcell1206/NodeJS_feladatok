import 'dotenv/config';
import express from 'express';
import filmekRouter from './routes/filmek.js';
import vetitesekRouter from './routes/vetitesek.js';
import statisztikaRouter from './routes/statisztika.js';
import foglalasokRouter from './routes/foglalasok.js';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT ?? 3000);
app.use('/filmek', filmekRouter);
app.use('/vetitesek', vetitesekRouter);
app.use('/statisztika', statisztikaRouter);
app.use('/foglalasok', foglalasokRouter);

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});