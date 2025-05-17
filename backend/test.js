const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 1234;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//db connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mydb'
});

db.connect((err) => {
    if(err){
        console.log('Error connection to db');
    } else {
        console.log('Database connected');
    }
});



// register

app.post('/register', (req, res) => {
    const {username, password} = req.body;
    
    const chechksql = 'SELECT * FROM users WHERE username = ?';
    db.query(chechksql, [username], (err, results) => {
        if(err){
            alert('Error checking username');
            return res.json({success: false, message: 'Internal server error'});
        }

        if(results.length > 0){
            alert('username already exists');
            return res.json({succes: false, message:'Internal server error'});
        }

        const insertsql = 'INSERT INTO users (username, password) VALUES (?,?)';
        db.query(insertsql, [username, password], (insertErr, results) => {
            if(insertErr){
                alert('Error inserting user');
            }
            res.json({success: true, message:'User registered successfully'})
        });
    });
});

//login

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if(err){
            alert('Server error');
        }
        if(results.length === 0){
            return res.json({message: 'User not found'});
        }

        const user = results[0];
        if(user.password !== password){
            alert('Invalid password');
        }
        res.json({success: true, message: 'Login successful', userId: user.user_id});
    });
});