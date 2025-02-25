import React, { useState } from "react";
import axios from "axios";
import "./Import.scss"; // Import the SCSS file

const ImportBooks = () => {
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);

  const importBooks = async () => {
    await axios.post("http://localhost:5000/import-books", { title, page });
    alert("Books imported successfully!");
  };

  return (
    <div className="import-books-container">
      <h2>Import Books</h2>
      <div className="form-container">
        <label htmlFor="title-input" className="form-label">
          Title
        </label>
        <input
          id="title-input"
          className="form-input"
          placeholder="Enter book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="page-input" className="form-label">
          Page
        </label>
        <input
          id="page-input"
          className="form-input"
          type="number"
          placeholder="Enter page number"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
        <button className="import-button" onClick={importBooks}>
          Import Books
        </button>
      </div>
    </div>
  );
};

export default ImportBooks;