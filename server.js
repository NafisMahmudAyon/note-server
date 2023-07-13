const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// MySQL configuration
const connection = mysql.createConnection({
  host: '65.108.46.235',
  user: 'sqaaonli_notes',
  password: 'ajmdgptw1@',
  database: 'sqaaonli_note',
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
    } else {
      console.log('Connected to MySQL database!');
    }
  });

// API routes
app.post('/api/note', (req, res) => {
  const { title, content } = req.body;
  const query = `INSERT INTO notes (title, content) VALUES ('${title}', '${content}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Note created successfully!' });
  });
});

app.get('/api/notes', (req, res) => {
    const query = 'SELECT * FROM notes';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing the SELECT query:', error);
        res.status(500).json({ error: 'Failed to retrieve notes from the database' });
      } else {
        res.status(200).json(results);
        // res.json({ message: 'Note created successfully!' });
      }
    });
  });

  app.delete('/api/notes/delete/:id', (req, res) => {
    const noteId = req.params.id;
    const query = `DELETE FROM notes WHERE id = ${noteId}`;
    
    connection.query(query, (error, result) => {
      if (error) {
        console.error('Error executing the DELETE query:', error);
        res.status(500).json({ error: 'Failed to delete the note from the database' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Note not found' });
      } else {
        res.status(200).json({ message: 'Note deleted successfully' });
      }
    });
  });
  app.put('/api/notes/update/:id', (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const query = `UPDATE notes SET title = '${title}', content = '${content}' WHERE id = ${noteId}`;
    
    connection.query(query, (error, result) => {
      if (error) {
        console.error('Error executing the UPDATE query:', error);
        res.status(500).json({ error: 'Failed to update the note in the database' });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Note not found' });
      } else {
        res.status(200).json({ message: 'Note updated successfully' });
      }
    });
  });

app.listen();
