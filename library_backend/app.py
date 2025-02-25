from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
from datetime import datetime
from models import db, Book, Member, Transaction

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

# Helper function to calculate rent fee
def calculate_rent_fee(issue_date, return_date):
    issue = datetime.strptime(issue_date, "%Y-%m-%d")
    return_d = datetime.strptime(return_date, "%Y-%m-%d")
    days = (return_d - issue).days
    return days * 10  # Rs. 10 per day

# Routes for Books
@app.route('/books', methods=['GET', 'POST', 'DELETE'])
def manage_books():
    if request.method == 'GET':
        books = Book.query.all()
        return jsonify([{"id": b.id, "title": b.title, "authors": b.authors, "isbn": b.isbn, "stock": b.stock} for b in books])
    elif request.method == 'POST':
        data = request.json
        new_book = Book(title=data['title'], authors=data['authors'], isbn=data['isbn'], stock=data.get('stock', 1))
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"message": "Book added successfully!"}), 201
    elif request.method == 'DELETE':
        Book.query.delete()
        db.session.commit()
        return jsonify({"message": "All books deleted successfully!"}), 200

@app.route('/books/<int:id>', methods=['PUT', 'DELETE'])
def manage_book(id):
    book = Book.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.json
        book.title = data.get('title', book.title)
        book.authors = data.get('authors', book.authors)
        book.isbn = data.get('isbn', book.isbn)
        book.stock = data.get('stock', book.stock)
        db.session.commit()
        return jsonify({"message": "Book updated successfully!"})
    elif request.method == 'DELETE':
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Book deleted successfully!"})

# Routes for Members
@app.route('/members', methods=['GET', 'POST'])
def manage_members():
    if request.method == 'GET':
        members = Member.query.all()
        return jsonify([{"id": m.id, "name": m.name, "debt": m.debt} for m in members])
    elif request.method == 'POST':
        data = request.json
        new_member = Member(name=data['name'], debt=data.get('debt', 0.0))
        db.session.add(new_member)
        db.session.commit()
        return jsonify({"message": "Member added successfully!"}), 201

@app.route('/members/<int:id>', methods=['PUT', 'DELETE'])
def manage_member(id):
    member = Member.query.get_or_404(id)
    if request.method == 'PUT':
        data = request.json
        member.name = data.get('name', member.name)
        member.debt = data.get('debt', member.debt)
        db.session.commit()
        return jsonify({"message": "Member updated successfully!"})
    elif request.method == 'DELETE':
        db.session.delete(member)
        db.session.commit()
        return jsonify({"message": "Member deleted successfully!"})

# Routes for Transactions
@app.route('/transactions', methods=['GET', 'POST'])
def manage_transactions():
    if request.method == 'GET':
        transactions = Transaction.query.all()
        return jsonify([{"id": t.id, "book_id": t.book_id, "member_id": t.member_id, "issue_date": t.issue_date, "return_date": t.return_date, "fee": t.fee} for t in transactions])
    elif request.method == 'POST':
        data = request.json
        book = Book.query.get_or_404(data['book_id'])
        member = Member.query.get_or_404(data['member_id'])

        # Check if book is in stock
        if book.stock < 1:
            return jsonify({"error": "Book out of stock!"}), 400

        # Check if member's debt exceeds Rs. 500
        if member.debt >= 500:
            return jsonify({"error": "Member's debt exceeds Rs. 500!"}), 400

        # Issue the book
        book.stock -= 1
        new_transaction = Transaction(
            book_id=data['book_id'],
            member_id=data['member_id'],
            issue_date=data['issue_date'],
            return_date=None,
            fee=0.0
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "Book issued successfully!"}), 201

@app.route('/transactions/<int:id>/return', methods=['POST'])
def return_book(id):
    transaction = Transaction.query.get_or_404(id)
    data = request.json
    return_date = data['return_date']

    # Calculate rent fee
    fee = calculate_rent_fee(transaction.issue_date, return_date)

    # Update transaction and member debt
    transaction.return_date = return_date
    transaction.fee = fee
    member = Member.query.get_or_404(transaction.member_id)
    member.debt += fee

    # Return the book to stock
    book = Book.query.get_or_404(transaction.book_id)
    book.stock += 1

    db.session.commit()
    return jsonify({"message": "Book returned successfully!", "fee": fee})

# Route for importing books
@app.route('/import-books', methods=['POST'])
def import_books():
    data = request.json
    title = data.get('title', '')
    page = data.get('page', 1)
    print(title, page)
    response = requests.get(f'https://frappe.io/api/method/frappe-library?page={page}&title={title}')
    print(response)
    books_data = response.json()['message']
    for book in books_data:
        new_book = Book(title=book['title'], authors=book['authors'], isbn=book['isbn'], stock=1)
        db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": f"{len(books_data)} books imported successfully!"})

if __name__ == '__main__':
    app.run(debug=True)