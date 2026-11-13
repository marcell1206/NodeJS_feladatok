import 'dotenv/config';
import express from 'express';
import gazdakRouter from './routes/gazdak.js';
import allatokRouter from './routes/allatok.js';
import kezelesekRouter from './routes/kezelesek.js';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.use('/gazdak', gazdakRouter);
app.use('/allatok', allatokRouter);
app.use('/kezelesek', kezelesekRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});