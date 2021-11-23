// 导入数据库模块
const db = require('../db/mysql');
// 导入用户表单验证
const fileFromCheck = require('../checkfrom/file');

// 上传文件
module.exports.uploadFile = (req, res) => {
  if (!req.file || req.file.fieldname !== 'topicFile') return res.ck('未上传文件!')
  
}