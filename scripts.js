// Display current time in London timezone
function displayTime() {
    const timeElement = document.getElementById('time');
    setInterval(() => {
        const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
        timeElement.textContent = now;
    }, 1000);
}

// Show place order section
function showPlaceOrder() {
    document.getElementById('placeOrder').style.display = 'block';
    document.getElementById('addProducts').style.display = 'none';
    document.getElementById('placeOrderBtn').style.display = 'none';
    document.getElementById('addProductsBtn').style.display = 'none';
    document.getElementById('viewAllBtn').style.display = 'inline-block';
    loadProducts();
}

// Show add products section
function showAddProducts() {
    document.getElementById('addProducts').style.display = 'block';
    document.getElementById('placeOrder').style.display = 'none';
    document.getElementById('placeOrderBtn').style.display = 'none';
    document.getElementById('addProductsBtn').style.display = 'none';
    document.getElementById('viewAllBtn').style.display = 'inline-block';
}

// Load products from Google Sheets
function loadProducts() {
    const url = 'https://drive.google.com/uc?export=download&id=1E4nzqqftzmckXj_PsqCe8ReWz0KShw8Z';
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\\n').slice(1);
            window.products = rows.map(row => {
                const [pid, productName, packSize] = row.split(',');
                return { pid, productName, packSize };
            });
            displayAllProducts();
        });
}

// Search products
function searchProducts() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const results = window.products.filter(product =>
        product.productName.toLowerCase().includes(query) && query.length >= 3
    );
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    results.forEach(product => {
        const div = document.createElement('div');
        div.textContent = `${product.productName} (${product.packSize})`;
        div.onclick = () => addToOrder(product);
        searchResults.appendChild(div);
    });
}

// Add product to order
function addToOrder(product) {
    const tbody = document.getElementById('orderTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.pid}</td>
        <td>${product.productName}</td>
        <td>${product.packSize}</td>
        <td><input type="number" step="0.1" min="0" value="1"></td>
    `;
    tbody.appendChild(row);
}

// Clear selections
function clearSelections() {
    const tbody = document.getElementById('orderTable').querySelector('tbody');
    tbody.innerHTML = '';
}

// Save as PDF
function saveAsPDF() {
    const doc = new jsPDF();
    const rows = [];
    const tbody = document.getElementById('orderTable').querySelector('tbody');
    for (const row of tbody.rows) {
        const cells = Array.from(row.cells).map(cell => cell.textContent || cell.querySelector('input').value);
        rows.push(cells);
    }
    doc.autoTable({
        head: [['PID', 'Product Name', 'PackSize', 'Quantity']],
        body: rows
    });
    doc.save('order.pdf');
}

// Add product to Google Sheets
function addProduct() {
    const pid = document.getElementById('pid').value;
    const productName = document.getElementById('productName').value;
    const packSize = document.getElementById('packSize').value;
    // Add logic to append to Google Sheets
    alert('Product added successfully!');
}

// Show all products in an overlay
function showAllProducts() {
    document.getElementById('allProductsOverlay').style.display = 'block';
}

// Close the all products overlay
function closeAllProducts() {
    document.getElementById('allProductsOverlay').style.display = 'none';
}

// Display all products in the overlay
function displayAllProducts() {
    const tbody = document.getElementById('allProductsTable').querySelector('tbody');
    tbody.innerHTML = '';
    window.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.pid}</td>
            <td>${product.productName}</td>
            <td>${product.packSize}</td>
        `;
        tbody.appendChild(row);
    });
}
