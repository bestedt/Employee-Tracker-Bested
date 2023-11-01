// importing dependencies
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const inquirer = require('inquirer');
// read online that the conosole.table package is a good way to display the database in a table format, so I installed it. It worked great instead of having the info returned like an object
const cTable = require('console.table');
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
        database: 'employee_db',
    },
    console.log(`Connected to the employee_db database.`)
);


const queries = fs.readFileSync('./db/query.sql', 'utf8').split(';').filter(query => query.trim() !== '');

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




// show the choices to the user using the inquirer prompt
function showChoices() {
    inquirer.prompt(choices).then((answers) => {
        handleUserChoice(answers.action);
    });
}
// here is the add employee function, it asks the user info about the employee and then inserts it into the database using the prompt and then the query
function addEmployee() {
    inquirer
        .prompt([
            //the questions for the user to answer
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the employee's first name:",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the employee's last name:",
            },
            {
                type: 'input',
                name: 'roleId',
                message: "Enter the employee's role ID:",
            },
            {
                type: 'input',
                name: 'managerId',
                message: "Enter the employee's manager ID:",
            },
        ])
        .then((answers) => {
            // Inserting the new employee into the database using the query
            db.query(
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [answers.firstName, answers.lastName, answers.roleId, answers.managerId],
                (err, result) => {
                    if (err) {
                        // if there is an error, it will console log the error
                        console.error('Error adding employee:', err);
                    } else {
                        // if there is no error, it will console log that the employee was added successfully
                        console.log('Employee added successfully.');
                    }
                    showChoices(); // to ensure the user can keep making changes or view the database this will bring them to the menu again
                });
        });
}

function addRole() {
    // pretty much the same as the add employee function, just with different questions to fill the different columns in the role table (ex salary)
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "Enter the new role name:",
            },
            {
                type: 'input',
                name: 'salary',
                message: "Enter the salary for the new role:",
            },
            {
                type: 'input',
                name: 'departmentId',
                message: "Enter the new role's department ID:",
            },
        ])
        .then((answers) => {
            // Inserting the new roel into the database
            db.query(
                'INSERT INTO role (title, salary, department_Id) VALUES (?, ?, ?)',
                [answers.title, answers.salary, answers.departmentId],
                (err, result) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Role added successfully.');
                    }
                    showChoices(); // Show the menu again
                }
            );
        });
}

function addDepartment() {
    // the easiest add function, just one question to fill the name column in the department table
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "Enter the Department name:",
            },
        ])
        .then((answers) => {
            // Insert the new department into the database
            db.query(
                'INSERT INTO department (name) VALUES (?)',
                [answers.name],
                (err, result) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Department added successfully.');
                    }
                    showChoices(); // Show the menu again
                }
            );
        });
}

function addManager() {
    inquirer
        // this challenge is a lot of copy and paste, just with small edits to ensure the write info is being added to the right table
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "Enter the new Manager's first name:",
            },
            {
                type: 'input',
                name: 'lastName',
                message: "Enter the new Manager's last name:",
            },
            {
                type: 'input',
                name: 'departmentId',
                message: "Enter the new Manager's department ID:",
            },
        ])
        .then((answers) => {
            // Insert the new manager into the database
            db.query(
                'INSERT INTO manager (first_name, last_name, department_Id) VALUES (?, ?, ?)',
                [answers.firstName, answers.lastName, answers.departmentId],
                (err, result) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log('Manager added successfully.');
                    }
                    showChoices(); // Show the menu again
                }
            );
        });
}
// added a switch statement to handle the user choices, finally able to add the view all employees, roles, and departments need to work on add employee, role, and department
function handleUserChoice(choice) {
    switch (choice) {
        case 'View all Employees':
            // the view all employees function pulls query from my query.sql file and displays it in a table format. in this case its grabbing number 0 ( really number 1) from my query file
            db.query(queries[0], (err, results) => {
                if (err) {
                    // if there is an error, it will console log the error
                    console.error('Database error:', err);
                } else {
                    // here is where the console.table package comes in handy, it displays the database in a table format instead of the log
                    console.table(results);
                }
                showChoices(); // Show the menu again after displaying the employees
            });
            break;
        case 'Add an employee':
            // calling my add employee function
            addEmployee();
            break;

        case 'Update an employee role':

            break;
        case 'View all roles':
            // pretty much the same thing as the view all employees function, just with a different query from my query file
            db.query(queries[1], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                } else {
                    console.table(results);
                }
                showChoices();
            });
            break;
        case 'Add a role':
            // calling my add role function
            addRole()
            break;

        case 'View all departments':
            // again nothing new here, just a copy and paste from the view all employees, but with a different query from my query file
            db.query(queries[2], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                } else {
                    console.table(results);
                }
                showChoices();
            });
            break;

        case 'Add a department':
            addDepartment()
            break;

        case 'View all Managers':
            // finally the last display function, this time for the managers, just pulling a different query from my query file
            db.query(queries[3], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                } else {
                    console.table(results);
                }
                showChoices(); 
            });
            break;
        case 'Add a Manager':
            // calling my add manager function
            addManager()
            break;
        case 'Exit':
            // this is the exit function, it will exit the program
            console.log('See ya later!');
            process.exit(0);
            // not sure why my break is red, but it works so far will investigate later
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