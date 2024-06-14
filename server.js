import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';



const app = express();
app.use(bodyParser.json());
app.use(cors());


const dbName = 'myDatabase.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.log(err.message);
    } 
       
        console.log("Connected to the database.");
        db.run(`CREATE TABLE IF NOT EXISTS urls (
            id TEXT PRIMARY KEY,
            long_url TEXT NOT NULL
        )`);
    
});




app.post('/api/shorten', (req, res) => {
    const longUrl = req.body.longUrl;
    if(!longUrl){
        console.log("No LongUrl is given");
    }
    else{

    
    const id = nanoid(6);

    db.run(`INSERT INTO urls (id, long_url) VALUES (?, ?)`, [id, longUrl], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ shortUrl: `http://localhost:5000/${id} `});
    });
}
});


app.get('/:id', (req, res) => {
    const id = req.params.id;

    db.get(`SELECT long_url FROM urls WHERE id = ?`, [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.redirect(row.long_url);
    });
});



const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});