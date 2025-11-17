const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and password are required" });
    }

    let validuser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (validuser) {
        let accessToken = jwt.sign({ data: username }, "fingerprint_customer", {
            expiresIn: 60 * 60,
        });

        req.session.authorization = {
            accessToken,
            username,
        };
        res.status(200).json({ message: "User successfully logged in" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here(done)
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username;

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (books[isbn]) {
        let bookReviews = books[isbn].reviews;
        bookReviews[username] = reviewText;
        res.status(200).json({
            message: `Review for book with ISBN ${isbn} added/updated.`,
        });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Delete a book review 
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const username = req.session.authorization.username;

    if (books[isbn]) {
        let bookReviews = books[isbn].reviews; 

        if (bookReviews[username]) {
            delete bookReviews[username];

            res.status(200).json({
                message: `Review for book with ISBN ${isbn} by user ${username} deleted.`,
            });
        } else {
            res.status(404).json({ message: "Review not found for this user" });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
