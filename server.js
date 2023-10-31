// importing dependencies
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const inquirer = require('inquirer');
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
        password: '',
        database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
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
            'View all Managers',
            'Add a Manager',
            'Exit'
        ]
    }];



      
    // using post method to get the user choices
    function showChoices() {
        inquirer.prompt(choices).then((answers) => {
            handleUserChoice(answers.action);
        });
    }
    
    // added a switch statement to handle the user choices, finally able to add the view all employees, roles, and departments need to work on add employee, role, and department
    function handleUserChoice(choice) {
        switch (choice) {
            case 'View all Employees':
                //the display functions are pretty simple, just a query and a console log.
                db.query('SELECT * FROM employee', (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                    } else {
                        console.log(results);
                    }
                    showChoices(); // Show user the menu again
                });
                break;
            case 'Add an employee':
                
                break;

            case 'Update an employee role':
              
                break;
            case 'View all roles':
                // pretty much a copy and paste from the view all employees
                db.query('SELECT * FROM role', (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                    } else {
                        console.log(results);
                    }
                    showChoices(); // Show the menu again
                });
                break;
            case 'Add a role':
              
                break;

            case 'View all departments':
                // again nothing new here, just a copy and paste from the view all employees
                db.query('SELECT * FROM department', (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                    } else {
                        console.log(results);
                    }
                    showChoices(); // Show the menu again
                });
                break;

            case 'Add a department':
               
                break;

            case 'View all Managers':
                // finally the last display function, this time for the managers 
                db.query('SELECT * FROM manager', (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                    } else {
                        console.log(results);
                    }
                    showChoices();
                });
                break;
            case 'Add a Manager':
               
                break;
            case 'Exit':
                // this is the exit case, it will exit the program
                console.log('See ya later!');
                process.exit(0);
                break;
            default:
                console.log('Invalid action.');
                showChoices(); 
        }
    }
    // listening to the port, while also showing the choices
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        showChoices(); 
    });