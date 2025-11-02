# CRM-simple-sql

A simple Customer Relationship Management (CRM) web application built with free and open-source technologies.

## 🚀 Features

- **Customer Management**: Create, read, update, and delete customer records
- **Contact Information**: Store customer names, emails, phone numbers, and company details
- **Notes & Interactions**: Track customer interactions and add notes
- **Search Functionality**: Quick search across all customer data
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **SQL Database**: Uses SQLite for reliable data persistence

## 🛠️ Technology Stack

- **Backend**: Python 3 with Flask web framework
- **Database**: SQLite (SQL-based)
- **ORM**: SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **All technologies are free and open-source**

## 📋 Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/wprettymanwbf/CRM-simple-sql.git
cd CRM-simple-sql
```

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Running the Application

### Production Mode (Recommended)
1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

### Development Mode (with debug enabled)
If you need debug mode for development:
```bash
export FLASK_DEBUG=True  # On Linux/Mac
# or
set FLASK_DEBUG=True     # On Windows
python app.py
```

**Note:** Debug mode should never be enabled in production as it can pose security risks.

The database will be automatically initialized on first run.

## 📖 Usage

### Adding a Customer
1. Click the "+ Add New Customer" button
2. Fill in the customer details (First Name, Last Name, and Email are required)
3. Click "Save"

### Viewing Customer Details
- Click on any customer card or click the "View Details" button
- View all customer information and associated notes
- Add new notes to track interactions

### Editing a Customer
- Click the "Edit" button on a customer card
- Update the information
- Click "Save"

### Deleting a Customer
- Click the "Delete" button on a customer card
- Confirm the deletion
- Note: This will also delete all associated notes

### Searching
- Use the search box to filter customers by name, email, phone, or company

## 📁 Project Structure

```
CRM-simple-sql/
├── app.py                 # Flask application and API endpoints
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── app.js        # Frontend JavaScript logic
└── crm.db                # SQLite database (created on first run)
```

## 🔌 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/<id>` - Get a specific customer with notes
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/<id>` - Update a customer
- `DELETE /api/customers/<id>` - Delete a customer

### Notes
- `POST /api/customers/<id>/notes` - Add a note to a customer
- `DELETE /api/notes/<id>` - Delete a note

## 🗄️ Database Schema

### Customer Table
- `id` (Integer, Primary Key)
- `first_name` (String, Required)
- `last_name` (String, Required)
- `email` (String, Required, Unique)
- `phone` (String, Optional)
- `company` (String, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Note Table
- `id` (Integer, Primary Key)
- `customer_id` (Integer, Foreign Key)
- `content` (Text, Required)
- `created_at` (DateTime)

## 🔒 Security Notes

- Input validation is performed on both frontend and backend
- Email uniqueness is enforced at the database level
- HTML escaping is applied to prevent XSS attacks
- SQL injection is prevented through SQLAlchemy ORM

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

**Database locked error**: Make sure only one instance of the application is running.

**Port already in use**: Change the port in `app.py` by modifying the `app.run()` line.

**Module not found error**: Ensure all dependencies are installed with `pip install -r requirements.txt`.

## 📞 Support

For issues and questions, please open an issue on GitHub.