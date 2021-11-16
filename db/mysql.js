// 导入mysql模块
const mysql = require('mysql');
// 创建数据库连接对象
const db = mysql.createPool({
  host: '192.168.3.82',
  port: 3306,
  user: 'root',
  password: 'twd@root$9921',
  database: 'project_01'
});
// 导出db对象
module.exports = db;