const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here(done)
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username: username, password: password });
    res.status(201).json({
        message: "User successfully registered. Now you can login.",
    });
    return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get("/", async function (req, res) {
    try {
        const allBooks = await Promise.resolve(books);
        res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await Promise.resolve(books[isbn]);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
    try {
        const allBooks = await Promise.resolve(books);
        const bookKeys = Object.keys(allBooks);
        let booksByAuthor = [];

        bookKeys.forEach((key) => {
            if (allBooks[key].author === author) {
                booksByAuthor.push(allBooks[key]);
            }
        });

        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error searching by author" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    // 'async' add kiya
    const title = req.params.title;
    try {
        const allBooks = await Promise.resolve(books); // Intezar karo
        const bookKeys = Object.keys(allBooks);
        let booksByTitle = [];

        bookKeys.forEach((key) => {
            if (allBooks[key].title === title) {
                booksByTitle.push(allBooks[key]);
            }
        });

        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error searching by title" });
    }
});
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    //Write your code here(done)
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        res.status(200).json(books[isbn].reviews);
    } else {
        res.status(404).json({ message: "Reviews not found for this book" });
    }
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
