import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookList.scss"; // Import the SCSS file

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [isbn, setIsbn] = useState("");
  const [stock, setStock] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:5000/books");
    setBooks(response.data);
  };

  const addBook = async () => {
    await axios.post("http://localhost:5000/books", { title, authors, isbn, stock });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/books/${id}`);
    fetchBooks();
  };

  const deleteAllBooks = async () => {
    await axios.delete("http://localhost:5000/books");
    fetchBooks();
  };

  return (
    <div className="book-list-container">
      <h2>Books</h2>
      <div className="form-container">
        <input
          className="form-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="Authors"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
        />
        <input
          className="form-input"
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <input
          className="form-input"
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        <button className="add-button" onClick={addBook}>
          Add Book
        </button>
      </div>
      <button className="delete-all-button" onClick={deleteAllBooks}>
        Delete All Books
      </button>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <span className="book-details">
              ID: {book.id} {book.title} by {book.authors} (ISBN: {book.isbn}, Stock: {book.stock})
            </span>
            <button className="delete-button" onClick={() => deleteBook(book.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;