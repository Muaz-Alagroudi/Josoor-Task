import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transactions.scss"; // Import the SCSS file

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:5000/transactions");
    setTransactions(response.data);
  };

  const issueBook = async () => {
    await axios.post("http://localhost:5000/transactions", {
      book_id: bookId,
      member_id: memberId,
      issue_date: issueDate,
    });
    fetchTransactions();
  };

  const returnBook = async (id) => {
    await axios.post(`http://localhost:5000/transactions/${id}/return`, {
      return_date: returnDate,
    });
    fetchTransactions();
  };

  return (
    <div className="transaction-list-container">
      <h2>Transactions</h2>
      <div className="form-container">
        <label htmlFor="book-id-input" className="form-label">
          Book ID
        </label>
        <input
          id="book-id-input"
          className="form-input"
          placeholder="Enter Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        <label htmlFor="member-id-input" className="form-label">
          Member ID
        </label>
        <input
          id="member-id-input"
          className="form-input"
          placeholder="Enter Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        />
        <label htmlFor="issue-date-input" className="form-label">
          Issue Date
        </label>
        <input
          id="issue-date-input"
          className="form-input"
          type="date"
          placeholder="Enter Issue Date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
      </div>
      <div className="return-container">
        <label htmlFor="return-date-input" className="form-label">
          Return Date
        </label>
        <input
          id="return-date-input"
          className="form-input"
          type="date"
          placeholder="Enter Return Date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
      </div>
      <button className="issue-button" onClick={issueBook}>
        Issue Book
      </button>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-item">
            <div className="transaction-details">
              <p>Book ID: {transaction.book_id}</p>
              <p>Member ID: {transaction.member_id}</p>
              <p>Issue Date: {transaction.issue_date}</p>
              <p>Return Date: {transaction.return_date || "Not returned"}</p>
              <p>Fee: Rs. {transaction.fee}</p>
            </div>
            {!transaction.return_date && (
              <button
                className="return-button"
                onClick={() => returnBook(transaction.id)}
              >
                Return Book
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;