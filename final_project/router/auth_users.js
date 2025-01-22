const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,
        username
      }
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
});
  

  
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
      const requestedIsbn = req.params.isbn;
      const reviewText = req.body.review; // Use req.body for review text
      const username = req.session.authorization.username;
  
      if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const book = Object.values(books).find(book => book.isbn === requestedIsbn);
  
      if (book) {
        book.reviews[username] = reviewText;
        res.json({ message: "Reviewed successfully" });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding/modifying review" });
    }
  });
  
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
      const requestedIsbn = req.params.isbn;
      const username = req.session.authorization.username;
  
      if (!username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const book = Object.values(books).find(book => book.isbn === requestedIsbn);
  
      if (book) {
        if (book.reviews[username]) {
          delete book.reviews[username];
          res.json({ message: "deleted successfully" });
        } else {
          res.status(404).json({ message: "Review not found" });
        }
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting review" });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
