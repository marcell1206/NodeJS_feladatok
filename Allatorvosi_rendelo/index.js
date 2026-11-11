import 'dotenv/config';
import express from 'express';
import gazdakRouter from './routes/gazdak.js';

let vegpontok =  [
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/gazdak` },
    { vegpont: `http://localhost:${process.env.PORT ?? 3000}/gazdak/:id` }
]

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.use('/gazdak', gazdakRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});