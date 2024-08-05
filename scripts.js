// Display current time in London timezone
function displayTime() {
    const timeElement = document.getElementById('time');
    setInterval(() => {
        const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
        timeElement.textContent = now;
    }, 1000);
}

// Load products from GitHub CSV file
function loadProducts() {
    const url = 'https://raw.githubusercontent.com/laijuraju/laijuraju.github.io/main/products.csv';
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            window.products = rows.map(row => {
                const [pid, productName, packSize] = row.split(',');
                return { pid, productName, packSize };
            });
            displayProducts(window.products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Display products in the table
function displayProducts(products) {
    const tbody = document.getElementById('productTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous data
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.pid}</td>
            <td>${product.productName}</td>
            <td>${product.packSize}</td>
        `;
        tbody.appendChild(row);
    });
}

// Search products dynamically
function searchProducts() {
    if (!window.products || window.products.length === 0) {
        console.error('Products data not loaded.');
        return;
    }

    const query = document.getElementById('searchBar').value.toLowerCase();
    const filteredProducts = window.products.filter(product =>
        product.productName.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
}

// Clear search results
function clearSearch() {
    document.getElementById('searchBar').value = '';
    displayProducts(window.products);
}
