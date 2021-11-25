// 导入数据库模块
const db = require('../db/mysql');
// 导入用户表单验证
const fileFromCheck = require('../checkfrom/file');
const formatTime = require('../common/formatTime');
// 引入word-text-parser模块
const parser = require('word-text-parser');
// 引入getQuestionMap模块
const getQuestionMap = require('../common/getQuestionMap')
const path = require('path');
// 上传文件
module.exports.uploadFile = (req, res) => {
  if (!req.file || req.file.fieldname !== 'topicFile') return res.ck('未上传文件!')
  const data = req.body;
  // 表单验证
  const valErr = fileFromCheck.validate(data, fileFromCheck.schema.schemaUpdateFile);
  if (valErr) return res.ck(valErr)
  // 获取文件名称
  const file_name = req.file.filename.split('.')[0]
  // 获取文件原始名称
  const original_name = req.file.originalname.slice(0, req.file.originalname.lastIndexOf('.'))
  const newData = {
    ...data,
    create_time: formatTime(),
    file_name,
    original_name
  }
  const sqlAddQuestionBank = 'INSERT INTO sys_question_bank SET ?'
  // 添加题库
  db.query(sqlAddQuestionBank, [newData], (err, results) => {
    if (err) return res.ck(err)
    if (results.affectedRows !== 1) return res.ck('添加题库失败, 请稍后再试!')
    // 获取题库id
    const topic_id = results.insertId;
    // 获取创建者
    const create_by = newData.create_by
    const number_answers = 120
    const number_errors = 30
    // 获取当前word绝对路径
    const absPath = path.join(__dirname, `../uploads/${file_name}.docx`);
    // 定义问题类型列表
    const questionTypeList = ['单选题', '多选题', '判断题', '填空题', '问答题']
    // 封装一个查找元素在数组中位置的方法
    Array.prototype.getArrayIndex = function (obj) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) return i
      }
      return -1;
    }
    // 封装trim方法, 用于去除字符串两边字符
    String.prototype.trim = function (char, type) {
      if (char) {
        if (type == 'left') {
          return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type == 'right') {
          return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
      }
      return this.replace(/^\s+|\s+$/g, '');
    };
    parser(absPath, resultList => {
      let queInfoList = []
      // 问题正则
      let questionReg = /^\d+(、|\.){1}.*$/
      // 根据上面封装的getArrayIndex方法, 将所有问题类型位置找到, 使用reduce方法遍历出每个问题类型列表
      questionTypeList.map(val => resultList.getArrayIndex(val)).reduce((pre, cur, inx, arr) => {
        // 问题类型列表(问题+选项+答案+解析)
        let info = resultList.slice(pre + 1, cur)
        // 问题索引列表
        let ql = []
        info.forEach((_val, _index) => {
          if (questionReg.test(_val)) {
            ql.push(_index)
          }
        })
        // 问题个数(两种情况: 1. 一个问题 2. 多个问题)
        if (ql.length === 1) {
          queInfoList.push(getQuestionMap(0, info, ql[0], 3123124, inx - 1, create_by, number_answers, number_errors))
        } else {
          // 多个问题情况: 
          ql.reduce((_pre, _cur, _inx, _arr) => {
            queInfoList.push(getQuestionMap(1, info, _pre, _cur, inx - 1, create_by, number_answers, number_errors))
            // 最后一个问题
            if (_inx === _arr.length - 1) {
              queInfoList.push(getQuestionMap(0, info, _cur, 3123124, inx - 1, create_by, number_answers, number_errors))
            }
            return _cur
          })
        }
        // 简答题
        if (inx === arr.length - 1) {
          const info = resultList.slice(cur + 1)
          // 取出所有问题的索引
          let ql = []
          info.forEach((_val, _index) => {
            // 判断是否是问题
            if (questionReg.test(_val)) {
              // 将问题所在info中的索引返回
              ql.push(_index)
            }
          })
          if (ql.length === 1) {
            queInfoList.push(getQuestionMap(0, info, ql[0], 3123124, inx, create_by, number_answers, number_errors))
          } else {
            ql.reduce((_pre, _cur, _inx, _arr) => {
              queInfoList.push(getQuestionMap(1, info, _pre, _cur, inx, create_by, number_answers, number_errors))
              // 最后一个问题
              if (_inx === _arr.length - 1) {
                queInfoList.push(getQuestionMap(0, info, _cur, 3123124, inx, create_by, number_answers, number_errors))
              }
              return _cur
            })
          }
        }
        // 将本次位置作为下次首位置
        return cur
      })
      const key_list = Array.from(queInfoList[0].keys()).join(',') + ",topic_id"
      queInfoList.forEach((val, inx, arr) => {
        let info = Array.from(val.values())
        info.push(topic_id)
        arr[inx] = info
      })
      const sqlAddQuestion = `INSERT INTO sys_question(${key_list}) VALUES ?`
      db.query(sqlAddQuestion, [queInfoList], (err, results) => {
        if (err) return res.ck(err)
        if (results.affectedRows !== queInfoList.length) return res.ck('添加题库失败, 请稍后再试!')
        return res.ck('添加题库成功!', '添加题库成功!', 0)
      })
    })
  })
}

// 获取题目
module.exports.getTopicInfo = (req, res) => {
  console.log(req.query);
}