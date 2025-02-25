import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Members.scss"; // Import the SCSS file

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [debt, setDebt] = useState(0);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const response = await axios.get("http://localhost:5000/members");
    setMembers(response.data);
  };

  const addMember = async () => {
    await axios.post("http://localhost:5000/members", { name, debt });
    fetchMembers();
  };

  const deleteMember = async (id) => {
    await axios.delete(`http://localhost:5000/members/${id}`);
    fetchMembers();
  };

  const clearDebt = async (id) => {
    await axios.put(`http://localhost:5000/members/${id}`, { debt: 0 }); // Set debt to 0
    fetchMembers(); // Refresh the list
  };

  return (
    <div className="member-list-container">
      <h2>Members</h2>
      <div className="form-container">
        <input
          className="form-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-input"
          type="number"
          placeholder="Debt"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
        />
        <button className="add-button" onClick={addMember}>
          Add Member
        </button>
      </div>
      <ul className="member-list">
        {members.map((member) => (
          <li key={member.id} className="member-item">
            <div className="member-details">
              <p>ID: {member.id}</p>
              <p>Name: {member.name}</p>
              <p>Debt: {member.debt}</p>
            </div>
            <div className="button-container">
              <button
                className="clear-debt-button"
                onClick={() => clearDebt(member.id)}
              >
                Clear Debt
              </button>
              <button
                className="delete-button"
                onClick={() => deleteMember(member.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;