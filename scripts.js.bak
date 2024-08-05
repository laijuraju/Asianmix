// Display current time in London timezone
function displayTime() {
    const timeElement = document.getElementById('time');
    setInterval(() => {
        const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
        timeElement.textContent = now;
    }, 1000);
}

// Show and hide the main buttons
function toggleButtons() {
    document.querySelectorAll('main > button').forEach(btn => {
        btn.style.display = btn.style.display === 'none' ? 'block' : 'none';
    });
}

// Show the place order section
function showPlaceOrder() {
    document.getElementById('placeOrder').style.display = 'block';
    document.getElementById('addProducts').style.display = 'none';
    loadProducts();
}

// Show the add products section
function showAddProducts() {
    document.getElementById('addProducts').style.display = 'block';
    document.getElementById('placeOrder').style.display = 'none';
}

// Load products from Google Sheets
function loadProducts() {
    const url = 'https://drive.google.com/uc?id=1E4nzqqftzmckXj_PsqCe8ReWz0KShw8Z';
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\\n').slice(1);
            window.products = rows.map(row => {
                const [pid, productName, packSize] = row.split(',');
                return { pid, productName, packSize };
            });
        });
}

// Show all products in an overlay
function showAllProducts() {
    const allProductsDiv = document.getElementById('allProducts');
    allProductsDiv.innerHTML = '';
    window.products.forEach(product => {
        const div = document.createElement('div');
        div.textContent = `${product.productName} (${product.packSize})`;
        allProductsDiv.appendChild(div);
    });
    document.getElementById('allProductsOverlay').style.display = 'block';
}

// Close the all products overlay
function closeAllProducts() {
    document.getElementById('allProductsOverlay').style.display = 'none';
}
