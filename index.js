const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RootRoot',
  database: 'employee_db'
});

// Function to display all departments
function viewDepartments() {
  connection.query(
    'SELECT id AS Department_ID, name AS Department_Name FROM departments',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Function to display all roles
function viewRoles() {
  connection.query(
    'SELECT r.id AS Role_ID, r.title AS Job_Title, d.name AS Department, r.salary AS Salary FROM roles r JOIN departments d ON r.department_id = d.id',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Function to display all employees
function viewEmployees() {
  connection.query(
    `SELECT e.id AS Employee_ID, e.first_name AS First_Name, e.last_name AS Last_Name, 
    r.title AS Job_Title, d.name AS Department, r.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employees e 
    LEFT JOIN roles r ON e.role_id = r.id 
    LEFT JOIN departments d ON r.department_id = d.id 
    LEFT JOIN employees m ON e.manager_id = m.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the new department:',
      validate: function (input) {
        if (input.trim() === '') {
          return 'Please enter a department name';
        }
        return true;
      },
    }
  ]).then((answer) => {
    connection.query(
      'INSERT INTO departments SET ?',
      {
        name: answer.name.trim(),
      },
      function (err) {
        if (err) throw err;
        console.log(`\n${answer.name.trim()} department was added successfully!\n`);
        start();
      }
    );
  });
}

// Function to add a role
function addRole() {
  // Query the department table to display choices
  connection.query('SELECT * FROM departments', function (err, res) {
    if (err) throw err;
    const departments = res.map(department => ({
      name: department.name,
      value: department.id
    }));

    function start() {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'Quit'
            ],
          },
        ])
        .then((answer) => {
          switch (answer.action) {
            case 'View all departments':
              viewDepartments();
              break;
            case 'View all roles':
              viewRoles();
              break;
            case 'View all employees':
              viewEmployees();
              break;
            case 'Add a department':
              addDepartment();
              break;
            case 'Add a role':
              addRole();
              break;
            case 'Add an employee':
              addEmployee();
              break;
            case 'Update an employee role':
              updateEmployeeRole();
              break;
            case 'Quit':
              connection.end();
              break;
          }
        });
    }

    // Query the role table to display choices
    connection.query('SELECT * FROM roles', function (err, res) {
      if (err) throw err;
      const roles = res.map(role => ({
        name: role.title,
        value: role.id
      }));
      connection.query('SELECT * FROM employees', function (err, res) {
        if (err) throw err;
        const employees = res.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }));

        inquirer.prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:",
            validate: function (input) {
              if (input.trim() === '') {
                return 'Please enter a first name';
              }
              return true;
            },
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:",
            validate: function (input) {
              if (input.trim() === '') {
                return 'Please enter a last name';
              }
              return true;
            },
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's job title:",
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: [...employees, { name: 'None', value: null }],
          }
        ]).then((answer) => {
          connection.query(
            'INSERT INTO employees SET ?',
            {
              first_name: answer.first_name.trim(),
              last_name: answer.last_name.trim(),
              role_id: answer.role_id,
              manager_id: answer.manager_id,
            },
            function (err) {
              if (err) throw err;
              console.log(`\n${answer.first_name.trim()} ${answer.last_name.trim()} was added successfully!\n`);
              start();
            }
          );
        });
      });
    });
  });
}
