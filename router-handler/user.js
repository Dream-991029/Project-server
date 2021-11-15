// 导入数据库模块
const db = require('../db/mysql');
// 导入bcryptjs模块
const bcrypt = require('bcryptjs');
// 导入jwt模块
const jwt = require('jsonwebtoken');
// 导入用户表单验证
const userFromCheck = require('../checkfrom/user');
// 导入格式化时间模块
const formatTime = require('../common/formatTime');
// 导入配置文件
const config = require("../config");

// 注册模块
module.exports.register = (req, res) => {
  let data = req.body;
  const valueErr = userFromCheck.validate(data, userFromCheck.schema.schemaRegister);
  if (valueErr) {
    return res.ck(valueErr);
  }
  // 查询用户名sql
  const sqlByUname = 'SELECT * FROM sys_user WHERE sys_user.user_name=?';
  db.query(sqlByUname, [data.user_name], (err, results) => {
    // 数据库报错
    if (err) {
      return res.ck(err);
    } else if (results.length > 0) {
      return res.ck('该帐号已被占用!')
    }
    // 用户名没有被占用
    // 密码加密(bcrypt.hashSync(明文密码, 随机盐长度))
    data.password = bcrypt.hashSync(data.password, 10);
    // 获取数据库中最后一个ID号
    const sqlGetLastId = 'SELECT info.user_id FROM sys_user info ORDER BY info.user_id DESC LIMIT 1';
    db.query(sqlGetLastId, (err, results) => {
      if (err) return res.ck(err)
      const newData = {
        ...data,
        create_by: results[0].user_id + 1,
        create_time: formatTime()
      }
      delete newData.confirm_password;
      // 添加用户sql
      const sqlAddUser = 'INSERT INTO sys_user SET ?';
      db.query(sqlAddUser, newData, (err, results) => {
        if (err) {
          return res.ck(err);
        } else if (results.affectedRows !== 1) {
          return res.ck('注册失败,请稍后再试!');
        }
        return res.ck('注册成功,请登录!', '注册成功!', 0);
      });
    });
  });
};

// 登录模块
module.exports.login = (req, res) => {
  let data = req.body;
  const valueErr = userFromCheck.validate(data, userFromCheck.schema.schemaLogin);
  if (valueErr) {
    return res.ck(valueErr);
  }
  // 获取用户信息sql
  const sqlByUname = 'SELECT * FROM sys_user WHERE sys_user.user_name=?'; 
  db.query(sqlByUname, [data.user_name], (err, results) => {
    if (err) {
      return res.ck(err);
    } else if (results.length !== 1) {
      return res.ck('登录失败,此帐户不存在!');
    }
    // 检测账户密码是否正确
    const compareResult = bcrypt.compareSync(data.password, results[0].password);
    if (!compareResult) {
      return res.ck('登陆失败, 密码错误!');
    }
    // 登录成功, 保存用户信息
    const user = {
      ...results[0],
      password: "",
      status: "",
      del_flag: "",
      islogin: true
    }
    // 将用户信息加密成token
    const tokenStr = jwt.sign(user, config.jwtSecretkey, {
      expiresIn: '24h'
    });
    res.send({
      status: 0,
      msg: '登陆成功!',
      token: tokenStr,
    });
  });
};
