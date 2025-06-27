import express from 'express'
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv'
import connectDb from './Config/db.js';
import AdminRouter from './Routes/Admin.routes.js';
import UserRouter from './Routes/User.rotes.js';
import { fileURLToPath } from 'url';

const app = express();
connectDb()
dotenv.config();
connectDb()


app.use(cors());

app.use(express.json())
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/admin', AdminRouter)
app.use('/api/user', UserRouter)

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
    // console.log(`Base Url ${BASE_URL}`)
});
app.get('/', (req, res) => {
    res.send('Profile API is running...');
});
