const inquirer = require('inquirer');
const connection = require('./connection');
require('console.table');

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
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the title of the new role:',
          validate: function (input) {
            if (input.trim() === '') {
              return 'Please enter a role title';
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the new role:',
          validate: function (input) {
            if (!/^\d+(\.\d{1,2})?$/.test(input)) {
              return 'Please enter a valid salary (numbers only)';
            }
            return true;
          },
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department for the new role:',
          choices: departments
        }
      ]).then((answer) => {
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title: answer.title.trim(),
            salary: answer.salary,
            department_id: answer.department
          },
          function (err) {
            if (err) throw err;
            console.log(`\n${answer.title.trim()} role was added successfully!\n`);
            start();
          }
        );
      });
    });
  }
  