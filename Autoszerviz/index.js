import 'dotenv/config';
import express from 'express';
import munkalapokRouter from './routes/munkalapok.js';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT ?? 3000);
app.use('/munkalapok', munkalapokRouter);

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});