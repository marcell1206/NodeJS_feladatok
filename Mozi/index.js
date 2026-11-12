import 'dotenv/config';
import express from 'express';
import filmekRouter from './routes/filmek.js';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT ?? 3000);
app.use('/filmek', filmekRouter);

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});