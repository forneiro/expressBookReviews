const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
  };

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
  
    const user = authenticatedUser(username, password);
  
    if (!user) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
  

    let accessToken = jwt.sign(
      { data: password },
      'access',
      { expiresIn: 60 * 60 } 
    );
  
    
    req.session.authorization = { accessToken, username };
  
    return res.status(200).json({ message: "User successfully logged in" });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization?.username;
  
    if (!books[isbn]) {
      return res.status(404).send("Book not found");
    }
  
    if (!username) {
      return res.status(401).send("User not logged in");
    }
  
    if (!review) {
      return res.status(400).send("Review text missing");
    }
  
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .send(`Review by '${username}' for book ${isbn} has been added/updated.`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization?.username;
    let review = books[isbn].reviews[username];

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
      }
    
    if (!username) {
        return res.status(401).send("User not logged in");
    }
    
    if (!review) {
        return res.status(400).send("Review text missing");
    }
    delete review;
    return res
      .status(200)
      .send(`Review by '${username}' for book ${isbn} has been deleted.`);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
