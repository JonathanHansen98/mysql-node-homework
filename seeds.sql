-- Create Departments

INSERT INTO department(name)
VALUES('Engineering','Sales','Admin','Finance');

-- 1 - Engineering roles

INSERT INTO role(title, salary, department_id)
VALUES
  ('Head Engineer', 200000, 1),
  ('Software Engineer', 120000, 1),
  ('Intern', 25000, 1)
;

-- 2 Sales roles

INSERT INTO role(title, salary, department_id)
VALUES
  ('Sales Lead', 120000, 2),
  ('Inbound Sales', 60000, 2),
  ('Outbound Sales', 80000, 2)
;

-- 3 Legal Roles

INSERT INTO role(title, salary, department_id)
VALUES
  ('Legal Team Lead', 200000, 3),
  ('Lawyer', 120000, 3),
  ('Secretary', 60000, 3)
;

-- 4 Finance roles

INSERT INTO role(title, salary, department_id)
VALUES
  ('Head Financial Advisor', 150000, 4),
  ('Bookkeeper', 120000, 4),
  ('Finance Associate', 10000, 4)
;

-- Create Employees

INSERT INTO employee(first_name, last_name,role_id, manager_id)
VALUES
-- Engineers
  ('Danyal', 'Khalid', 1, null),
  ('Bryce', 'Brycington', 2, 1),
  ('Jonathan', 'Hansen', 3, 1),
-- Sales people
  ('Ethan', 'Tatum', 4, null),
  ('Bob', 'Saget', 5, 4),
  ('John', 'Stamos', 6, 4),
-- Legal Team
  ('Brandon', 'Burrus', 7, null),
  ('Dave', 'Coulier', 8, 7),
  ('Ashley', 'Olsen', 9, 7),
-- Finance Team
  ('Kevin', 'Mcgregor', 10, null),
  ('Tim', 'Allen', 11, 10),
  ('Richard', 'Karn', 12, 10)
  ;





