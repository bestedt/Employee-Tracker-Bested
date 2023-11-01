-- View all employees
SELECT 
    employee.id AS id,
    employee.first_name,
    employee.last_name,
    role.title AS role,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
    department.name AS department
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN manager ON employee.manager_id = manager.id
LEFT JOIN department ON role.department_id = department.id;

-- View all roles
SELECT
    role.id AS role_id,
    role.title AS role,
    role.salary,
    department.name AS department
FROM role
LEFT JOIN department ON role.department_id = department.id;

-- View all departments
SELECT
    department.id AS department_id,
    department.name AS department,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM department
LEFT JOIN manager ON department.id = manager.department_id;

-- view all managers
SELECT
    manager.id AS manager_id,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
    department.name AS department,
    CONCAT(employee.first_name, ' ', employee.last_name) AS employee
FROM manager
LEFT JOIN department ON manager.department_id = department.id
LEFT JOIN employee ON manager.id = employee.manager_id;

