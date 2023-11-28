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
  /*add e books*/
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
/*delete-ebook by ebookid*/
app.delete('/delete-ebook/:ebook_id', (req, res) => {
  const ebook_id = req.params.ebook_id;
  console.log(ebook_id);

  connection.query('DELETE FROM ebooks WHERE ebook_id = ?', [ebook_id], (err, result) => {
    if (err) {
      console.error('Error deleting ebook:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: 'eBook deleted successfully' });
      } else {
        res.status(404).json({ error: 'eBook not found' });
      }
    }
  });
});


/*delete-book by book id*/ 
app.delete('/delete-book/:book_id', (req, res) => {
  const book_id = req.params.book_id;
  console.log(book_id);
  connection.query('DELETE FROM books WHERE book_id = ?', [book_id], (err) => {
    if (err) {
      console.error('Error deleting ebook:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'eBook deleted successfully' });
    }
  });
});
/*search-book by id*/
  app.get('/search-book/:bookId', (req, res) => {
    const bookId = req.params.bookId;
    console.log(bookId);
    connection.query('SELECT * FROM Books WHERE book_id LIKE ?', [`%${bookId}%`], (err, rows) => {
      if (err) {
        console.error('Error searching for books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(rows);
        res.json(rows);
      }
    });
  });
  app.put('/update-ebook/:ebook_id',(req,res)=>{
    const ebook_id = req.params.ebook_id;
    const ratings_value = req.body.ratings_value;
    console.log(ebook_id);
    console.log(ratings_value);
    connection.query('UPDATE ebooks SET ratings_value = ? WHERE ebook_id = ?', [ratings_value,ebook_id], (err,result) => {
      if (err) {
        console.error('Error updating ebook:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      else if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ebook not found' });
      } 
      else {
        res.json({ message: 'eBook updated successfully' });
      }
      });
  });

  app.get('/get-all-books', function (req, res) {
    connection.query('SELECT * FROM books', function (err, results) {
      if (err) {
        console.log(err);
        res.json({ error: 'Error retrieving books' });
      } else {
        console.log(results);
        res.json(results);
      }
    });
  });

  
  /*insert books*/ 
/*search in member by the member id */ 
app.get('/search-member/:memberId', (req, res) => {
  const memberId = req.params.memberId;
  connection.query(
    'SELECT * FROM Members WHERE Member_id = ?',
    [memberId],
    (err, result) => {
      if (err) {
        console.error('Error searching for member:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (result.length === 0) {
        // Member not found
        return res.status(404).json({ error: 'Member not found' });
      }

      // Member found, send the information to the client
      const memberInfo = result[0];
      res.status(200).json({ member: memberInfo });
    }
  );
});


app.get('/get-all-members', function (req, res) {
  connection.query('SELECT * FROM Members', function (err, results) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error retrieving members' });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});



app.post('/add-staff', (req, res) => {
    const staffData = req.body;
     console.log(staffData);
    // Check if subject_id exists in the Department table
    connection.query(  // Change 'db' to 'connection' here
    'INSERT INTO staff(staff_id, first_name, last_name, gender, designation,phone_no,address,joining_year) VALUES (?, ?, ?, ?, ?,?,?,?)',
    [staffData.staff_id, staffData.first_name, staffData.last_name, staffData.gender, staffData.designation,staffData.phone_no,staffData.address,staffData.joining_year],
    (insertErr) => {
      if (insertErr) {
        console.error('Error adding staff:', insertErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'staff added successfully' });
    }
  );
}); 

app.delete('/delete-staff/:staff_id', (req, res) => {
  const staff_id = req.params.staff_id;
  console.log(staff_id);
  connection.query('DELETE FROM staff WHERE staff_id = ?', [staff_id], (err) => {
    if (err) {
      console.error('Error deleting staff:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'staff deleted successfully' });
    }
  });
});

app.put('/update-staff/:staff_id',(req,res)=>{
  const staff_id = req.params.staff_id;
  const phone_no = req.body.phone_no;
  console.log(staff_id);
  console.log(phone_no);
  connection.query('UPDATE staff SET phone_no = ? WHERE staff_id = ?', [phone_no,staff_id], (err,result) => {
    if (err) {
      console.error('Error updating staff:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'staff not found' });
    } 
    else {
      res.json({ message: 'staff updated successfully' });
    }
    });
});

app.post('/add-login', (req, res) => {
  const loginData = req.body;
  console.log(loginData);

  // Check if staff_id exists in the staff table
  connection.query(
    'INSERT INTO login(login_id, first_name, last_name,t_date,visit,entry_time,exit_time,Department_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [loginData.login_id,loginData.first_name,loginData.last_name,loginData.t_date,loginData.visit,loginData.entry_time,loginData.exit_time, loginData.Department_name],
    (insertErr) => {
      if (insertErr) {
        console.error('Error adding staff:', insertErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'Staff added successfully' });
    }
  );
});

app.post('/add-staff', (req, res) => {
  const staffData = req.body;
   console.log(staffData);
  // Check if subject_id exists in the Department table
  connection.query(  // Change 'db' to 'connection' here
  'INSERT INTO staff(staff_id, first_name, last_name, gender, designation,phone_no,address,joining_year) VALUES (?, ?, ?, ?, ?,?,?,?)',
  [staffData.staff_id, staffData.first_name, staffData.last_name, staffData.gender, staffData.designation,staffData.phone_no,staffData.address,staffData.joining_year],
  (insertErr) => {
    if (insertErr) {
      console.error('Error adding staff:', insertErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'staff added successfully' });
  }
);
}); 

app.delete('/delete-staff/:staff_id', (req, res) => {
const staff_id = req.params.staff_id;
console.log(staff_id);
connection.query('DELETE FROM staff WHERE staff_id = ?', [staff_id], (err) => {
  if (err) {
    console.error('Error deleting staff:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.json({ message: 'staff deleted successfully' });
  }
});
});

app.put('/update-staff/:staff_id',(req,res)=>{
const staff_id = req.params.staff_id;
const phone_no = req.body.phone_no;
console.log(staff_id);
console.log(phone_no);
connection.query('UPDATE staff SET phone_no = ? WHERE staff_id = ?', [phone_no,staff_id], (err,result) => {
  if (err) {
    console.error('Error updating staff:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  else if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'staff not found' });
  } 
  else {
    res.json({ message: 'staff updated successfully' });
  }
  });
});

app.post('/enroll-membership', (req, res) => {
  const memberdata = req.body;

  connection.query(
      'SELECT COUNT(*) AS count FROM staff WHERE staff_id = ? UNION SELECT COUNT(*) AS count FROM login WHERE login_id = ?',
      [memberdata.registeredby, memberdata.loginid],
      (err, results) => {
          if (err) {
              console.error('Error checking:', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // Assuming the first result corresponds to staff and the second to login
          const chek1 = results[0].count || 0;
          const chek2 = results[1].count || 0;

          if (chek1 > 0 && chek2 > 0) {
              connection.query(
                  'INSERT INTO Members (Member_id, first_name, last_name, email, phone_no, address, next_renewal, login_id, registeredby) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [/* provide the values for each field */],
                  (err, result) => {
                      if (err) {
                          console.error('Error inserting into Members:', err);
                          return res.status(500).json({ error: 'Internal Server Error' });
                      }
                      console.log('Inserted into Members:', result);

                      res.status(200).json({ success: 'Enrollment successful' });
                  }
              );
          } else {
              res.status(400).json({ error: 'Invalid enrollment conditions' });
          }
      }
  );
});
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  

  



