insert into departments (name) 
values ('Sales')
, ('Engineering')
, ('Finance')
, ('Legal');

insert into roles (title, salary, department_id)
values ('Sales Lead', 100000, 1),
    ( 'Salesperson', 85000, 1),
    ( 'Lead Engineer', 125000, 2),
    ( 'Software Engineer', 100000, 2),
    ( 'Accountant', 110000, 3),
    ( 'Legal Team Lead', 230000, 4),
    ( 'Lawyer', 200000, 4);

insert into employees (first_name, last_name, role_id, manager_id)
values ('Tyler', 'Bested', 1, null),
    ('Peter', 'Parker', 2, 1),
    ('Miles', 'Morales', 3, 1),
    ('Matthew', 'Murdock', 4, 1),
    ('Richard', 'Rider', 2,1),
    ('Gwen', 'Stacey', 3, 1),
    ('Felica', 'Hardy', 4,1),

insert into managers (first_name, last_name)
values ('Steve', 'Rogers'),
        ('Wanda', 'Maximoff'),
        ('Sam', 'Wilson'),
        ('Natasha', 'Romanoff');
