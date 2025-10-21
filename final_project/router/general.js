const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Utilidades
const requests = function(obj, item) {
    for (let value in obj) {
        if (obj[value].item === item) {
            res.send(obj[value]);
        }
      }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (users.username === username && users.password === password) {
    res.status(403).json({message: "User already exist"});
  } else {
    let newUser = {
        username,
        password
    }
    users.push(newUser);
    res.send("User: " + newUser.username + " has been added");
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
  return res.status(200).json({message: "Here all the books."});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  for (let id in books) {
    if (books[id].author === author) {
        res.send(books[id]);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  for (let titleBook in books) {
    if (books[titleBook].title === title) {
        res.send(books[titleBook]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if(books[isbn]) {
      res.send(books[isbn].reviews);
  }
});

module.exports.general = public_users;
