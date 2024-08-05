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
            <td><input type="checkbox"></td>
            <td>${product.pid}</td>
            <td>${product.productName}</td>
            <td>${product.packSize}</td>
        `;
        tbody.appendChild(row);
    });
}

// Search products dynamically and highlight matching results
function searchProducts() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.querySelectorAll('#productTable tbody tr');
    
    rows.forEach(row => {
        row.classList.remove('highlight');
        if (row.textContent.toLowerCase().includes(query)) {
            row.classList.add('highlight');
            row.style.display = ''; // Show matching rows
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            row.style.display = 'none'; // Hide non-matching rows
        }
    });
}

// Clear search results and display all products
function clearSearch() {
    document.getElementById('searchBar').value = '';
    const rows = document.querySelectorAll('#productTable tbody tr');
    rows.forEach(row => {
        row.style.display = ''; // Show all rows
        row.classList.remove('highlight'); // Remove highlight
    });
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show preview of selected products
function showPreview() {
    const selectedProducts = [];
    const rows = document.querySelectorAll('#productTable tbody tr');
    rows.forEach(row => {
        if (row.querySelector('input[type="checkbox"]').checked) {
            const pid = row.cells[1].textContent;
            const productName = row.cells[2].textContent;
            selectedProducts.push({ pid, productName });
        }
    });

    const previewTableBody = document.getElementById('previewTable').querySelector('tbody');
    previewTableBody.innerHTML = ''; // Clear previous preview data

    selectedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.pid}</td>
            <td>${product.productName}</td>
            <td><input type="number" step="0.1" min="0" value="0.0"></td>
        `;
        previewTableBody.appendChild(row);
    });

    document.getElementById('previewOverlay').style.display = 'block';
}

// Close the preview overlay
function closePreview() {
    document.getElementById('previewOverlay').style.display = 'none';
}

// Save preview to PDF
function savePreviewToPDF() {
    const doc = new jsPDF();
    const rows = [];
    const previewTableBody = document.getElementById('previewTable').querySelector('tbody');
    for (const row of previewTableBody.rows) {
        const cells = Array.from(row.cells).map(cell => cell.querySelector('input') ? cell.querySelector('input').value : cell.textContent);
        rows.push(cells);
    }

    doc.text('Store Name', 14, 16);
    doc.text(new Date().toLocaleString(), 14, 22);
    doc.autoTable({
        head: [['PID', 'Product Name', 'Quantity']],
        body: rows,
        startY: 30
    });

    doc.save('preview.pdf');
}
