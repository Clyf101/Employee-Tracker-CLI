INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Salesperson', 50000.00, 1),
  ('Sales Manager', 80000.00, 1),
  ('Software Engineer', 75000.00, 2),
  ('Senior Software Engineer', 100000.00, 2),
  ('Accountant', 60000.00, 3),
  ('Lawyer', 90000.00, 4),
  ('Legal Assistant', 45000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 2, NULL),
  ('Jane', 'Doe', 1, 2),
  ('Bob', 'Smith', 3, NULL),
  ('Mary', 'Johnson', 4, 3),
  ('Tom', 'Jones', 5, NULL),
  ('Alice', 'Brown', 6, NULL),
  ('Chris', 'Lee', 7, NULL);
