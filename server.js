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
const { up } = require('inquirer/lib/utils/readline');
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

// this is the query that will display all the employees, roles, departments, and managers. I put it in a query file so i could call it later
const queries = fs.readFileSync('./db/query.sql', 'utf8').split(';').filter(query => query.trim() !== '');

// combined the choices, title and showChoices function into one function to make it easier to call later
function showChoices() {
    inquirer.prompt([
        {
            // opening message
            type: 'title',
            name: 'title',
            message: ('Hey Boss!! Lets get to work!!'),
        },
        {
            // the choices for the user to choose from
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'Add an employee',
                'Update an employee',
                'View all roles',
                'Add a role',
                'View all departments',
                'Add a department',
                'View all Managers',
                'Add a Manager',
                'Exit'
            ]
        }
        // this is the promise that will handle the user choice
    ]).then((answers) => {
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
// function to select the employee to update, this will be used in the update employee function, at first it wanted me to select an employee id which was hard to remember so i changed it to the full name
function selectEmployeeToUpdate() {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee', (err, results) => {
        if (err) {
            console.error('Database error:', err);
        } else {
            // Extract the employee IDs and full names from the results
            const employeeChoices = results.map((employee) => ({
                name: employee.full_name,
                value: employee.id,
            }));
// prompt the user to select an employee to update and then ask them what they would like to update, the list of employees is pulled from the query above
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: 'Select an employee to update:',
                        choices: employeeChoices,
                    },
                ])
                .then((answers) => {
                    const employeeId = answers.employeeId;
// this is the second prompt, asking the user what they would like to update, the choices are edit role and edit manager
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'editOption',
                                message: 'What would you like to edit?',
                                choices: ['Edit role', 'Edit manager'],
                            },
                        ])
                        .then((editAnswers) => {
                            switch (editAnswers.editOption) {
                                case 'Edit role':
                                    // Call your updateEmployeeRole function to edit the role, the user has to use the role id unfortunately, couldnt get the list to work for it like i could the employee name
                                    updateEmployeeRole(employeeId);
                                    break;

                                case 'Edit manager':
                                    // Call your updateEmployeeManager function to edit the manager, the user has to use the manager id unfortunately, couldnt get the list to work for it like i could the employee name
                                    updateEmployeeManager(employeeId);
                                    break;

                                default:
                                    // If the user selects an invalid edit option, show the choices again
                                    console.log('Invalid edit option.');
                                    showChoices();
                                    break;
                            }
                        });
                });
        }
    });
}




// this is the update employee role function, it will update the role of the employee in the database
function updateEmployeeRole(employeeId) {
    inquirer
        .prompt([
            {
                // asking the user for the new role ID, tried to make so i could create a new role while editing the employee, but hit a wall and couldnt figure it out
                type: 'input',
                name: 'newRoleId',
                message: "Enter the new role ID for the employee:",
            },
        ])
        .then((answers) => {
            const newRoleId = answers.newRoleId;

            // Updating the employee's role in the database using a SQL query
            const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
            db.query(sql, [newRoleId, employeeId], (err, result) => {
                if (err) {
                    console.error('Error updating role:', err);
                } else {
                    console.log('Employee role updated successfully.');
                }
                showChoices(); // Show the menu again
            });
        });
};

function updateEmployeeManager(employeeId) {
    inquirer
        .prompt([
            {
                // asking the user for the new role ID, tried to make so i could create a new role while editing the employee, but hit a wall and couldnt figure it out
                type: 'input',
                name: 'newManagerId',
                message: "Enter the new manager ID for the employee:",
            },
        ])
        .then((answers) => {
            const newManagerId = answers.newManagerId;

            // Updating the employee's role in the database using a SQL query
            const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
            db.query(sql, [newManagerId, employeeId], (err, result) => {
                if (err) {
                    console.error('Error updating manager:', err);
                } else {
                    console.log('Employee manager updated successfully.');
                }
                showChoices(); // Show the menu again
            });
        });
};
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

        
            case 'Update an employee':
                selectEmployeeToUpdate();
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