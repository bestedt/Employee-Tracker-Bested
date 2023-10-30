// importing dependencies
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to my database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Manofsteel1989!',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);
// Query database with the following choices for the user to choose from
const choices = [
    {
    
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all Employees',
            'Add an employee',
            'Update an employee role',
            'View all roles',
            'Add a role',
            'View all departments',
            'Add a department',
            'Exit'
        ]
    }];


