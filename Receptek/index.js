import 'dotenv/config';
import express from 'express';
import receptekRouter from './routes/receptek.js';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT ?? 3000);
app.use('/receptek', receptekRouter);

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});