# Advanced Inventory Management System - Feature Documentation

## Core Features

### 1. Dashboard
**Location:** Home page after login

**Displays:**
- Total inventory value (Stock × Selling Price)
- Total products count
- Total stock units
- Total sales revenue
- Total profit earned
- Total GST collected
- Category-wise inventory valuation with visual bars
- Recent activity log (last 6 activities)

**Auto-calculating Metrics:**
- All totals update in real-time as transactions occur
- Category values refresh when stock changes

---

### 2. Product Management
**Location:** Products Tab

**Add/Edit Products:**
- Product Name (required)
- SKU/Part Number (unique identifier)
- Category (Electronics, Furniture, Accessories, Office Items, Stationery, General)
- Cost Price (for profit calculation)
- Selling Price (for revenue)
- Stock Quantity
- GST Rate (default 18%)
- Supplier Name

**Features:**
- Global search by product name, SKU, category, or supplier
- Filter by stock status:
  - All products
  - Available (stock > 20)
  - Low Stock (stock 1-20)
  - Out of Stock (stock = 0)
- Quick actions:
  - Sell (redirect to billing)
  - Edit (populate form for editing)
  - Delete (with confirmation)

**Stock Status Badge:**
- Green: Available
- Orange: Low Stock
- Red: Out of Stock

---

### 3. Billing & Invoice
**Location:** Billing Tab

**Invoice Creation:**
- Customer Name (required)
- Phone Number (optional but tracked)
- Product Selection (auto-populated from inventory)
- Quantity Input (validated against stock)

**Invoice Features:**
- Multiple products per invoice
- Auto-generated invoice number (INV-XXXXXX)
- Timestamp on every invoice
- Real-time subtotal calculation
- Automatic GST calculation per product
- Total profit calculation per invoice
- Grand Total with GST included

**Actions:**
- Save & Print (saves sale to history and triggers print dialog)
- Clear (reset invoice without saving)

**Validation:**
- Prevents negative quantities
- Checks stock availability
- Validates customer name
- Auto-deducts stock from inventory on sale

---

### 4. Sales History
**Location:** Sales Tab

**Displays:**
- Invoice Number
- Customer Name
- Phone Number
- Total Sale Amount
- GST Amount Collected
- Profit Earned
- Date and Time

**Features:**
- Complete transaction history
- Sortable by any column
- Profit tracking per transaction
- Tax compliance data

---

### 5. Reports
**Location:** Reports Tab

**Stock Report:**
- Count of available products
- Count of low stock items
- Count of out of stock items

**Business Summary:**
- Total profit earned (all sales)
- Total GST collected (tax liability)
- Total number of invoices/transactions

---

### 6. Compliance Management
**Location:** Compliance Tab

**Business Details Storage:**
- Business/Firm Name
- License Number (Trade/FSSAI/Shop)
- GSTIN (GST Identification Number)
- TIN ID (Optional/Legacy)
- PAN (Permanent Account Number)

**Features:**
- Secure browser storage
- Direct links to official portals:
  - Income Tax ITR e-Filing Portal
  - Official GST Portal
- Compliance reminder notes

---

## Technical Features

### Data Persistence
- **Storage:** Browser localStorage
- **Auto-save:** Every transaction
- **Data Keys:**
  - `advProducts` - Product inventory
  - `advSales` - Sales history
  - `advActivities` - Activity log
  - `advCompliance` - Business details

### Calculations

**Profit Calculation:**
```
Profit = (Selling Price - Cost Price) × Quantity
```

**GST Calculation:**
```
GST Amount = (Price × Quantity) × (GST Rate / 100)
Grand Total = Subtotal + GST Amount
```

**Inventory Value:**
```
Inventory Value = Stock × Selling Price (per product)
Total Inventory Value = Sum of all product values
```

### Search & Filter
- Real-time product search
- Multi-field search (name, SKU, category, supplier)
- Case-insensitive matching
- Filter combinations with status badges

### UI/UX
- Responsive design (works on mobile, tablet, desktop)
- Dark sidebar navigation
- Light content area
- Color-coded status indicators
- Interactive cards with hover effects
- Form validation with error messages
- Success confirmation messages

---

## Sample Data

The system comes with 5 sample products:

1. **Dell Inspiron Laptop**
   - SKU: LP-1001
   - Category: Electronics
   - Cost: ₹50,000 | Selling: ₹56,000
   - Stock: 42 | GST: 18%

2. **Office Chair Premium**
   - SKU: FR-2024
   - Category: Furniture
   - Cost: ₹3,200 | Selling: ₹4,500
   - Stock: 18 | GST: 18%

3. **Wireless Mouse**
   - SKU: AC-3311
   - Category: Accessories
   - Cost: ₹450 | Selling: ₹799
   - Stock: 160 | GST: 18%

4. **HP Laser Printer**
   - SKU: PR-7782
   - Category: Office Items
   - Cost: ₹12,000 | Selling: ₹14,999
   - Stock: 0 (Out of Stock) | GST: 18%

5. **A4 Notebook Pack**
   - SKU: ST-5050
   - Category: Stationery
   - Cost: ₹80 | Selling: ₹120
   - Stock: 230 | GST: 12%

---

## Browser Compatibility
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers with localStorage support

## Important Notes
- This system is for learning and demonstration
- All calculations should be verified with an accountant
- Tax compliance varies by region
- Official portals should be used for actual filing
