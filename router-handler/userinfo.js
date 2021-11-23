// 导入数据库模块
const db = require('../db/mysql');
// 导入bcryptjs模块
const bcrypt = require('bcryptjs');
const formatTime = require('../common/formatTime')
// 导入用户表单验证
const userInfoFromCheck = require('../checkfrom/userinfo');

// 获取用户信息列表(分页)
module.exports.getUserInfoList = (req, res) => {
  // 获取数据
  const data = req.query;
  // 表单验证
  const valueErr = userInfoFromCheck.validate(data, userInfoFromCheck.schema.schemaGetUerInfoList);
  if (valueErr) return res.ck(valueErr)
  let sqlGetUserInfo = '';
  let sqlGetUserInfoCount = '';
  const page_num = parseInt(data.page_num);
  const page_size = parseInt(data.page_size);
  const skip = (page_num - 1) * page_size;
  if (data.user_name === "") {
    // 获取用户信息sql
    sqlGetUserInfo = `(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0 AND info.update_by IS null) UNION (SELECT temp.user_id,temp.user_name,temp.user_type,temp.phone_number,temp.sex,temp.status,temp.create_by,temp.create_time,temp2.user_name as update_by,temp.update_time,temp.remark FROM sys_user as temp2,(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0) as temp WHERE temp.update_by=temp2.user_id AND temp2.del_flag=0) ORDER BY user_id LIMIT ${skip},${page_size}`;
    sqlGetUserInfoCount = 'SELECT COUNT(*) AS total FROM sys_user info WHERE info.del_flag=0';
  } else {
    const fulltext = `'${data.user_name}'`
    sqlGetUserInfo = `(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0 AND info.update_by IS null AND info2.user_name REGEXP ${fulltext}) UNION (SELECT temp.user_id,temp.user_name,temp.user_type,temp.phone_number,temp.sex,temp.status,temp.create_by,temp.create_time,temp2.user_name as update_by,temp.update_time,temp.remark FROM sys_user as temp2,(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0) as temp WHERE temp.update_by=temp2.user_id AND temp2.del_flag=0 AND temp.user_name REGEXP ${fulltext}) ORDER BY user_id LIMIT ${skip},${page_size}`
    sqlGetUserInfoCount = `SELECT COUNT(*) AS total from ((SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info2.create_by=info.user_id AND info.del_flag=0 AND info2.update_by IS null AND info2.user_name REGEXP ${fulltext}) UNION (SELECT temp.user_id,temp.user_name,temp.user_type,temp.phone_number,temp.sex,temp.status,temp.create_by,temp.create_time,temp2.user_name as update_by,temp.update_time,temp.remark FROM sys_user as temp2,(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info2.create_by=info.user_id AND info.del_flag=0) as temp WHERE temp.update_by=temp2.user_id AND temp2.del_flag=0 AND temp.user_name REGEXP ${fulltext}) ORDER BY user_id) as temp3`;
  }
  db.query(sqlGetUserInfo, (err, results) => {
    if (err) return res.ck(err)
    const val = results;
    db.query(sqlGetUserInfoCount, (err1, results1) => {
      if (err1) return res.ck(err1)
      const data = {
        total: results1[0].total,
        data: val
      }
      return res.ck(data, '获取用户信息成功!', 0)
    })
  })
}

// 获取单个用户信息
module.exports.getUserInfo = (req, res) => {
  // 获取数据
  const data = req.query;
  // 表单验证
  const valueErr = userInfoFromCheck.validate(data, userInfoFromCheck.schema.schemaGetUerInfo);
  if (valueErr) return res.ck(valueErr)
  // 获取用户信息sql
  const sqlGetUserInfo = '(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0 AND info.user_name=? AND info.update_by IS null) UNION (SELECT temp.user_id,temp.user_name,temp.user_type,temp.phone_number,temp.sex,temp.status,temp.create_by,temp.create_time,temp2.user_name as update_by,temp.update_time,temp.remark FROM sys_user as temp2,(SELECT info.user_id,info.user_name,type.user_type,info.phone_number,gen.sex,info.status,info2.user_name as create_by,info.create_time,info.update_by,info.update_time,info.remark FROM sys_user info,sys_user info2,sys_user_sex gen,sys_user_type type WHERE info.sex=gen.sex_id AND info.user_type=type.user_type_id AND info.create_by=info2.user_id AND info.del_flag=0 AND info.user_name=?) as temp WHERE temp.update_by=temp2.user_id AND temp2.del_flag=0)'
  db.query(sqlGetUserInfo, [data.user_name, data.user_name], (err, results) => {
    if (err) return res.ck(err)
    if (results.length === 0) return res.ck('查询失败,此帐号不存在!')
    let obj = results[0]
    return res.ck(obj, '查询成功!', 0)
  })
}

// 添加用户
module.exports.addUser = (req, res) => {
  // 获取数据
  const data = req.body;
  const valErr = userInfoFromCheck.validate(data, userInfoFromCheck.schema.schemaAddUserInfo)
  if (valErr) return res.ck(valErr)
  // 查询用户名sql
  const sqlByUname = 'SELECT info.user_id FROM sys_user info WHERE info.del_flag=0 AND info.user_name=?';
  db.query(sqlByUname, [data.user_name], (err, results) => {
    // 数据库报错
    if (err) return res.ck(err)
    if (results.length > 0) return res.ck('该帐号已被占用!')
    // 用户名没有被占用
    // 密码加密(bcrypt.hashSync(明文密码, 随机盐长度))
    data.password = bcrypt.hashSync(data.password, 10);
    let newData = {
      ...data,
      create_time: formatTime()
    }
    delete newData.confirm_password;
    if (data.remark === '') {
      newData.remark = '新用户'
    }
    // 查询用户是否为被删除的用户
    const sqlGetDeleteUser = 'SELECT info.user_id FROM sys_user info WHERE info.del_flag=2 AND info.user_name=?'
    db.query(sqlGetDeleteUser, [data.user_name], (err, results) => {
      if (err) return res.ck(err)
      if (results.length > 0) {
        newData.status = '0'
        newData.del_flag = '0'
        const sqlUpdateUser = 'UPDATE sys_user info SET ? WHERE info.user_name=?'
        db.query(sqlUpdateUser, [newData, data.user_name], (err, results) => {
          if (err) return res.ck(err)
          if (results.affectedRows !== 1) {
            return res.ck('添加失败, 请稍后再试!');
          }
          return res.ck('添加成功!', '添加成功!', 0)
        })
      } else {
        // 添加用户sql
        const sqlAddUser = 'INSERT INTO sys_user SET ?';
        db.query(sqlAddUser, newData, (err, results) => {
          if (err) return res.ck(err);
          if (results.affectedRows !== 1) {
            return res.ck('添加失败, 请稍后再试!');
          }
          return res.ck('添加成功!', '添加成功!', 0);
        });
      }
    })
  });
}

// 修改用户
module.exports.editUser = (req, res) => {
  const data = req.body;
  const valErr = userInfoFromCheck.validate(data, userInfoFromCheck.schema.schemaEditUserInfo)
  if (valErr) return res.ck(valErr)
  // 查询用户是否存在
  const sqlByUserId = 'SELECT info.user_id FROM sys_user info WHERE info.user_id=?'
  db.query(sqlByUserId, [data.user_id], (err, results) => {
    if (err) return res.ck(err)
    if (results && results.length === 0) {
      return res.ck('该用户id不存在,请检查用户id!')
    }
    // 判断用户名是否存在
    const sqlByUserName = 'SELECT info.user_id FROM sys_user info WHERE info.user_name=? AND info.del_flag=0 AND info.user_id!=?'
    db.query(sqlByUserName, [data.user_name, data.user_id], (err, results) => {
      if (err) return res.ck(err)
      if (results && results.length > 0) {
        return res.ck('该帐号已被占用!')
      }
      if (data.password !== '') {
        // 给密码加密
        data.password = bcrypt.hashSync(data.password, 10);
      } else {
        delete data.password
      }
      delete data.confirm_password;
      let newData = {
        ...data,
        update_time: formatTime()
      }
      // 修改信息
      const sqlByIdUpdateInfo = 'UPDATE sys_user info SET ? WHERE info.user_id=?'
      db.query(sqlByIdUpdateInfo, [newData, data.user_id], (err, results) => {
        if (err) return res.ck(err)
        if (results.affectedRows !== 1) return res.ck('更新失败, 请稍后再试！')
        return res.ck({user_name: newData.user_name}, '更新成功!', 0)
      })
    })
  })
}

// 删除用户
module.exports.deleteUser = (req, res) => {
  const data = req.query
  const valErr = userInfoFromCheck.validate(data, userInfoFromCheck.schema.schemaDeleteUserInfo)
  if (valErr) return res.ck(valErr)
  const sqlByIdUnameDel = 'UPDATE sys_user info SET ? WHERE info.user_id=? AND info.user_name=?'
  db.query(sqlByIdUnameDel, [{del_flag: '2'}, data.user_id, data.user_name], (err, results) => {
    if (err) return res.ck(err)
    if (results.affectedRows !== 1) return res.ck('删除失败, 请稍后再试!')
    return res.ck('删除成功!', '删除成功', 0)
  })
}