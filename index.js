//Dependencies//
const { prompt } = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const data = require("/Users/sergioaguirre/Desktop/EmployeeManagement/Main/db");
require('console.table');
const choice = require("inquirer/lib/objects/choice");

init();

// Display logo text, load prompts//
function init() {
    const logoText = logo({ name: "Employee Task Management" }).render();

    console.log(logoText);

    loadPrompts();
}
//Conection//

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "employees"
});

connection.connect(function(err) {
    if (err) throw err;
    init();
});
module.exports = connection;

//Prompts//
async function loadPrompts() {
    const { choice } = await prompt([{
        type: "list",
        name: "choice",
        message: "Choose an option",
        choices: [{
                name: "view All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View All Employees By Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Remove Role",
                value: "REMOVE_ROLE"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Departments",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "Quit",
                value: "QUIT"
            }
        ]
    }]);
    // Call specific function based on user's choice//
    switch (choice) {
        case "VIEW_EMPLOYEES":
            return viewEmployees();
        case "VIEW_EMPLOYEES_BY_MANAGER":
            return viewEmployeesByManager();
        case "ADD_EMPLOYEE":
            return addEmployee();
        case "REMOVE_EMPLOYEE":
            return removeEmployee();
        case "UPDATE_EMPLOYEE_ROLE":
            return updateEmployeeRole();
        case "UPDATE_EMPLOYEE_MANAGER":
            return updateEmployeeManager();
        case "VIEW_DEPARTMENTS":
            return viewDepartments();
        case "ADD_DEPARTMENT":
            return addDepartment();
        case "REMOVE_DEPARTMENT":
            return removeDepartment();
        case "VIEW_ROLES":
            return viewRoles();
        case "ADD_ROLE":
            return addRole();
        case "REMOVE_ROLE":
            return removeRole();
        default:
            return quit();
    }
};

//functions for data//

////VIEW SECTION////
//==============================================//

//View Employee Function//
async function viewEmployees() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        //log all results of the SELECT statement//
        console.table(res);
        loadPrompts();
    });
}
//View Department Function//
async function viewDepartments() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        //log all results of the SELECT statement//
        console.table(res);
        loadPrompts();
    });
}
//View Role Function//
async function viewRoles() {
    connection.query("SELECT * FROM roles", function(err, res) {
        if (err) throw err;
        //log all results of the SELECT statement//
        console.table(res);
        loadPrompts();
    });
}
//View Employees By Manager//
//async function viewEmployeesByManager() {
//var query = "SELECT manager_id FROM employee GROUP BY employee HAVING count(*) > NULL";
// connection.query
//}

////ADD SECTION////
//==============================================//

//Add Employee Function//
async function addEmployee() {
    inquirer.prompt([{
            type: 'input',
            message: 'What is the first name of the new employee?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'What is the last name of the new employee?',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'what is the role of the new employee?',
            name: 'role_id',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal team Lead', 'Lawyer']
        },
    ]).then((data) => {
        console.log("Inserting a new employee...\n");
        connection.query(
            "INSERT INTO employee SET ?", {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: data.role_id,
                manager_id: data.manager_id
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee inserted!\n");
                //Call init() AFTER the INSERT is complete//
                console.table(res);
                loadPrompts();
            }
        );
    })
}
//Add Department Function//
async function addDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'What would you like to name the new department?',
        name: 'department'
    }).then((data) => {
        console.log("Inserting a new department...\n");
        connection.query(
            "INSERT INTO department SET ?", {
                name: data.department
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department inserted!\n");
                //Call init() AFTER the INSERT is complete//
                init();
            }
        );
    })
}
//Add Role Function//
async function addRole() {
    inquirer.prompt([{
            type: 'input',
            message: 'What is the title of the new role?',
            name: 'title'
        },
        {
            type: 'input',
            message: 'What is the salary of the new role?',
            name: 'salary'
        },
        {
            type: 'input',
            message: 'What is the department ID?',
            name: 'department_id'
        }
    ]).then((data) => {
        console.log("Inserting a new role...\n");
        connection.query(
            "INSERT INTO roles SET ?", {
                title: data.title,
                salary: data.salary,
                department_id: data.department_id
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " role inserted!\n");
                //Call init() AFTER the INSERT is complete//
                loadPrompts();
            }
        );
    })
}

////REMOVE SECTION////
//==============================================//

//Remove Employee//
function removeEmployee() {
    inquirer.prompt({
        type: 'input',
        message: 'Which employee would you like to remove?',
        name: 'employee'
    }).then((data) => {
        console.log(" Removing employee...\n");
        connection.query(
            "DELETE FROM employee WHERE ?", {
                first_name: data.first_name,
                last_name: data.last_name,
                roles: data.roles,
                manager_id: data.manager_id
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee deleted!\n");
                // Call readProducts AFTER the DELETE completes
                loadPrompts();
            }
        );
    })
}
//Remove Department//
function removeDepartment() {
    inquirer.prompt({
        type: 'input',
        message: 'Which department would you like to remove?',
        name: 'department'
    }).then((data) => {
        console.log(" Removing department...\n");
        connection.query(
            "DELETE FROM department WHERE ?", {
                name: data.department
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " department deleted!\n");
                // Call readProducts AFTER the DELETE completes
                loadPrompts();
            }
        );
    })
}
//remove Role//
function removeRole() {
    inquirer.prompt({
        type: 'input',
        message: 'Which role would you like to remove?',
        name: 'title'
    }).then((data) => {
        console.log(" Removing role...\n");
        connection.query(
            "DELETE FROM role WHERE ?", {
                title: data.title,
                salary: data.salary,
                department_id: data.department_id
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " role deleted!\n");
                // Call readProducts AFTER the DELETE completes
                loadPrompts();
            }
        );
    })
}

////UPDATE SECTION////
//==============================================//

//Update Employee Role//
function updateEmployeeRole() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employee", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employees role would youlike to update?"
                },
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What would you like to update it to?"
                },

            ])
            .then(function(data) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === data.choice) {
                        chosenItem = results[i];
                    }
                }

                // determine if bid was high enough
                //if (chosenItem.role_id < role_id) {
                // bid was high enough, so update db, let the user know, and start over
                //   connection.query(
                //      "UPDATE employee SET ? WHERE ?", [{
                //              role: role_id
                //         },
                //         {
                //              id: chosenItem.id
                //         }
                //     ],
                //     function(error) {
                //          if (error) throw err;
                //          console.log("Role was updated!!...\n");
                //          start();
                //      }
                //   );
                //  } else {
                // bid wasn't high enough, so apologize and start over
                //      console.log("Err!...\n");
                init();
                //  }
            });
    });
}
//Update Employee Manager//
function updateEmployeeManager() {
    inquirer.prompt({
        type: 'input',
        message: 'Which employees manager will be updated?',
        name: 'employee'
    }).then((data) => {
        console.log("Updating manager...\n");
        connection.query(
            "UPDATE employee SET ? WHERE ?", [{
                    manager_id: data.manager_id
                },
                {
                    manager_id: data.manager_id
                }
            ],
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "Manager has been updated...\n");
                loadPrompts();
            }
        );
    })
}

//Quit function//
function quit() {
    console.log("Goodbye...\n");
    connection.end();
}