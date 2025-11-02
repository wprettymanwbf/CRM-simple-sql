from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crm.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Customer(db.Model):
    """Customer model for storing customer information"""
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    company = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    notes = db.relationship('Note', backref='customer', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Convert customer object to dictionary"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Note(db.Model):
    """Note model for storing customer interactions"""
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        """Convert note object to dictionary"""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


# Routes
@app.route('/')
def index():
    """Main page - display all customers"""
    return render_template('index.html')


@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Get all customers"""
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return jsonify([customer.to_dict() for customer in customers])


@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    """Get a specific customer"""
    customer = Customer.query.get_or_404(customer_id)
    customer_data = customer.to_dict()
    customer_data['notes'] = [note.to_dict() for note in customer.notes]
    return jsonify(customer_data)


@app.route('/api/customers', methods=['POST'])
def create_customer():
    """Create a new customer"""
    data = request.json
    
    # Validate required fields
    if not data.get('first_name') or not data.get('last_name') or not data.get('email'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if email already exists
    existing_customer = Customer.query.filter_by(email=data['email']).first()
    if existing_customer:
        return jsonify({'error': 'Email already exists'}), 400
    
    customer = Customer(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data.get('phone', ''),
        company=data.get('company', '')
    )
    
    db.session.add(customer)
    db.session.commit()
    
    return jsonify(customer.to_dict()), 201


@app.route('/api/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update an existing customer"""
    customer = Customer.query.get_or_404(customer_id)
    data = request.json
    
    # Validate required fields
    if not data.get('first_name') or not data.get('last_name') or not data.get('email'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if email already exists for another customer
    existing_customer = Customer.query.filter(
        Customer.email == data['email'],
        Customer.id != customer_id
    ).first()
    if existing_customer:
        return jsonify({'error': 'Email already exists'}), 400
    
    customer.first_name = data['first_name']
    customer.last_name = data['last_name']
    customer.email = data['email']
    customer.phone = data.get('phone', '')
    customer.company = data.get('company', '')
    customer.updated_at = datetime.now(timezone.utc)
    
    db.session.commit()
    
    return jsonify(customer.to_dict())


@app.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete a customer"""
    customer = Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    
    return jsonify({'message': 'Customer deleted successfully'})


@app.route('/api/customers/<int:customer_id>/notes', methods=['POST'])
def create_note(customer_id):
    """Add a note to a customer"""
    customer = Customer.query.get_or_404(customer_id)
    data = request.json
    
    if not data.get('content'):
        return jsonify({'error': 'Note content is required'}), 400
    
    note = Note(
        customer_id=customer_id,
        content=data['content']
    )
    
    db.session.add(note)
    db.session.commit()
    
    return jsonify(note.to_dict()), 201


@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """Delete a note"""
    note = Note.query.get_or_404(note_id)
    db.session.delete(note)
    db.session.commit()
    
    return jsonify({'message': 'Note deleted successfully'})


def init_db():
    """Initialize the database"""
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")


if __name__ == '__main__':
    # Initialize database if it doesn't exist
    if not os.path.exists('instance/crm.db'):
        init_db()
    
    # Get debug mode from environment variable, default to False for production safety
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
