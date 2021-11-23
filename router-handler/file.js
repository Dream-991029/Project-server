// 导入数据库模块
const db = require('../db/mysql');
// 导入用户表单验证
const fileFromCheck = require('../checkfrom/file');
const formatTime = require('../common/formatTime');
var path = require('path');
var parser = require('word-text-parser');

// 上传文件
module.exports.uploadFile = (req, res) => {
  if (!req.file || req.file.fieldname !== 'topicFile') return res.ck('未上传文件!')
  const data = req.body;
  const valErr = fileFromCheck.validate(data, fileFromCheck.schema.schemaUpdateFile);
  if (valErr) return res.ck(valErr)
  const file_name = req.file.filename.split('.')[0]
  const original_name = req.file.originalname.slice(0, req.file.originalname.lastIndexOf('.'))
  const newData = {
    ...data,
    create_time: formatTime(),
    file_name,
    original_name
  }
  const sqlAddQuestionBank = 'INSERT INTO sys_question_bank SET ?'
  db.query(sqlAddQuestionBank, [newData], (err, results) => {
    if (err) return res.ck(err)
    if (results.affectedRows !== 1) return res.ck('添加题库失败, 请稍后再试!')
    // 解析word
    var absPath = path.join(__dirname, `../uploads/${file_name}.docx`);
    console.log(absPath)
    parser(absPath, resultList => {
      Array.prototype.getArrayIndex=function(obj){
        for(var i=0;i<this.length;i++){
         if(this[i]===obj){
          return i;
            }
        }
           return -1;
       }
      const danInx = resultList.getArrayIndex('单选题')
      const duoInx = resultList.getArrayIndex('多选题')
      const panInx = resultList.getArrayIndex('判断题')
      const tianInx = resultList.getArrayIndex('填空题')
      const jianInx = resultList.getArrayIndex('问答题')
      let dan = resultList.slice(danInx + 1, duoInx)
      let duo = resultList.slice(duoInx + 1, panInx)
      let pan = resultList.slice(panInx + 1, tianInx)
      let tian = resultList.slice(tianInx + 1, jianInx)
      let jian = resultList.slice(jianInx + 1)
      console.log(dan)
      console.log(duo)
      console.log(pan)
      console.log(tian)
      console.log(jian)
    })
    // return res.ck('添加题库成功!', '添加题库成功!', 0)
  })
}