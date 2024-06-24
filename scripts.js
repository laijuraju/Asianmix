let workbook;
let sheet;
let productList = [];

async function loadExcel() {
    const response = await fetch('products.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    workbook = XLSX.read(data, { type: 'array' });
    sheet = workbook.Sheets[workbook.SheetNames[0]];
    productList = XLSX.utils.sheet_to_json(sheet);
}

function saveExcel() {
    const newSheet = XLSX.utils.json_to_sheet(productList);
    workbook.Sheets[workbook.SheetNames[0]] = newSheet;
    XLSX.writeFile(workbook, 'products.xlsx');
}

document.getElementById('add-product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const pid = document.getElementById('pid').value;
    const productName = document.getElementById('product-name').value;
    const packetSize = document.getElementById('packet-size').value;

    if (productList.some(product => product.PID === pid)) {
        document.getElementById('add-product-message').innerText = 'PID already exists';
        return;
    }

    productList.push({ PID: pid, 'Product Name': productName, 'Packet Size': packetSize });
    saveExcel();

    document.getElementById('add-product-message').innerText = 'Product added successfully';
    document.getElementById('add-product-form').reset();
});

document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredProducts = productList.filter(product => product['Product Name'].toLowerCase().includes(query));

    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = '';
    filteredProducts.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.PID} - ${product['Product Name']}`;
        li.addEventListener('click', () => addToOrder(product));
        productListElement.appendChild(li);
    });
});

function addToOrder(product) {
    const orderList = document.getElementById('order-list');
    const orderItem = document.createElement('div');
    orderItem.innerHTML = `
        <span>${product.PID}</span>
        <span>${product['Product Name']}</span>
        <input type="number" value="1" min="1">
    `;
    orderList.appendChild(orderItem);
}

document.getElementById('save-order').addEventListener('click', function () {
    const orderItems = Array.from(document.getElementById('order-list').children);
    const order = orderItems.map(item => {
        const pid = item.children[0].innerText;
        const productName = item.children[1].innerText;
        const quantity = item.children[2].value;
        return { pid, productName, quantity };
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Order List', 10, 10);
    order.forEach((item, index) => {
        doc.text(`${item.pid} - ${item.productName} - Quantity: ${item.quantity}`, 10, 20 + index * 10);
    });
    doc.save('order.pdf');
});

window.onload = loadExcel;