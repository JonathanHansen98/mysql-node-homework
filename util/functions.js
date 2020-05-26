const inq = require('inquirer');
const mysql = require('mysql2/promise');

  const mainPrompt = async () => {
  try {
    const mainQuestions = [
      {
        type: 'list',
        name: 'menuList',
        message: 'What would you like to do?',
        choices: [
          'View by department',
          'View by role',
          'View by employee',
          'Add employee',
          'Remove employee',
          'Update employee',
          'Add department',
          'Remove department',
          'Update department',
          'Add role',
          'Remove role',
          'Update role'
        ]
      }
    ];
    await viewByEmployee(connection)
    const answers = await inq.prompt(mainQuestions)
    switch (answers.menuList) {
      case 'View by department':
        let res = await viewByDepartment(connection)
        console.table(res)
        await mainPrompt()
        break;
      case 'View by role':
        let res1 = await viewByRole(connection)
        console.table(res1);
        await mainPrompt();
        break;
      case 'View by employee':
        let res2 = await viewByEmployee(connection)
        console.table(res2)
        await mainPrompt()
        break;
      case 'Add employee':
        const newEmployee = await addEmployeePrompt(connection)
        await addEmployee(connection, newEmployee)
        await mainPrompt()
        break;
      case 'Remove employee':
        const emp = await deleteEmployeePrompt(connection)
        await deleteEmployee(connection, emp);
        await mainPrompt();
        break;
      case 'Add department':
        const departmentName = await addDepartmentPrompt()
        await addDepartment(connection, departmentName)
        await mainPrompt();
        break;
      case 'Remove department':
        let {departmentList: department} = await deleteDepartmentPrompt(connection)
        const departmentId = await getDepartmentId(connection, department)
        await deleteDepartment(connection, departmentId)
        await mainPrompt()
        break;
      case 'Add role':
        const newRole = await addRolePrompt(connection);
        await addRole(connection, newRole);
        await mainPrompt();
        break ;
      case 'Remove role':
        const roleToDelete = await deleteRolePrompt(connection);
        const roleId = await getRoleId(connection, roleToDelete);
        await deleteRole(connection, roleId)
        console.log(`Role deleted: ${roleToDelete}`)
        await mainPrompt();
        break;
      case 'Update role':
        const role = await updateRolePrompt(connection)
        await updateRole(connection, role)
        await mainPrompt();
        break;
        case 'Update employee':
          const employee = await updateEmployeePrompt(connection);
          await updateEmployee(connection, employee);
          await mainPrompt();
          break;
        case 'Update department':
          const depart = await updateDepartmentPrompt(connection);
          await updateDepartment(connection, depart);
          await mainPrompt();
          break;
      default:
        break;
    }
    } catch (err) {
    console.log(err)
  }
};

// Managers


// Need try catch - Employee Funcs
function Employee(first, last, role, manager) {
  this.first_name = first;
  this.last_name = last;
  this.role_id = role;
  this.manager_id = manager
}
const addEmployeePrompt = async (connection) => {
  try {
    const roles = await getRoles(connection)
    const addEmployeeQuestions = [
      {
        type: 'input',
        name: 'employeeFirstName',
        message: `What is the emplyee's first name?`
      },
      {
        type: 'input',
        name: 'employeeLastName',
        message: `What is the emplyee's last name?`
      },
      {
        type: 'list',
        name: 'employeeRole',
        choices: [...roles]
      },
      {
        type: 'number',
        name: 'managerId',
        message: `What is their managers ID number?`
      }
    ]
    const ans = await inq.prompt(addEmployeeQuestions)
    return ans;
  } catch (err) {
    console.log(err)
  }
};
const addEmployee = async (connection, newEmployee) => {
  try {
    const employeeRole = await getRoleId(connection, newEmployee.employeeRole)
    const addedEmployee = new Employee(newEmployee.employeeFirstName, newEmployee.employeeLastName, employeeRole, newEmployee.managerId)
    await connection.query(`INSERT INTO employee SET ?`, addedEmployee)
    console.log(`Added employee to database: ${addedEmployee.first_name} ${addedEmployee.last_name}`)
    } catch (err) {
    console.log(err)
  }
};
const getEmployeeNames = async(connection) => {
  try {
    const [rows] = await connection.query(`SELECT first_name, last_name FROM employee`)
    const fullNames = [];
    rows.forEach(row => {
      const fullName = `${row.first_name} ${row.last_name}`
      fullNames.push(fullName) 
    });
    return fullNames;
    } catch (err) {
    console.log(err);
  }
};
const deleteEmployeePrompt = async (connection) => {
  try {
    const names = await getEmployeeNames(connection)
    const questions = [
      {
        type: 'list',
        message: 'What employee would you like to delete?',
        name: 'employee',
        choices: names
      }
    ]
    const ans = await inq.prompt(questions)
    return ans
    } catch (err) {
    console.log(err)
  }
};
const deleteEmployee = async (connection, employee) => {
  try {
    const employeeArr = employee.employee.split(" ");
    const employeeId = await getEmployeeId(connection, employeeArr[0], employeeArr[1]);
    await connection.query(`DELETE FROM employee WHERE id=?`, [employeeId])
    console.log(`Employee Deleted`)
    
  } catch (err) {
    console.log(err)
  }
}

// Department Funcs

const getDepartments = async (connection) => {
  try {
    const [rows] = await connection.query('SELECT * FROM department');
    return rows;
    } catch (err) {
    console.log(err)
  }
};
const getDepartmentId = async (connection, department) => {
  try {
    const [rows] = await connection.query('SELECT id FROM department WHERE name=?',[department]);
    return rows[0].id;
    } catch (err) {
    console.log(err);
  }
};
const deleteDepartmentPrompt = async (connection) => {
  try {
    const departments = await getDepartments(connection)
    let questions = [
    {
      type:'list',
      name:'departmentList',
      message:'Which department would you like to delete?',
      choices: [...departments]
    }
  ];
    return inq.prompt(questions);
    } catch (err) {
    console.log(err);
  }
};
const deleteDepartment = async (connection, departId) => {
  try {
    await connection.query('DELETE FROM department WHERE id=?',[departId]);
    } catch (err) {
    console.log(err);
  }
};
const addDepartmentPrompt = async () => {
  try {
    let questions = [
      {
        type:'input',
        name:'departmentName',
        message:'What is the name of the department?',
      }
    ];
    const {departmentName} = await inq.prompt(questions);
    return departmentName;
    } catch (err) {
    console.log(err);
  }
};
const addDepartment = async(connection, departmentName) => {
  try {
    const res = await connection.query(`INSERT INTO department (name) VALUES(?)`, [departmentName]);
    console.log(`Added department: ${departmentName}`)
  } catch (err) {
    console.log(err)
  }
};

// First funcs im prolly gonna scrap
const viewByRole = async (connection) => {
  const [rows, fields] = await connection.query(`SELECT  role.title AS 'Title', first_name AS'First Name', last_name AS ' Last Name', department.name AS 'Department Name', role.salary AS 'Salary' FROM employee
  INNER JOIN role
    ON employee.role_id = role.id
  INNER JOIN department
    ON department.id = role.department_id;`)
  return rows;
};
const viewByEmployee = async (connection) => {
  try {
    const [rows, fields] = await connection.query(`SELECT first_name AS'First Name', last_name AS ' Last Name', department.name AS 'Department Name', role.title AS 'Title', role.salary AS 'Salary' FROM employee
    INNER JOIN role
      ON employee.role_id = role.id
    INNER JOIN department
      ON department.id = role.department_id
    ORDER BY first_name;`)
    return rows;
    } catch (err) {
    console.log(err)
  }
};
const viewByDepartment = async (connection) => {
  try {
    const [rows, fields] = await connection.query(`SELECT department.name AS 'Department Name', first_name AS'First Name', last_name AS ' Last Name', role.title AS 'Title', role.salary AS 'Salary' FROM employee
    INNER JOIN role
      ON employee.role_id = role.id
    INNER JOIN department
      ON department.id = role.department_id
      ORDER BY name;;`)
    console.table(rows)
    return;
  } catch (err) {
    console.log(err)
  }
};

// Role funcs

function Role (title,salary,department) {
  this.title = title;
  this.salary = salary;
  this.department_id = department
};
const getRoles = async (connection) => {
  try {
    const roles = [];
    const [rows, fields] = await connection.query(`Select title AS Title from role
      ORDER BY title;`)
    rows.forEach(role => roles.push(role.Title))
    return roles
    } catch (err) {
    console.log(err)
  }
};
const getRoleId = async(connection,role) => {
  try {
    const [rows] = await connection.query('SELECT id FROM role WHERE title=?',[role]);
    return rows[0].id;
  } catch (err) {
    console.log(err)
  }
};
const addRolePrompt = async (connection) => {
  const departments = await getDepartments(connection)
  try {
    let questions = [
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'What department does the role belong to?',
        choices: [...departments]
      }
    ]
    const ans = await inq.prompt(questions)
    return ans
    } catch (err) {
    console.log(err)
  }
};
const addRole = async(connection, role) => {
  try {
    const roleDepartmentId = await getDepartmentId(connection, role.roleDepartment)
    const newRoleObj = new Role(role.title,role.salary, roleDepartmentId)
    await connection.query(`INSERT INTO role SET ?;`,newRoleObj)
    return console.log(`Added role: ${newRoleObj.title}`);
  } catch (err) {
    console.log(err)
  }
};
const deleteRolePrompt = async(connection) => {
  try {
    const roles = await getRoles(connection)
    let questions = [{
      type: 'list',
      name: 'role',
      message:'What role would you like to upate?',
      choices: [...roles]
    }]
    const ans = await inq.prompt(questions)
    return ans.role;   
  } catch (err) {
    console.log(err)
  }
};
const deleteRole = async(connection, roleId) => {
  try {
    await connection.query('DELETE FROM role WHERE id=?',[roleId]);    
  } catch (err) {
    console.log(err)
  }
};

// Util Funcs
const getCols = async (connection, tableName) => {
  const cols = await connection.query(`SELECT column_name
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = ?;`, [tableName])
  formattedCols = [];
  const colsArr = cols[0]
  colsArr.forEach(col => {
    if (col.COLUMN_NAME !== 'id') {
      let colName = col.COLUMN_NAME
      console.log(colName)
      let colReplaced = colName.replace(/_/g, " ")
      let formattedCol = colReplaced.charAt(0).toUpperCase() + colReplaced.slice(1)
      formattedCols.push(formattedCol)
    }
  });
  console.log(formattedCols)
  return formattedCols
};
const getEmployeeId = async(connection, firstName, lastName) => {
  const [rows] = await connection.query(`SELECT id FROM employee WHERE first_name=? AND last_name=?`,[firstName, lastName])
  return(rows[0].id)
};


// Update Funcs
const updateRolePrompt = async(connection) => {
  const roles = await getRoles(connection)
  const roleCols = await getCols(connection, 'role')
  const questions = [
    {
      type: 'list',
      name: 'role',
      message:'What role would you like to upate?',
      choices: [...roles]
    },
    {
      type: 'list',
      name: 'roleCol',
      message:'What would you like to update about the role?',
      choices: [...roleCols, 'All']
    },
  ];
    const ans = await inq.prompt(questions)
    if (ans.roleCol === 'All') {
      const updatedRole = await addRolePrompt(connection);
      return [updatedRole, ans.role];
    } else {
      let colReplaced = ans.roleCol.replace(/ /g, "_")
      let sqlFormattedCol = colReplaced.charAt(0).toLowerCase() + colReplaced.slice(1)
      const updateQuestions = [
        {
          type: 'input',
          name: sqlFormattedCol,
          message: `Enter the new ${ans.roleCol}`
        }
      ]
        const ans2 = await inq.prompt(updateQuestions);
        return [ans2, ans.role];
      }
};
const updateRole = async(connection, role) => {
  const roleLength = Object.keys(role[0]).length;
  if (roleLength > 1) {
    const roleDepartmentId = await getDepartmentId(connection, role[0].roleDepartment)
    const newRoleObj = new Role(role[0].title,role[0].salary, roleDepartmentId)
    await connection.query(`UPDATE role SET ? where title=?`, [newRoleObj, role[1]])
    console.log(`Role updated: ${role[0].title}`)
  } else {
    await connection.query(`UPDATE role SET ? where title=?`, [role[0], role[1]]);
    console.log(`Role updated: ${role[0].title}`);
  }
};
const updateEmployeePrompt = async(connection) => {
  try {
    const employees = await getEmployeeNames(connection)
    const employeeCols = await getCols(connection, 'employee') 
    questions = [
      {
        type: 'list',
        name: 'name',
        message: 'Which employee would you like to update?',
        choices: employees
      },
      {
        type: 'list',
        name: 'employeeCol',
        message: 'What would you like to update about the employee?',
        choices: [...employeeCols, 'All']
      }
    ]
    const ans = await inq.prompt(questions)
    if (ans.employeeCol === 'All') {
      const updatedEmployee = await addEmployeePrompt(connection)
      return ([updatedEmployee, ans.name])
    } else {
      let colReplaced = ans.employeeCol.replace(/ /g, "_")
      let sqlFormattedCol = colReplaced.charAt(0).toLowerCase() + colReplaced.slice(1)
      const updateQuestions = [
        {
          type: 'input',
          name: sqlFormattedCol,
          message: `Enter the new ${ans.employeeCol.charAt(0).toLowerCase() + ans.employeeCol.slice(1)}`
        }
      ]
        const ans2 = await inq.prompt(updateQuestions);
        return ([ans2, ans.name]);
    }
  } catch (err) {
    console.log(err)
  }
};
const updateEmployee = async(connection, employee) => {
  try {
    const employeeLength = Object.keys(employee[0]).length
  if (employeeLength > 1) {
    const employeeRole = await getRoleId(connection, newEmployee.employeeRole)
    const updatedEmployee = new Employee(newEmployee.employeeFirstName, newEmployee.employeeLastName, employeeRole, newEmployee.managerId)
    const employeeId = await getEmployeeId(connection, updatedEmployee.first_name, updateEmployee.last_name)
    await connection.query(`UPDATE employee SET ? WHERE id=?`,[updateEmployee, employeeId]);
    console.log(`Employee updated: ${updateEmployee.name}`)
  }
  else {
    const nameArr = employee[1].split(" ")
    const employeeId = await getEmployeeId(connection, nameArr[0],nameArr[1])
    await connection.query(`UPDATE employee SET ? WHERE id=?`,[employee[0],employeeId])
    console.log(`Employee updated`)
  }
  } catch (err) {
    console.log(err)
  }
  };
const updateDepartmentPrompt = async (connection) => {
  try {
    const departments = await getDepartments(connection)
    const questions = [
      {
        type: 'list',
        name: 'name',
        message: 'Which department would you like to update?',
        choices: [...departments]
      },
      {
        type: 'input',
        name: 'departName',
        message: 'What is the new name of the department'
      }
    ];
    const ans = await inq.prompt(questions)
    return ans
  } catch (err) {
    console.log(err)
  }
};
const updateDepartment = async(connection, department) => {
  try {
    console.log(department.name)
    const departmentId = await getDepartmentId(connection, department.name)
    await connection.query(`UPDATE department SET name=? WHERE id=?`, [department.departName, departmentId])
    console.log(`Department updated: ${department.name}`)
  } catch (err) {
    console.log(err)
  }
};