# Expense Tracker Application

A simple expense tracker application built using **HTML**, **CSS**, **JavaScript**, and **Node.js**. This app allows users to manage their expenses efficiently through a web interface, providing features like adding, deleting, and viewing expenses, along with generating summaries.

---

## Features

### Core Features:
- Add an expense with a description and amount.
- View a list of all expenses.
- Delete an expense by ID.
- View the total expenses summary.
- Real-time updates on the web interface.

### Additional Features:
- Expenses are stored persistently in a JSON file.
- Backend API using Node.js and Express.js.

---

## File Structure

```
expense-tracker/
├── data/
│   └── expenses.json        # Backend data file
├── public/
│   ├── index.html           # Frontend HTML file
│   ├── style.css            # CSS for styling
│   └── script.js            # JavaScript for interactivity
├── server.js                # Backend server (Node.js with Express)
└── package.json
```

---

## How to Run the Application

### Prerequisites:
- [Node.js](https://nodejs.org/) installed on your system.

### Steps:
1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### Base URL:
```
http://localhost:3000
```

### Endpoints:
1. **Get All Expenses**
   ```
   GET /expenses
   ```
   **Response:**
   ```json
   {
     "expenses": [
       {
         "id": 1,
         "date": "2025-01-25",
         "description": "Lunch",
         "amount": 20
       }
     ],
     "total": 20
   }
   ```

2. **Add an Expense**
   ```
   POST /expenses
   ```
   **Request Body:**
   ```json
   {
     "description": "Dinner",
     "amount": 15
   }
   ```

3. **Delete an Expense**
   ```
   DELETE /expenses/:id
   ```
   **Response:**
   ```
   Status: 204 No Content
   ```

---

## Technologies Used

### Frontend:
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**

### Backend:
- **Node.js**
- **Express.js**
- **File System (fs)** for data storage

---

## Future Enhancements

- Add categories to expenses and filter by category.
- Implement monthly budget tracking with warnings.
- Export expense data to a CSV file.
- Add user authentication for personal accounts.

---

## Screenshots

### 1. Home Page
![Home Page Screenshot](#)

### 2. Adding an Expense
![Add Expense Screenshot](#)

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.

---

## Author

Built with ❤️ by shadab Shaikh.

