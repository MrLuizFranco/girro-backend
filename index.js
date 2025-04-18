import express from 'express';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const dbFile = './girro.db';

async function downloadDB() {
  if (!fs.existsSync(dbFile)) {
    const url = process.env.FIREBASE_DB_URL;
    const writer = fs.createWriteStream(dbFile);
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}

let db;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('G!rro Backend funcionando!');
});

app.get('/api/preco/:km', (req, res) => {
  const precoPorKm = 2.00;
  const km = parseFloat(req.params.km);
  const preco = km * precoPorKm;
  res.json({ preco });
});

downloadDB().then(() => {
  db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error(err);
    else console.log('Conectado ao banco girro.db');
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
