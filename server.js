const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abhishek@2003@sql',
    database: 'libraryweb'// Change this database name to your required database
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
app.post('/add-book', (req, res) => {
    const bookData = req.body;
     console.log(bookData);
    // Check if subject_id exists in the Department table
    connection.query(  // Change 'db' to 'connection' here
      'SELECT COUNT(*) AS count FROM Department WHERE subject_id = ?',
      [bookData.categorised],
      (err, result) => {
        if (err) {
          console.error('Error checking subject_id:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        console.log(result[0].count);
        chek=parseInt(result.count);
        //console.log(chek);
        //const subjectExists = chek > 0;
        //console.log(results); // Assuming results is an array of RowDataPacket objects
        const subjectExists = result[0].count > 0; // Accessing count property from the first result
        console.log(result[0].count);
        console.log(subjectExists);
        if (subjectExists) {
          // Subject exists, proceed with adding the book
          connection.query(  // Change 'db' to 'connection' here
            'INSERT INTO Books (Book_id, Book_title, Book_author, Book_edition, categorised) VALUES (?, ?, ?, ?, ?)',
            [bookData.Book_id, bookData.Book_title, bookData.Book_author, bookData.Book_edition, bookData.categorised],
            (insertErr) => {
              if (insertErr) {
                console.error('Error adding book:', insertErr);
                return res.status(500).json({ error: 'Internal Server Error' });
              }
              res.json({ message: 'Book added successfully' });
            }
          );
        } else {
          // Subject does not exist, return an error
          res.status(400).json({ error: 'Subject does not exist' });
        }
      }
    );
  });

// ... (other route handlers)


app.delete('http://localhost/delete-book/:bookId', (req, res) => {
    const bookId = req.params.bookId;
    connection.query('DELETE FROM Books WHERE Book_id = ?', [bookId], (err) => {
      if (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Book deleted successfully' });
      }
    });
  });
  
  app.get('http://localhost/search-book/:bookId', (req, res) => {
    const bookId = req.params.bookId;
    console.log(bookId);
    connection.all('SELECT * FROM Books WHERE Book_ID LIKE ?', [`%${bookName}%`], (err, rows) => {
      if (err) {
        console.error('Error searching for books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(rows);
      }
    });
  });
  
  app.get('/get-all-books', function (req, res) {
    connection.query('SELECT * FROM Books', function (err, results) {
        if (err) {
            console.log(err);
            res.json({ error: 'Error retrieving books' });
        } else {
          console.log(results);
            res.json(results);
        }
    });
});

app.post('/add-ebook', (req, res) => {
  const ebookData = req.body;
   console.log(ebookData);
  // Check if subject_id exists in the Department table
  connection.query(  // Change 'db' to 'connection' here
    'SELECT COUNT(*) AS count FROM Department WHERE subject_id = ?',
    [ebookData.category],
    (err, result) => {
      if (err) {
        console.error('Error checking category:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      console.log(result[0].count);
      chek=parseInt(result.count);
      //console.log(chek);
      //const subjectExists = chek > 0;
      //console.log(results); // Assuming results is an array of RowDataPacket objects
      const subjectExists = result[0].count > 0; // Accessing count property from the first result
      console.log(result[0].count);
      console.log(subjectExists);
      if (subjectExists) {
        // Subject exists, proceed with adding the book
        connection.query(  // Change 'db' to 'connection' here
          'INSERT INTO ebooks (ebook_id, eBook_title, author, category, url,ratings_value,format) VALUES (?, ?, ?, ?, ?,?,?)',
          [ebookData.ebook_id, ebookData.eBook_title, ebookData.author, ebookData.category, ebookData.url,ebookData.ratings_value,ebookData.format],
          (insertErr) => {
            if (insertErr) {
              console.error('Error adding ebook:', insertErr);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'eBook added successfully' });
          }
        );
      } else {
        // Subject does not exist, return an error
        res.status(400).json({ error: 'Ebook does not exist' });
      }
    }
  );
});

app.delete('/delete-ebook/:ebook_id', (req, res) => {
  const ebook_id = req.params.ebook_id;
  console.log(ebook_id);
  connection.query('DELETE FROM ebooks WHERE ebook_id = ?', [ebook_id], (err) => {
    if (err) {
      console.error('Error deleting ebook:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'eBook deleted successfully' });
    }
  });
});

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  

  



