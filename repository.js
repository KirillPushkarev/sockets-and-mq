const mysql = require("mysql");

const mysqlConnConfig = {
  host: process.env.MY_SQL_HOST,
  user: process.env.MY_SQL_USER,
  password: process.env.MY_SQL_PASSWORD,
  database: "issues"
};
const mysqlConnnection = mysql.createConnection(mysqlConnConfig);

function connect(onReady) {
  mysqlConnnection.connect(function(err) {
    if (err) throw err;
    console.log("[MySQL] connected");
    onReady();
  });
}

function importData(data) {
  // const assignee = {
  //   user_id: data.assignee_id,
  //   user_name: data.assignee_name,
  //   user_password: data.assignee_password
  // };
  // const commenter = {
  //   user_id: data.comment_user_id,
  //   user_name: data.comment_user_name,
  //   user_password: data.comment_user_password
  // };
  // const project = {
  //   project_id: data.project_id,
  //   project_name: data.project_name,
  //   project_description: data.project_description
  // };
  // const projectAccess = {
  //   project_id: data.project_id,
  //   user_id: data.assignee_id,
  //   access_type: data.assignee_access_type
  // };
  // const issue = {
  //   issue_id: data.issue_id,
  //   issue_title: data.issue_title,
  //   issue_description: data.issue_description,
  //   issue_priority: data.issue_priority,
  //   issue_status: data.issue_status,
  //   issue_assignee_id: data.assignee_id,
  //   issue_project_id: data.project_id
  // };
  // const comment = {
  //   comment_id: data.comment_id,
  //   comment_user_id: data.comment_user_id,
  //   comment_issue_id: data.issue_id,
  //   comment_text: data.comment_text
  // };
  // mysqlConnnection.query("INSERT IGNORE INTO user SET ?", assignee);
  // mysqlConnnection.query("INSERT IGNORE INTO user SET ?", commenter);
  // mysqlConnnection.query("INSERT IGNORE INTO project SET ?", project);
  // mysqlConnnection.query("INSERT IGNORE INTO project_access SET ?", projectAccess);
  // mysqlConnnection.query("INSERT IGNORE INTO issue SET ?", issue);
  // mysqlConnnection.query("INSERT IGNORE INTO comment SET ?", comment);
}

module.exports.connect = connect;
module.exports.importData = importData;
