// Sample data for demonstration
const sampleProducts = [
  { id: 1, name: "Dell Inspiron Laptop", sku: "LP-1001", category: "Electronics", cost: 50000, price: 56000, stock: 42, gst: 18, supplier: "TechSource India" },
  { id: 2, name: "Office Chair Premium", sku: "FR-2024", category: "Furniture", cost: 3200, price: 4500, stock: 18, gst: 18, supplier: "WorkFit Furnishings" },
  { id: 3, name: "Wireless Mouse", sku: "AC-3311", category: "Accessories", cost: 450, price: 799, stock: 160, gst: 18, supplier: "CorePack Supplies" },
  { id: 4, name: "HP Laser Printer", sku: "PR-7782", category: "Office Items", cost: 12000, price: 14999, stock: 0, gst: 18, supplier: "OfficeHub Traders" },
  { id: 5, name: "A4 Notebook Pack", sku: "ST-5050", category: "Stationery", cost: 80, price: 120, stock: 230, gst: 12, supplier: "PaperLine Distributors" }
];

// Initialize data from localStorage or use sample data
let products = JSON.parse(localStorage.getItem("advProducts")) || sampleProducts;
let sales = JSON.parse(localStorage.getItem("advSales")) || [];
let activities = JSON.parse(localStorage.getItem("advActivities")) || ["System started with advanced inventory data."];
let compliance = JSON.parse(localStorage.getItem("advCompliance")) || {};
let invoice = [];
let filter = "All";

/**
 * Format number as Indian currency
 * @param {number} n - Number to format
 * @returns {string} Formatted currency string
 */
function money(n) {
  return "Rs. " + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/**
 * Save all data to localStorage
 */
function save() {
  localStorage.setItem("advProducts", JSON.stringify(products));
  localStorage.setItem("advSales", JSON.stringify(sales));
  localStorage.setItem("advActivities", JSON.stringify(activities));
  localStorage.setItem("advCompliance", JSON.stringify(compliance));
}

/**
 * Add activity log entry
 * @param {string} text - Activity description
 */
function activity(text) {
  activities.unshift(text);
  activities = activities.slice(0, 6);
  save();
}

/**
 * Determine stock status
 * @param {number} stock - Stock quantity
 * @returns {string} Status text
 */
function status(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock <= 20) return "Low Stock";
  return "Available";
}

/**
 * Get CSS class for status badge
 * @param {string} statusText - Status text
 * @returns {string} CSS class name
 */
function statusClass(statusText) {
  return statusText === "Available" ? "available" : statusText === "Low Stock" ? "low" : "out";
}

/**
 * Show specific page and hide others
 * @param {string} id - Page ID to show
 * @param {HTMLElement} btn - Button element clicked
 */
function showPage(id, btn) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".menu button").forEach(button => button.classList.remove("active"));
  btn.classList.add("active");

  renderAll();
}

/**
 * Product form submission handler
 */
productForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const id = editId.value;

  const product = {
    id: id ? Number(id) : Date.now(),
    name: pName.value.trim(),
    sku: pSku.value.trim(),
    category: pCategory.value,
    cost: Number(pCost.value),
    price: Number(pPrice.value),
    stock: Number(pStock.value),
    gst: Number(pGst.value),
    supplier: pSupplier.value.trim()
  };

  if (id) {
    products = products.map(item => item.id === product.id ? product : item);
    activity(product.name + " updated.");
  } else {
    products.push(product);
    activity(product.name + " added.");
  }

  save();
  resetForm();
  renderAll();
  msg.textContent = "Product saved successfully.";
});

/**
 * Reset product form to initial state
 */
function resetForm() {
  productForm.reset();
  editId.value = "";
  pGst.value = 18;
  formTitle.textContent = "Add Product";
  saveBtn.textContent = "Save Product";
}

/**
 * Load product into form for editing
 * @param {number} id - Product ID to edit
 */
function editProduct(id) {
  const product = products.find(item => item.id === id);

  editId.value = product.id;
  pName.value = product.name;
  pSku.value = product.sku;
  pCategory.value = product.category;
  pCost.value = product.cost;
  pPrice.value = product.price;
  pStock.value = product.stock;
  pGst.value = product.gst;
  pSupplier.value = product.supplier;

  formTitle.textContent = "Edit Product";
  saveBtn.textContent = "Update Product";

  showPage("products", document.querySelectorAll(".menu button")[1]);
}

/**
 * Delete product with confirmation
 * @param {number} id - Product ID to delete
 */
function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const product = products.find(item => item.id === id);
  products = products.filter(item => item.id !== id);

  activity(product.name + " deleted.");
  save();
  renderAll();
}

/**
 * Navigate to billing page with product pre-selected
 * @param {number} id - Product ID to sell
 */
function sellNow(id) {
  showPage("billing", document.querySelectorAll(".menu button")[2]);
  sellProduct.value = id;
  sellQty.focus();
}

/**
 * Set active filter and re-render products
 * @param {string} selectedFilter - Filter name
 * @param {HTMLElement} btn - Filter button clicked
 */
function setFilter(selectedFilter, btn) {
  filter = selectedFilter;

  document.querySelectorAll(".chip").forEach(chip => chip.classList.remove("active"));
  btn.classList.add("active");

  renderProducts();
}

/**
 * Render product table with search and filter
 */
function renderProducts() {
  const query = globalSearch.value.toLowerCase();
  productTable.innerHTML = "";

  const list = products.filter(product => {
    const currentStatus = status(product.stock);
    const searchableText = (product.name + product.sku + product.category + product.supplier).toLowerCase();

    return searchableText.includes(query) && (filter === "All" || filter === currentStatus);
  });

  if (!list.length) {
    productTable.innerHTML = "<tr><td colspan='9'>No products found.</td></tr>";
    return;
  }

  list.forEach(product => {
    const currentStatus = status(product.stock);

    productTable.innerHTML += `
      <tr>
        <td><b>${product.name}</b><br><small>${product.sku}</small></td>
        <td>${product.category}</td>
        <td>${product.stock}</td>
        <td>${money(product.cost)}</td>
        <td>${money(product.price)}</td>
        <td>${product.gst}%</td>
        <td>${money(product.price * product.stock)}</td>
        <td><span class="badge ${statusClass(currentStatus)}">${currentStatus}</span></td>
        <td>
          <div class="actions">
            <button class="small sell" onclick="sellNow(${product.id})">Sell</button>
            <button class="small edit" onclick="editProduct(${product.id})">Edit</button>
            <button class="small del" onclick="deleteProduct(${product.id})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });
}

/**
 * Render dashboard with key metrics
 */
function renderDashboard() {
  const totalStockValue = products.reduce((sum, product) => sum + product.stock, 0);
  const totalInventoryValue = products.reduce((sum, product) => sum + product.stock * product.price, 0);
  const totalSaleValue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfitValue = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalGSTValue = sales.reduce((sum, sale) => sum + sale.gst, 0);

  totalProducts.textContent = products.length;
  totalStock.textContent = totalStockValue;
  totalSales.textContent = money(totalSaleValue);
  totalProfit.textContent = money(totalProfitValue);
  totalGST.textContent = money(totalGSTValue);
  inventoryValue.textContent = money(totalInventoryValue);

  renderBars();
  renderActivities();
  renderReports();
}

/**
 * Render category-wise inventory value bars
 */
function renderBars() {
  const totals = {};

  products.forEach(product => {
    totals[product.category] = (totals[product.category] || 0) + product.stock * product.price;
  });

  const max = Math.max(...Object.values(totals), 1);
  categoryBars.innerHTML = "";

  Object.keys(totals).forEach(category => {
    const percent = Math.round((totals[category] / max) * 100);

    categoryBars.innerHTML += `
      <div class="bar">
        <div class="bar-title">
          <span>${category}</span>
          <span>${money(totals[category])}</span>
        </div>
        <div class="track">
          <div class="fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });
}

/**
 * Render recent activity log
 */
function renderActivities() {
  activityList.innerHTML = activities.map(item => `
    <div class="activity">
      <b>${item}</b><br>
      <span>Inventory update</span>
    </div>
  `).join("");
}

/**
 * Populate product select dropdown
 */
function renderSellSelect() {
  sellProduct.innerHTML = products.map(product => `
    <option value="${product.id}">${product.name} - Stock ${product.stock}</option>
  `).join("");
}

/**
 * Add item to invoice and update stock
 */
function addToInvoice() {
  const id = Number(sellProduct.value);
  const qty = Number(sellQty.value);
  const product = products.find(item => item.id === id);

  if (!cName.value.trim()) {
    alert("Enter customer name");
    return;
  }

  if (!qty || qty <= 0) {
    alert("Enter valid quantity");
    return;
  }

  if (qty > product.stock) {
    alert("Not enough stock");
    return;
  }

  product.stock -= qty;

  const taxableAmount = product.price * qty;
  const gstAmount = taxableAmount * product.gst / 100;
  const profitAmount = (product.price - product.cost) * qty;

  invoice.push({
    name: product.name,
    qty: qty,
    price: product.price,
    gst: gstAmount,
    total: taxableAmount + gstAmount,
    profit: profitAmount
  });

  invoiceCustomer.textContent = cName.value;

  activity(qty + " " + product.name + " added to invoice.");
  save();
  renderInvoice();
  renderAll();
}

/**
 * Render invoice table with totals
 */
function renderInvoice() {
  invoiceTable.innerHTML = "";

  let subtotal = 0;
  let gst = 0;
  let profit = 0;

  invoice.forEach(item => {
    subtotal += item.price * item.qty;
    gst += item.gst;
    profit += item.profit;

    invoiceTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${money(item.price)}</td>
        <td>${money(item.gst)}</td>
        <td>${money(item.total)}</td>
        <td>${money(item.profit)}</td>
      </tr>
    `;
  });

  subTotal.textContent = money(subtotal);
  gstAmount.textContent = money(gst);
  invoiceProfit.textContent = money(profit);
  grandTotal.textContent = money(subtotal + gst);
}

/**
 * Complete sale and save to history
 */
function completeSale() {
  if (!invoice.length) {
    alert("Invoice is empty");
    return;
  }

  const subtotal = invoice.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = invoice.reduce((sum, item) => sum + item.gst, 0);
  const profit = invoice.reduce((sum, item) => sum + item.profit, 0);
  const total = subtotal + gst;

  sales.unshift({
    invoice: invoiceNo.textContent,
    customer: cName.value || "Walk-in",
    phone: cPhone.value || "-",
    total: total,
    gst: gst,
    profit: profit,
    date: new Date().toLocaleString()
  });

  activity("Invoice " + invoiceNo.textContent + " completed.");

  invoice = [];
  save();
  renderInvoice();
  renderAll();
  window.print();
  newInvoice();
}

/**
 * Clear invoice without saving
 */
function clearInvoice() {
  invoice = [];
  renderInvoice();
  newInvoice();
}

/**
 * Generate new invoice number and date
 */
function newInvoice() {
  invoiceNo.textContent = "INV-" + Math.floor(100000 + Math.random() * 900000);
  invoiceDate.textContent = new Date().toLocaleString();
}

/**
 * Render sales history table
 */
function renderSales() {
  salesTable.innerHTML = sales.map(sale => `
    <tr>
      <td>${sale.invoice}</td>
      <td>${sale.customer}</td>
      <td>${sale.phone}</td>
      <td>${money(sale.total)}</td>
      <td>${money(sale.gst)}</td>
      <td>${money(sale.profit)}</td>
      <td>${sale.date}</td>
    </tr>
  `).join("") || "<tr><td colspan='7'>No sales yet.</td></tr>";
}

/**
 * Render reports section
 */
function renderReports() {
  const out = products.filter(product => product.stock === 0).length;
  const low = products.filter(product => product.stock > 0 && product.stock <= 20).length;
  const available = products.filter(product => product.stock > 20).length;

  const totalProfitValue = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalGSTValue = sales.reduce((sum, sale) => sum + sale.gst, 0);

  stockReport.innerHTML = `
    <div class="activity"><b>Available:</b> ${available}</div>
    <div class="activity"><b>Low Stock:</b> ${low}</div>
    <div class="activity"><b>Out of Stock:</b> ${out}</div>
  `;

  summaryReport.innerHTML = `
    <div class="activity"><b>Total Profit:</b> ${money(totalProfitValue)}</div>
    <div class="activity"><b>Total GST Collected:</b> ${money(totalGSTValue)}</div>
    <div class="activity"><b>Total Invoices:</b> ${sales.length}</div>
  `;
}

/**
 * Save compliance details to localStorage
 */
function saveCompliance() {
  compliance = {
    bizName: bizName.value,
    licenseNo: licenseNo.value,
    gstin: gstin.value,
    tinId: tinId.value,
    panNo: panNo.value
  };

  save();
  complianceMsg.textContent = "Compliance details saved in browser.";
}

/**
 * Load compliance details from localStorage
 */
function loadCompliance() {
  bizName.value = compliance.bizName || "";
  licenseNo.value = compliance.licenseNo || "";
  gstin.value = compliance.gstin || "";
  tinId.value = compliance.tinId || "";
  panNo.value = compliance.panNo || "";
}

/**
 * Render all sections
 */
function renderAll() {
  renderProducts();
  renderDashboard();
  renderSellSelect();
  renderSales();
  renderInvoice();
  loadCompliance();
}

// Initialize application
newInvoice();
renderAll();