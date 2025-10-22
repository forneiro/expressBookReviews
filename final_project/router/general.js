const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
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
async function getBooks() {
    try {
      const response = await axios.get('http://localhost:5000/');
      console.log("Books in the shop:");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  }
  getBooks();

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
    res.send(books[isbn])
});
async function getBookBasedIsbn() {
    try {
        const response = await axios.get('http://localhost:5000/isbn/:isbn');
      console.log("Here the book:");
        console.log(response.data);
    } catch (error) {
        console.log("Error fetching book:", error.message);
    }
}
getBookBasedIsbn();
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  for (let id in books) {
    if (books[id].author === author) {
        res.send(books[id]);
    }
  }
});
async function getBookBasedAuthor() {
    try {
        const response = await axios.get('http://localhost:5000/author/:author');
      console.log("Here the book:");
        console.log(response.data);
    } catch (error) {
        console.log("Error fetching book:", error.message);
    }
}
getBookBasedAuthor();
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  for (let titleBook in books) {
    if (books[titleBook].title === title) {
        res.send(books[titleBook]);
    }
  }
});
async function getBookBasedTitle() {
    try {
        const response = await axios.get('http://localhost:5000/title/:title');
        console.log("Here the book:")
        console.log(response.data);
    } catch (error) {
        console.log("Error fetching book:", error.message);
    }
};
getBookBasedTitle();
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization?.username; // <- CAMBIO AQUÍ

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

module.exports.general = public_users;
