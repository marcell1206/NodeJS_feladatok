import 'dotenv/config';
import express from 'express';
import szakkorokRouter from './routes/szakkorok.js';
import diakokRouter from './routes/diakok.js';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? 3000);
app.use('/szakkorok', szakkorokRouter);
app.use('/diakok', diakokRouter);

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
});