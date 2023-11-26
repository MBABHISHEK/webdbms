const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abhishek@2003@sql',
    database: 'traveldatabase'// Change this database name to your required database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Create the 'Books' table
app.post('/transportations', (req, res) => {
    const bookData = req.body;
     console.log(bookData);
    // Check if subject_id exists in the Department table
          connection.query(  // Change 'db' to 'connection' here
            'INSERT INTO TRANSPORTATION(transport_id,transport_type,departure_date,arrival_date,price) VALUES (?, ?, ?, ?, ?)',
            [bookData.transport_id,bookData.transport_type,bookData.departure_date,bookData.arrival_date,bookData.price],
            (insertErr) => {
              if (insertErr) {
                console.error('Error adding book:', insertErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
              res.json({ message: 'Book added successfully' });
            }
          );
        } 
);
    
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  

  



