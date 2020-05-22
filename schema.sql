DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department
(
  id INT
  AUTO_INCREMENT NOT NULL,
  name VARCHAR
  (30),

PRIMARY KEY(id)

);

  CREATE TABLE role
  (
    id INT
    AUTO_INCREMENT NOT NULL,
  title VARCHAR
    (30),
  salary DECIMAL
    (9,2),
  department_id INT NOT NULL,

  PRIMARY KEY
    (id)
);

    CREATE TABLE employee
    (
      id INT
      AUTO_INCREMENT NOT NULL,
      first_name VARCHAR(30),
      last_name VARCHAR(30),
      role_id INT NOT NULL,
      manager_id INT,

  PRIMARY KEY
      (id)

);