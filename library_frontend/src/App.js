import React, { useState } from "react";
import BookList from "./components/BookList";
import MemberList from "./components/Members";
import TransactionList from "./components/Transactions";
import ImportBooks from "./components/Import";
import "./App.scss";

function App() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div>
      <div className="navbar-container">
        <nav className="navbar">
          <button
            className={`nav-button ${activeTab === "books" ? "active" : ""}`}
            onClick={() => setActiveTab("books")}
          >
            Books
          </button>
          <button
            className={`nav-button ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`nav-button ${
              activeTab === "transactions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={`nav-button ${activeTab === "import" ? "active" : ""}`}
            onClick={() => setActiveTab("import")}
          >
            Import Books
          </button>
        </nav>
      </div>

      {activeTab === "books" && <BookList />}
      {activeTab === "members" && <MemberList />}
      {activeTab === "transactions" && <TransactionList />}
      {activeTab === "import" && <ImportBooks />}
    </div>
  );
}

export default App;
