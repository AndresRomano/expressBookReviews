const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

// Registro de un nuevo usuario
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Verificar si el username y el password están proporcionados
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Verificar si el username ya existe
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Agregar el nuevo usuario a la lista de usuarios
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
      try {
    const bookList = books; 
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const requestedIsbn = req.params.isbn; 
        const book = Object.values(books).find(book => book.isbn === requestedIsbn);
        if (book) {
            res.json(book); 
        } else {
            res.status(404).json({ message: "Book not found" }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const requestedAuthor = req.params.author; // Retrieve author from request parameters
        const matchingBooks = Object.values(books).filter(book => book.author === requestedAuthor);

        if (matchingBooks.length > 0) {
            res.json(matchingBooks);
        } else {
            res.status(404).json({ message: "No books found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
        const requestedTitle = req.params.title.toLowerCase(); // Retrieve title from request parameters
        const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === requestedTitle);

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Send matching books as a JSON response
        } else {
            res.status(404).json({ message: "No books found" }); // Handle no books found
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" }); // Handle unexpected errors
    }
});   

// Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    try {
        const requestedIsbn = req.params.isbn; // Retrieve ISBN from request parameters
        const book = Object.values(books).find(book => book.isbn === requestedIsbn);

        if (book) {
            const reviews = book.reviews;
            res.json(reviews); // Send the book reviews as a JSON response
        } else {
            res.status(404).json({ message: "No books found" }); // Handle book not found
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error" }); // Handle unexpected errors
    }
});

// Función para obtener la lista de libros usando Promises
function getBookListWithPromise(url) {
  return axios.get(url).then(response => response.data);
}

// Función para obtener la lista de libros usando Async-Await
async function getBookListAsync(url) {
  const response = await axios.get(url);
  return response.data;
}

// Tarea 10 promesa
public_users.get('/promise', function (req, res) {
    getBookListWithPromise('http://localhost:5000/')
      .then(bookList => res.json(bookList))
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book list" });
      });
  });

// Tarea 10 async
public_users.get('/async', async function (req, res) {
    try {
      const bookList = await getBookListAsync('http://localhost:5000/');
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    }
  });

// Tarea 11 promesa
public_users.get('/promise/isbn/:isbn', function (req, res) {
    const requestedIsbn = req.params.isbn;
    getBookListWithPromise(`http://localhost:5000/isbn/${requestedIsbn}`)
      .then(book => res.json(book))
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  });
  
// Tarea 11 async
public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      const book = await getBookListAsync(`http://localhost:5000/isbn/${requestedIsbn}`);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });

// Tarea 12 promesa
public_users.get('/promise/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    getBookListWithPromise(`http://localhost:5000/author/${requestedAuthor}`)
      .then(bookList => res.json(bookList))
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  });
  
// Tarea 12 async
public_users.get('/async/author/:author', async function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      const bookList = await getBookListAsync(`http://localhost:5000/author/${requestedAuthor}`);
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });

// tarea 13 promesa
public_users.get('/promise/title/:title', function (req, res) {
    const requestedTitle = req.params.title;
    getBookListWithPromise(`http://localhost:5000/title/${requestedTitle}`)
      .then(bookList => res.json(bookList))
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  });
  
// Tarea 12 async
public_users.get('/async/title/:title', async function (req, res) {
    try {
      const requestedTitle = req.params.title;
      const bookList = await getBookListAsync(`http://localhost:5000/title/${requestedTitle}`);
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  

module.exports.general = public_users;
