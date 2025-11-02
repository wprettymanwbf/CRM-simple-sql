# CRM-simple-sql

A simple Customer Relationship Management (CRM) web application built with free and open-source technologies.

## 🌐 Live Demo

**[Try it now on GitHub Pages!](https://wprettymanwbf.github.io/CRM-simple-sql/)**

No installation required - the app runs entirely in your browser with data stored locally.

## 🚀 Features

- **Customer Management**: Create, read, update, and delete customer records
- **Contact Information**: Store customer names, emails, phone numbers, and company details
- **Notes & Interactions**: Track customer interactions and add notes
- **Search Functionality**: Quick search across all customer data
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Data persists in your browser using localStorage
- **No Installation**: Runs directly from GitHub Pages without any setup

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Storage**: Browser localStorage for data persistence
- **Hosting**: GitHub Pages (static site)
- **All technologies are free and open-source**

## 📋 Quick Start

### Option 1: Use GitHub Pages (Recommended)
Simply visit **[https://wprettymanwbf.github.io/CRM-simple-sql/](https://wprettymanwbf.github.io/CRM-simple-sql/)**

No installation needed! The application runs entirely in your browser.

### Option 2: Run Locally
1. Clone the repository:
```bash
git clone https://github.com/wprettymanwbf/CRM-simple-sql.git
cd CRM-simple-sql
```

2. Open `index.html` in your web browser, or run a local server:
```bash
# Using Python 3
python -m http.server 8080

# Then visit http://localhost:8080
```

### Option 3: Run the Flask Version (Legacy)
For the original Flask-based backend version, see the [Flask Setup Instructions](#flask-version-legacy) below.

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

## 💾 Data Storage

The application uses your browser's localStorage to save all data locally. This means:
- ✅ Your data is stored securely in your browser
- ✅ No server or database required
- ✅ Data persists between sessions
- ⚠️ Data is specific to each browser/device
- ⚠️ Clearing browser data will delete your CRM data

## 📁 Project Structure

```
CRM-simple-sql/
├── index.html            # Main application (single-page app)
├── app.py                # Flask backend (legacy/optional)
├── requirements.txt      # Python dependencies (for Flask version)
├── templates/
│   └── index.html        # Flask template (legacy)
├── static/
│   ├── css/
│   │   └── style.css     # Styling (legacy)
│   └── js/
│       └── app.js        # Frontend JavaScript (legacy)
└── README.md
```

## 🔒 Security Notes

- Input validation is performed on the frontend
- Email uniqueness is enforced
- HTML escaping is applied to prevent XSS attacks
- All data is stored locally in your browser

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

**Data not persisting**: Make sure you're not in private/incognito mode and that your browser allows localStorage.

**Email already exists error**: Each customer must have a unique email address.

**Data lost after clearing browser**: Browser localStorage is cleared when you clear browsing data. Consider exporting your data regularly.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

## Flask Version (Legacy)

The original Flask-based version with SQLite backend is still available in the repository. To use it:

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation
1. Install required dependencies:
```bash
pip install -r requirements.txt
```

### Running the Flask Application
1. Start the Flask server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

### Flask API Endpoints

#### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/<id>` - Get a specific customer with notes
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/<id>` - Update a customer
- `DELETE /api/customers/<id>` - Delete a customer

#### Notes
- `POST /api/customers/<id>/notes` - Add a note to a customer
- `DELETE /api/notes/<id>` - Delete a note

### Database Schema

#### Customer Table
- `id` (Integer, Primary Key)
- `first_name` (String, Required)
- `last_name` (String, Required)
- `email` (String, Required, Unique)
- `phone` (String, Optional)
- `company` (String, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Note Table
- `id` (Integer, Primary Key)
- `customer_id` (Integer, Foreign Key)
- `content` (Text, Required)
- `created_at` (DateTime)