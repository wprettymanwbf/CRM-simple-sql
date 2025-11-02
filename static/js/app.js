// API base URL
const API_URL = '/api';

// Modal elements
const customerModal = document.getElementById('customerModal');
const detailsModal = document.getElementById('detailsModal');
const customerForm = document.getElementById('customerForm');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');

// Close buttons for modals
const closeButtons = document.getElementsByClassName('close');
for (let closeBtn of closeButtons) {
    closeBtn.onclick = function() {
        customerModal.style.display = 'none';
        detailsModal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == customerModal) {
        customerModal.style.display = 'none';
    }
    if (event.target == detailsModal) {
        detailsModal.style.display = 'none';
    }
}

// Add customer button
addCustomerBtn.onclick = function() {
    openCustomerModal();
}

// Cancel button
cancelBtn.onclick = function() {
    customerModal.style.display = 'none';
}

// Search functionality
searchInput.addEventListener('input', function(e) {
    filterCustomers(e.target.value);
});

// Customer form submission
customerForm.onsubmit = async function(e) {
    e.preventDefault();
    await saveCustomer();
}

// Load customers on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
});

// Function to load all customers
async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
        showError('Failed to load customers');
    }
}

// Function to display customers
function displayCustomers(customers) {
    const customerList = document.getElementById('customerList');
    
    if (customers.length === 0) {
        customerList.innerHTML = `
            <div class="empty-state">
                <h2>No customers yet</h2>
                <p>Click "Add New Customer" to get started</p>
            </div>
        `;
        return;
    }
    
    customerList.innerHTML = customers.map(customer => `
        <div class="customer-card" data-id="${customer.id}">
            <h3>${escapeHtml(customer.first_name)} ${escapeHtml(customer.last_name)}</h3>
            <div class="customer-info">
                <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
                ${customer.phone ? `<p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>` : ''}
                ${customer.company ? `<p><strong>Company:</strong> ${escapeHtml(customer.company)}</p>` : ''}
            </div>
            <div class="customer-actions">
                <button class="btn btn-info" onclick="viewCustomer(${customer.id}); event.stopPropagation();">View Details</button>
                <button class="btn btn-success" onclick="editCustomer(${customer.id}); event.stopPropagation();">Edit</button>
                <button class="btn btn-danger" onclick="deleteCustomer(${customer.id}); event.stopPropagation();">Delete</button>
            </div>
        </div>
    `).join('');
}

// Function to filter customers
function filterCustomers(searchTerm) {
    const cards = document.querySelectorAll('.customer-card');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(lowerSearchTerm) ? 'block' : 'none';
    });
}

// Function to open customer modal
function openCustomerModal(customer = null) {
    const modalTitle = document.getElementById('modalTitle');
    const customerId = document.getElementById('customerId');
    
    if (customer) {
        modalTitle.textContent = 'Edit Customer';
        customerId.value = customer.id;
        document.getElementById('firstName').value = customer.first_name;
        document.getElementById('lastName').value = customer.last_name;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone || '';
        document.getElementById('company').value = customer.company || '';
    } else {
        modalTitle.textContent = 'Add New Customer';
        customerId.value = '';
        customerForm.reset();
    }
    
    customerModal.style.display = 'block';
}

// Function to save customer (create or update)
async function saveCustomer() {
    const customerId = document.getElementById('customerId').value;
    const customerData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value
    };
    
    try {
        const url = customerId ? `${API_URL}/customers/${customerId}` : `${API_URL}/customers`;
        const method = customerId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        
        if (response.ok) {
            customerModal.style.display = 'none';
            customerForm.reset();
            await loadCustomers();
            showSuccess(customerId ? 'Customer updated successfully' : 'Customer created successfully');
        } else {
            const error = await response.json();
            showError(error.error || 'Failed to save customer');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        showError('Failed to save customer');
    }
}

// Function to edit customer
async function editCustomer(customerId) {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}`);
        const customer = await response.json();
        openCustomerModal(customer);
    } catch (error) {
        console.error('Error loading customer:', error);
        showError('Failed to load customer');
    }
}

// Function to delete customer
async function deleteCustomer(customerId) {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all associated notes.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCustomers();
            showSuccess('Customer deleted successfully');
        } else {
            showError('Failed to delete customer');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        showError('Failed to delete customer');
    }
}

// Function to view customer details
async function viewCustomer(customerId) {
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}`);
        const customer = await response.json();
        
        const detailsContent = document.getElementById('customerDetails');
        detailsContent.innerHTML = `
            <div class="details-header">
                <h2>${escapeHtml(customer.first_name)} ${escapeHtml(customer.last_name)}</h2>
                <div class="details-actions">
                    <button class="btn btn-success" onclick="editCustomer(${customer.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteCustomer(${customer.id}); detailsModal.style.display='none';">Delete</button>
                </div>
            </div>
            
            <div class="details-info">
                <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(customer.phone || 'N/A')}</p>
                <p><strong>Company:</strong> ${escapeHtml(customer.company || 'N/A')}</p>
                <p><strong>Created:</strong> ${formatDate(customer.created_at)}</p>
                <p><strong>Last Updated:</strong> ${formatDate(customer.updated_at)}</p>
            </div>
            
            <div class="notes-section">
                <h3>Notes & Interactions</h3>
                <div class="notes-list" id="notesList">
                    ${customer.notes && customer.notes.length > 0 
                        ? customer.notes.map(note => `
                            <div class="note-item">
                                <div class="note-header">
                                    <span class="note-date">${formatDate(note.created_at)}</span>
                                    <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px;" onclick="deleteNote(${note.id}, ${customer.id})">Delete</button>
                                </div>
                                <div class="note-content">${escapeHtml(note.content)}</div>
                            </div>
                        `).join('')
                        : '<p style="color: #999;">No notes yet</p>'
                    }
                </div>
                
                <div class="note-form">
                    <textarea id="noteContent" placeholder="Add a new note..."></textarea>
                    <button class="btn btn-primary" style="margin-top: 10px;" onclick="addNote(${customer.id})">Add Note</button>
                </div>
            </div>
        `;
        
        detailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading customer details:', error);
        showError('Failed to load customer details');
    }
}

// Function to add note
async function addNote(customerId) {
    const noteContent = document.getElementById('noteContent').value.trim();
    
    if (!noteContent) {
        showError('Please enter a note');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/customers/${customerId}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: noteContent })
        });
        
        if (response.ok) {
            document.getElementById('noteContent').value = '';
            await viewCustomer(customerId);
            showSuccess('Note added successfully');
        } else {
            showError('Failed to add note');
        }
    } catch (error) {
        console.error('Error adding note:', error);
        showError('Failed to add note');
    }
}

// Function to delete note
async function deleteNote(noteId, customerId) {
    if (!confirm('Are you sure you want to delete this note?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/notes/${noteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await viewCustomer(customerId);
            showSuccess('Note deleted successfully');
        } else {
            showError('Failed to delete note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
        showError('Failed to delete note');
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Show success message
function showSuccess(message) {
    alert(message); // Simple alert for now
}

// Show error message
function showError(message) {
    alert('Error: ' + message); // Simple alert for now
}
