# 💸 Expense Tracker - Modern MERN Financial Platform

A full-stack, production-ready Expense Tracker web application built with **React.js, Node.js, Express.js, MongoDB Atlas, and JWT Authentication**, featuring intelligent cashflow charts, multi-category budgeting, and one-click PDF/Excel report exports.

---

## 📁 Project Architecture & Folder Structure

```
MY-PROJECT
│
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── assets/             # Images & static media
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Sticky navbar with theme & auth state
│   │   │   ├── Sidebar.jsx     # Side drawer navigation
│   │   │   ├── Footer.jsx      # Responsive footer
│   │   │   ├── DashboardCards.jsx # Net Balance, Income, Expense, Savings cards
│   │   │   ├── IncomeForm.jsx  # Add/edit income form
│   │   │   ├── ExpenseForm.jsx # Add/edit expense form
│   │   │   ├── TransactionTable.jsx # Interactive sorted transaction table
│   │   │   ├── SearchBar.jsx   # Live search input with clear trigger
│   │   │   ├── Filters.jsx     # Date range, category, amount filters
│   │   │   ├── Pagination.jsx  # Page navigation component
│   │   │   ├── Charts.jsx      # Chart.js visualizations (Line, Bar, Doughnut)
│   │   │   ├── Loader.jsx      # Loading spinners
│   │   │   ├── Modal.jsx       # Accessible modal dialogs
│   │   │   ├── Toast.jsx       # Toast notifications
│   │   │   ├── ProfileCard.jsx # User profile overview card
│   │   │   └── ThemeToggle.jsx # Dark / Light mode toggle
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx # Authentication, JWT token & user state
│   │   │   └── ThemeContext.jsx# Dark/Light theme provider
│   │   ├── hooks/
│   │   │   └── useDebounce.js  # Debounce hook for real-time search
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing hero page
│   │   │   ├── Login.jsx       # User login & Quick Demo access
│   │   │   ├── Register.jsx    # Registration with currency selector
│   │   │   ├── Dashboard.jsx   # Main metrics & visual analytics
│   │   │   ├── Income.jsx      # Income ledger management
│   │   │   ├── Expenses.jsx    # Expenses ledger management
│   │   │   ├── Reports.jsx     # Annual & monthly analytics with export
│   │   │   ├── Profile.jsx     # User details & password change
│   │   │   ├── Settings.jsx    # Custom categories & full data backup
│   │   │   └── NotFound.jsx    # 404 error page
│   │   ├── services/
│   │   │   └── api.js          # Axios instance with Bearer interceptors
│   │   ├── utils/
│   │   │   ├── formatters.js   # Currency, date & category helpers
│   │   │   ├── exportPdf.js    # jsPDF + autoTable PDF export
│   │   │   └── exportExcel.js  # XLSX SheetJS export
│   │   ├── App.jsx             # React Router routing configuration
│   │   ├── main.jsx            # React 18 DOM mount point
│   │   └── index.css           # Glassmorphism & modern design system
│   ├── index.html              # HTML5 template with Google fonts
│   ├── package.json            # Client dependencies
│   └── vite.config.js          # Vite config & backend proxy
│
├── config/
│   └── db.js                   # Mongoose MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, profile, password
│   ├── incomeController.js     # Income CRUD, search, filter, pagination
│   ├── expenseController.js    # Expense CRUD, search, filter, pagination
│   ├── categoryController.js   # Default category seeding & custom categories
│   ├── dashboardController.js  # Net balance, savings rate, 6-month trends
│   └── reportController.js     # Monthly breakdown, yearly comparison
├── middleware/
│   ├── auth.js                 # JWT verification protect middleware
│   └── errorHandler.js         # Centralized error response formatter
├── models/
│   ├── User.js                 # User schema with bcrypt password hashing
│   ├── Income.js               # Income transaction schema
│   ├── Expense.js              # Expense transaction schema
│   └── Category.js             # Category schema & default categories seeder
├── routes/
│   ├── authRoutes.js           # /api/auth routes
│   ├── incomeRoutes.js         # /api/income routes
│   ├── expenseRoutes.js        # /api/expense routes
│   ├── categoryRoutes.js       # /api/categories routes
│   ├── dashboardRoutes.js      # /api/dashboard routes
│   └── reportRoutes.js         # /api/report routes
├── .env                        # Local environment variables
├── env-example                 # Example template for environment config
├── Dockerfile                  # Multi-stage production container build
├── index.js                    # Express application entrypoint
├── package.json                # Root backend dependencies
└── README.md                   # Full documentation & setup guide
```

---

## 🚀 Key Features

- **Authentication & Security**:
  - JWT (JSON Web Token) authentication with 30-day persistence.
  - Salted bcrypt password hashing.
  - User-isolated database queries (users only access their own data).
- **Interactive Dashboard**:
  - Net Balance, Total Income, Total Expense, and Savings Rate % metrics.
  - 6-Month Income vs Expense trend bar chart.
  - Category spending doughnut chart with customized color codes.
  - Recent transactions activity table.
  - Quick Add Income and Quick Add Expense modal dialogues.
- **Income & Expense Modules**:
  - Full CRUD operations (Add, Edit, Delete).
  - Real-time search by title or description notes.
  - Multi-criteria filters: Category, Date Range (From/To), Min/Max Amount, Sorting.
  - Paginated transaction records.
- **Reports & Exporting**:
  - Annual and monthly comparison charts.
  - Export structured **PDF statements** via `jsPDF` and `jspdf-autotable`.
  - Export formatted **Excel spreadsheets** via `xlsx` (SheetJS).
- **Categories & Customization**:
  - Pre-seeded default categories: `Food`, `Travel`, `Shopping`, `Bills`, `Entertainment`, `Medical`, `Salary`, `Business`, `Investment`, `Education`, `Others`.
  - Custom category builder with custom color pickers.
- **Modern User Experience**:
  - High-performance Dark Mode and Light Mode with CSS custom properties.
  - Responsive layouts on mobile, tablet, and desktop viewports.
  - Fast Demo Login button for instantaneous exploration.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, React Router DOM, Axios, Lucide React, Chart.js, React-ChartJS-2, jsPDF, XLSX (SheetJS), Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB Atlas / Mongoose, JWT (jsonwebtoken), bcryptjs, Morgan, CORS, Dotenv.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense_tracker?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_expense_tracker_2026_modern_secure
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or a local MongoDB server running.

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Start backend in development mode
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start frontend dev server
npm run dev
# Frontend will start on http://localhost:3000
```

---

## 📡 API Reference

### Auth Endpoints
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `GET /api/auth/profile` - Fetch current user info (Protected).
- `PUT /api/auth/profile` - Update name, email, or currency (Protected).
- `PUT /api/auth/password` - Change account password (Protected).

### Income Endpoints
- `GET /api/income` - Retrieve filtered & paginated incomes (Protected).
- `POST /api/income` - Add new income (Protected).
- `PUT /api/income/:id` - Update income record (Protected).
- `DELETE /api/income/:id` - Delete income record (Protected).

### Expense Endpoints
- `GET /api/expense` - Retrieve filtered & paginated expenses (Protected).
- `POST /api/expense` - Add new expense (Protected).
- `PUT /api/expense/:id` - Update expense record (Protected).
- `DELETE /api/expense/:id` - Delete expense record (Protected).

### Dashboard & Reports
- `GET /api/dashboard` - Get aggregated metrics, 6-month trends, and recent transactions (Protected).
- `GET /api/report/monthly?year=2026` - Get monthly breakdown for selected year (Protected).
- `GET /api/report/yearly` - Get historical yearly comparison (Protected).
- `GET /api/report/category-pie?type=expense` - Get category spending distribution (Protected).
- `GET /api/categories` - List default and custom user categories (Protected).
- `POST /api/categories` - Create custom category (Protected).
- `DELETE /api/categories/:id` - Delete custom category (Protected).

---

## 🐳 Docker Deployment

To build and run the multi-stage production Docker container:

```bash
# Build the Docker image
docker build -t expense-tracker-app .

# Run the container
docker run -p 5000:5000 --env-file .env expense-tracker-app
```

---

## 🧪 Testing

1. Register a user or click **"Quick Demo Login"** on `/login`.
2. Add multiple Income and Expense items across different categories.
3. Verify live updates on the **Dashboard** metrics and Chart.js visualizations.
4. Navigate to **Reports** and test **PDF Export** and **Excel Export**.
5. Switch between **Dark Mode** and **Light Mode** using the theme toggle in the navigation bar.
