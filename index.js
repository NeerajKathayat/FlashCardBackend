const express = require("express")

const mysql = require("mysql2")

const app = express()

const cors = require('cors')

app.use(express.json());


const corsOptions = {
    origin: 'http://localhost:5174', // Change this to the origin of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
    host:'bxs5jkrs4vjy8k7yvqe4-mysql.services.clever-cloud.com',
    user:'un21af0n1tsnblzh',
    password:'dJZ0dDHNiJiCNz448zIn',
    database:'bxs5jkrs4vjy8k7yvqe4',
    port:3306
})

db.connect(err => {
    if (err) console.log("error");
    console.log('MySQL connected...');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS flashcards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question VARCHAR(255) NOT NULL,
            answer VARCHAR(255) NOT NULL
        );
    `;

    db.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('Flashcards table created or already exists.');
        
    });
});

app.get("/api/flashcards",(req,res)=>{
    const sql = "SELECT * FROM flashcards"
    db.query(sql, (err,data)=>{
        if(err) return res.json({success:false,message:"Error"});
        
        return res.json({success:true,data:data})
    })
})



// app.post('/api/flashcards', (req, res) => {
//     const { question, answer } = req.body;
//     db.query('INSERT INTO flashcards (question, answer) VALUES (?, ?)', [question, answer], (err, results) => {
//         if (err) res.json({success:false,message:"Error"});
//         return res.json({success:true, id: results.insertId, question, answer });
//     });
// });

app.post('/api/flashcards', (req, res) => {
    const { question, answer } = req.body;

    const sql = 'INSERT INTO flashcards (question, answer) VALUES (?, ?)';
    db.query(sql, [question, answer], (err, result) => {
        if (err) {
            console.error('Error inserting flashcard:', err);
            return res.status(500).json({ success: false, message: 'Error inserting flashcard' });
        }
        if (result && result.insertId) {
            return res.json({ success: true, id: result.insertId, question, answer });
        } else {
            return res.status(500).json({ success: false, message: 'Unexpected response from database' });
        }
    });
});


// Update flashcard endpoint
app.put('/api/flashcards/:id', (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
  
    const sql = 'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?';
    db.query(sql, [question, answer, id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to update flashcard' });
      } else {
        res.json({ id, question, answer });
      }
    });
  });
  


app.delete('/api/flashcards/:id', (req, res) => {
    db.query('DELETE FROM flashcards WHERE id = ?', [req.params.id], (err) => {
        if (err) res.json({success:false,message:"Error"});
        return res.json({success:true,message:"deleted successfully"});
    });
});


app.listen(4000,()=>{
    console.log("app listening to 4000 port....")
})