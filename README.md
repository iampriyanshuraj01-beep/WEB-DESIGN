# 📦 InventPro - Advanced Inventory Management System

A modern, feature-rich **Inventory Management System** built with pure HTML, CSS, and JavaScript. Manage products, billing, sales, GST compliance, and business reports all in one elegant dashboard—no backend required!

## ✨ Features

### 🎯 Core Features
- **Product Management** - Add, edit, delete, and manage inventory with real-time stock tracking
- **Smart Billing System** - Generate professional tax invoices with automatic GST calculation
- **Sales Tracking** - Monitor completed sales with profit and tax analysis
- **Stock Reports** - Real-time inventory valuation by category
- **Business Compliance** - Store GST, PAN, and other official business IDs
- **Advanced Analytics** - Dashboard with live KPIs and activity tracking

### 💰 Financial Capabilities
- **Cost & Profit Tracking** - Automatic profit calculation (Selling Price - Cost Price)
- **GST Management** - Configure GST rates per product (supports variable rates like 5%, 12%, 18%)
- **Invoice Generation** - Tax-compliant invoices with itemized breakdown, subtotal, GST, and grand total
- **Sales Reports** - Historical sales data with profit margins and tax collection

### 📊 Dashboard Metrics
- Total Products Count
- Total Stock Units
- Total Sales Revenue
- Total Profit Earned
- Total GST Collected
- Category-wise Stock Valuation
- Recent Activity Log

### 🔒 Data Storage
- **localStorage** - All data persists in the browser (no server needed)
- Data Backup - Export and import functionality for data security
- Real-time Sync - Updates reflect instantly across all sections

## 🎨 Design Highlights

- **Modern UI** - Clean, professional interface with gradients and shadows
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Dark Sidebar** - Professional navigation with categorized menu
- **Color-Coded Status** - Visual indicators for stock levels (Available, Low Stock, Out of Stock)
- **Interactive Tables** - Sortable, searchable, and filterable product and sales lists

## 🚀 Getting Started

### Installation
1. Download or clone the repository
2. Open `HTML5.HTML` in any modern web browser
3. Start managing your inventory immediately

### First Steps
1. Navigate to **Products** section
2. Click "Add Product" and enter product details (name, SKU, cost price, selling price, stock, GST rate)
3. Go to **Billing** to create your first invoice
4. View **Sales** history and **Reports** for business insights

## 📋 How It Works

### Sections Breakdown

| Section | Purpose |
|---------|---------|
| **Dashboard** | Overview of business metrics, inventory value, and recent activities |
| **Products** | Complete inventory management with search, filter, edit, and delete |
| **Billing** | Create tax invoices and print them |
| **Sales** | View all completed sales with profit and GST breakdown |
| **Reports** | Stock reports and business summary |
| **Compliance** | Store business IDs (GSTIN, PAN, License) and access official filing portals |

## 🔧 Technical Stack

- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (No frameworks or libraries)
- **Storage**: Browser localStorage API
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)

## 💡 Key Calculations

### Profit Calculation
```
Profit = (Selling Price - Cost Price) × Quantity Sold
```

### GST Calculation
```
GST Amount = (Selling Price × Quantity × GST Rate) / 100
Grand Total = Subtotal + GST Amount
```

### Inventory Value
```
Inventory Value = Stock × Selling Price (per product)
```

## 📱 Features for Mobile Users

- **Responsive Grid** - Adapts to smaller screens
- **Optimized Tables** - Horizontal scrolling for data
- **Touch-Friendly** - Large buttons and inputs for easy interaction

## 🎯 Use Cases

✅ Small retail shops (electronics, furniture, stationery)  
✅ E-commerce inventory tracking  
✅ Warehouse management  
✅ Billing and invoicing  
✅ Tax compliance tracking  
✅ Profit analysis for SMEs  

## 📊 Sample Data

The system comes pre-loaded with sample products:
- Dell Inspiron Laptop (Electronics)
- Office Chair Premium (Furniture)
- Wireless Mouse (Accessories)
- HP Laser Printer (Office Items)
- A4 Notebook Pack (Stationery)

**Feel free to delete these and add your own products!**

## 🔐 Data Privacy

All your data is stored **locally in your browser**. No information is sent to any server. Your business data remains completely private and secure.

## 📝 Compliance & Taxes

This system calculates sales, profit, and GST for learning and reference purposes. For official tax filing:

- **GST Portal**: [https://www.gst.gov.in/](https://www.gst.gov.in/)
- **Income Tax Filing**: [https://www.incometax.gov.in/](https://www.incometax.gov.in/)

⚠️ **Important**: Always verify tax filing details with a qualified CA (Chartered Accountant) or official portals before submission.

## 🎨 Customization

### Modify Colors
Edit the CSS variables in the `<style>` section:
```css
:root {
  --blue: #2563eb;    /* Change primary color */
  --bg: #eef3f8;      /* Change background */
  --dark: #101828;    /* Change text color */
}
```

### Add Categories
Edit the category dropdown in the Products form to add new inventory categories.

### Change Currency
Replace "Rs." with your currency symbol in the `money()` function (JavaScript).

## 🐛 Browser Support

✅ Chrome (Recommended)  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile Browsers  

## 📞 Support & Feedback

Found a bug or have a feature request? Feel free to open an issue or reach out!

## 📄 License

This project is open-source and available for personal and commercial use.

---

**Made with ❤️ for inventory management**

**Version**: 1.0 | **Last Updated**: 2024
