// 导入数据库模块
const db = require('../db/mysql');
// 导入bcryptjs模块
const bcrypt = require('bcryptjs');
// 导入jwt模块
const jwt = require('jsonwebtoken');
// 导入用户表单验证
const userInfoFromCheck = require('../checkfrom/userinfo');
// 导入格式化时间模块
const formatTime = require('../common/formatTime');
// 导入配置文件
const config = require("../config");


// 获取用户信息
module.exports.getUserInfo = (req, res) =>{
  // 获取用户信息sql
  const sqlGetUserInfo = '(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info.del_flag,info.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info2.create_by=info.user_id AND info2.update_by IS null) UNION (SELECT temp.user_id,temp.user_name,temp.user_type,temp.phone_number,temp.sex,temp.status,temp.del_flag,temp.create_by,temp.create_time,temp2.user_name as update_by,temp.update_time,temp.remark FROM sys_user as temp2,(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info.del_flag,info.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info2.create_by=info.user_id) as temp WHERE temp.update_by=temp2.user_id) ORDER BY user_id';
  db.query(sqlGetUserInfo, (err, results) => {
    if (err) return res.ck(err)
    const data = {
      total: results.length,
      data: results
    }
    return res.ck(data, '获取用户信息成功!', 0)
  })
}