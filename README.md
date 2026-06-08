# ExpenSleek — Personal Expense Tracker

ExpenSleek is a production-ready, internship-level Personal Expense Tracker application built with **Node.js, Express.js, MongoDB, and Mongoose** following the **MVC architecture pattern**. It includes a modern, responsive **Glassmorphism dashboard** on the frontend that offers a dark/light mode, real-time transaction updates, advanced query capabilities, and dynamic visual analytics using Chart.js.

---

## Key Features

### Backend (RESTful API)
* **MVC Structure**: Clean separation of models, views (controllers), and routes.
* **Database Aggregation**: Real-time stats calculations including total outflow, monthly summary trends, and category-wise distributions.
* **Advanced Query Support**: Custom pagination, searching, sorting, and multi-parameter filters (dates, categories, payment methods, and amount ranges).
* **Robust Security**: Protected with `helmet` headers (configured for static CDNs) and CORS allowances.
* **Input Validation**: Strict request payload schema checking using `express-validator` middleware.
* **Centralized Error Handling**: Captures database exceptions (DuplicateKey, CastError, validation issues) and returns structured JSON responses.

### Frontend (Dashboard UI)
* **Premium Glassmorphism**: Translucent panels with background glow spots, smooth backdrop-blur styling, and vibrant neon accents.
* **Automatic Theme Switching**: Full dark and light mode toggle with local storage persistence.
* **Interactive Data Grid**: Sorting, real-time searching, pagination controls, and expanding advanced filter options.
* **Action Modals**: Add Expense, Edit Expense, and Confirm Delete actions run seamlessly without page refreshes.
* **Analytics Section**: Interactive Doughnut chart (category distribution) and Gradient Bar chart (monthly trends) powered by Chart.js.
* **Fully Responsive**: Adapts dynamically across mobile viewports, tablets, and desktops.

---

## Tech Stack
* **Backend**: Node.js, Express.js
* **Database**: MongoDB Atlas, Mongoose
* **Security & Utility**: Helmet, Cors, Morgan, Dotenv, Express-Validator
* **Frontend**: HTML5, CSS3 (Vanilla Custom Variables), Bootstrap 5, FontAwesome Icons, Chart.js

---

## Project Directory Tree
```
expense-tracker-backend/
├── config/
│   └── db.js                  # MongoDB Mongoose connection setup
├── controllers/
│   └── expenseController.js   # CRUD & Stats aggregate controller handlers
├── models/
│   └── Expense.js             # Mongoose Expense schema and index settings
├── routes/
│   └── expenseRoutes.js       # Express routing definitions
├── middleware/
│   ├── errorMiddleware.js     # Centralized global error parser
│   └── validationMiddleware.js# Intercepts express-validator results
├── validators/
│   └── expenseValidator.js    # Input body schema rules
├── utils/
│   ├── apiError.js            # Custom ApiError utility class
│   ├── apiResponse.js         # JSend success/paginated response wrappers
│   └── asyncHandler.js        # Catch async route exceptions helper
├── public/                    # Frontend Dashboard folder
│   ├── index.html             # UI Dashboard template structure
│   ├── css/
│   │   └── styles.css         # Glassmorphism & Theme variables styling
│   └── js/
│       └── app.js             # AJAX fetches, state management, and Chart.js settings
├── .env                       # Local environment variables configuration
├── .env.example               # Reference sample environment configuration
├── package.json               # Scripts, engines, and package dependencies
└── README.md                  # Comprehensive setup & API documentation
```

---

## Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/en) (v14+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) Cluster connection string.

### Setup Steps
1. **Clone or copy** this project folder to your workspace.
2. Navigate into the backend root:
   ```bash
   cd expense-tracker-backend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Create your `.env` file from the sample config:
   ```bash
   cp .env.example .env
   ```
5. Open `.env` and fill in your details:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/expense-tracker?retryWrites=true&w=majority
   NODE_ENV=development
   ```

### Running the Application
* **Development Server** (restarts automatically via nodemon):
  ```bash
  npm run dev
  ```
* **Production Build/Start**:
  ```bash
  npm start
  ```

Once started, open your browser and navigate to:
```
http://localhost:5000
```
This serves the frontend dashboard statically, and the client will automatically send REST calls to the backend on the same host!

---

## API Documentation

All request bodies must be sent with headers: `Content-Type: application/json`.

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/expenses` | Add a new expense |
| **GET** | `/api/expenses` | View all expenses (supports search, sort, filters, pagination) |
| **GET** | `/api/expenses/:id` | View a single expense by ID |
| **PUT** | `/api/expenses/:id` | Update an existing expense by ID |
| **DELETE** | `/api/expenses/:id` | Delete an expense by ID |
| **GET** | `/api/expenses/category/:category` | Filter expenses by Category path parameter |
| **GET** | `/api/expenses/stats` | Retrieve statistics (totals, category breakdown, monthly trends) |

---

### Endpoints Detail

#### 1. Add Expense
* **URL**: `/api/expenses`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "amount": 1250.50,
    "category": "Rent & Utilities",
    "date": "2026-06-05",
    "description": "Internet & Electricity Bill",
    "paymentMethod": "UPI"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Expense created successfully",
    "data": {
      "_id": "64bfbcae52f5c1d3c0135798",
      "amount": 1250.5,
      "category": "Rent & Utilities",
      "date": "2026-06-05T00:00:00.000Z",
      "description": "Internet & Electricity Bill",
      "paymentMethod": "UPI",
      "createdAt": "2026-06-06T17:28:00.123Z",
      "updatedAt": "2026-06-06T17:28:00.123Z",
      "__v": 0
    }
  }
  ```

#### 2. View All Expenses
* **URL**: `/api/expenses`
* **Method**: `GET`
* **Query Parameters (Optional)**:
  * `page` (default: 1)
  * `limit` (default: 10)
  * `sortBy` (options: `date:desc`, `date:asc`, `amount:desc`, `amount:asc` - default: `date:desc`)
  * `q` (Search string matching category or description)
  * `category` (Filter category: e.g., `Shopping`)
  * `paymentMethod` (Filter payment method: `Cash`, `UPI`, `Card`)
  * `startDate` & `endDate` (Date range bounds: e.g., `2026-06-01` and `2026-06-30`)
  * `minAmount` & `maxAmount` (Amount range filters)
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Expenses retrieved successfully",
    "pagination": {
      "totalItems": 15,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "data": [
      {
        "_id": "64bfbcae52f5c1d3c0135798",
        "amount": 1250.5,
        "category": "Rent & Utilities",
        "date": "2026-06-05T00:00:00.000Z",
        "description": "Internet & Electricity Bill",
        "paymentMethod": "UPI"
      }
    ]
  }
  ```

#### 3. View Single Expense
* **URL**: `/api/expenses/:id`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Expense retrieved successfully",
    "data": {
      "_id": "64bfbcae52f5c1d3c0135798",
      "amount": 1250.5,
      "category": "Rent & Utilities",
      "date": "2026-06-05T00:00:00.000Z",
      "description": "Internet & Electricity Bill",
      "paymentMethod": "UPI"
    }
  }
  ```

#### 4. Update Expense
* **URL**: `/api/expenses/:id`
* **Method**: `PUT`
* **Request Body**: Same schema as POST.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Expense updated successfully",
    "data": {
      "_id": "64bfbcae52f5c1d3c0135798",
      "amount": 1400.00,
      "category": "Rent & Utilities",
      "date": "2026-06-05T00:00:00.000Z",
      "description": "Updated Internet & Electricity Bill",
      "paymentMethod": "Card"
    }
  }
  ```

#### 5. Delete Expense
* **URL**: `/api/expenses/:id`
* **Method**: `DELETE`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Expense deleted successfully",
    "data": null
  }
  ```

#### 6. Filter by Category Parameter
* **URL**: `/api/expenses/category/:category`
* **Method**: `GET`
* **Success Response (200 OK)**: Returns paginated response matching specifically the requested category parameter in path (case insensitive).

#### 7. Analytics Statistics Summary
* **URL**: `/api/expenses/stats`
* **Method**: `GET`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Analytics stats retrieved successfully",
    "data": {
      "total": {
        "amount": 15420.75,
        "count": 12
      },
      "categoryBreakdown": [
        {
          "category": "Rent & Utilities",
          "totalAmount": 8500,
          "count": 2
        },
        {
          "category": "Food & Dining",
          "totalAmount": 3450.5,
          "count": 6
        }
      ],
      "monthlySummary": [
        {
          "year": 2026,
          "month": 6,
          "monthName": "Jun 2026",
          "totalAmount": 15420.75,
          "count": 12
        }
      ]
    }
  }
  ```

---

## Validation & Custom Error Responses

If query values fail validation checks, a detailed error response is returned:
* **Validation Failure (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": [
      {
        "field": "amount",
        "message": "Amount must be a number"
      },
      {
        "field": "paymentMethod",
        "message": "Payment method must be one of: Cash, UPI, Card"
      }
    ]
  }
  ```

* **Resource Not Found (404 Not Found)**:
  ```json
  {
    "success": false,
    "message": "Expense not found with ID: 64bfbcae52f5c1d3c0135799"
  }
  ```

---

## Postman Collection Example JSON

You can import the following raw JSON text directly into Postman as a new collection to run tests. Copy the string block below:

```json
{
	"info": {
		"_postman_id": "8b51d8b9-5fc3-4638-9a9b-7cc20367bfcb",
		"name": "Personal Expense Tracker API",
		"description": "API requests to perform CRUD operations, sorting, filters, page layouts, and analytics aggregation on Expenses.",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Add Expense",
			"request": {
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"amount\": 350.75,\n    \"category\": \"Food & Dining\",\n    \"date\": \"2026-06-06\",\n    \"description\": \"Dinner with friends\",\n    \"paymentMethod\": \"UPI\"\n}"
				},
				"url": {
					"raw": "http://localhost:5000/api/expenses",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses"
					]
				}
			},
			"response": []
		},
		{
			"name": "Get Expenses (Paginated & Sorted)",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses?page=1&limit=10&sortBy=date:desc",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses"
					],
					"query": [
						{
							"key": "page",
							"value": "1"
						},
						{
							"key": "limit",
							"value": "10"
						},
						{
							"key": "sortBy",
							"value": "date:desc"
						}
					]
				}
			},
			"response": []
		},
		{
			"name": "Search & Filter Expenses",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses?q=Dinner&category=Food & Dining&paymentMethod=UPI",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses"
					],
					"query": [
						{
							"key": "q",
							"value": "Dinner"
						},
						{
							"key": "category",
							"value": "Food & Dining"
						},
						{
							"key": "paymentMethod",
							"value": "UPI"
						}
					]
				}
			},
			"response": []
		},
		{
			"name": "Get Single Expense",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses/{{expense_id}}",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses",
						"{{expense_id}}"
					]
				}
			},
			"response": []
		},
		{
			"name": "Update Expense",
			"request": {
				"method": "PUT",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"amount\": 400.00,\n    \"category\": \"Food & Dining\",\n    \"date\": \"2026-06-06\",\n    \"description\": \"Dinner with friends (Updated amount)\",\n    \"paymentMethod\": \"Card\"\n}"
				},
				"url": {
					"raw": "http://localhost:5000/api/expenses/{{expense_id}}",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses",
						"{{expense_id}}"
					]
				}
			},
			"response": []
		},
		{
			"name": "Filter by Category Path",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses/category/Food & Dining",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses",
						"category",
						"Food & Dining"
					]
				}
			},
			"response": []
		},
		{
			"name": "Get Analytics Statistics",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses/stats",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses",
						"stats"
					]
				}
			},
			"response": []
		},
		{
			"name": "Delete Expense",
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "http://localhost:5000/api/expenses/{{expense_id}}",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "5000",
					"path": [
						"api",
						"expenses",
						"{{expense_id}}"
					]
				}
			},
			"response": []
		}
	]
}
```
