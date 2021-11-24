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
    parser(absPath, resultList => {
      Array.prototype.getArrayIndex = function (obj) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] === obj) return i
        }
        return -1;
      }
      const sqlAddQuestion = 'INSERT INTO sys_question SET ?'
      const queTypeList = ['单选题', '多选题', '判断题', '填空题', '问答题']
      let queInfoList = []
      let questionReg = /^\d+(、|\.){1}.*$/
      let optionsReg = /^[A-Z]{1}(、|\.){1}.*$/
      let answerReg = /^答案/
      let analysisReg = /^解析/
      let regInfoReg = /(.*)、(.*)/
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
      queTypeList.map(val => resultList.getArrayIndex(val)).reduce((pre, cur, inx, arr) => {
        // 拿到题目列表
        let info = resultList.slice(pre + 1, cur)
        // 取出所有问题的索引
        let ql = []
        info.forEach((_val, _index) => {
          // 判断是否是问题
          if (questionReg.test(_val)) {
            // 将问题所在info中的索引返回
            ql.push(_index)
          }
        })
        ql.reduce((_pre, _cur, _inx, _arr) => {
          let obj = new Map()
          // 判断问题中是否含有、或者.
          if (info[_pre].indexOf('、') + 1 === 0) {
            regInfoReg = /(.*)\.(.*)/
          }
          // 将问题id和问题存入obj中
          let question_info = info[_pre].match(regInfoReg)
          obj.set('question_id', question_info[1].trim())
          obj.set('question', question_info[2].trim())
          // 取出所有选项+答案+解析, 并存入obj中
          let options_answer_analysis = info.slice(_pre + 1, _cur)
          let options_list = []
          let oaal = []
          options_answer_analysis.forEach((__val, __index) => {
            // 判断是否是选项
            if (optionsReg.test(__val)) {
              oaal.push(__index)
            } else if (answerReg.test(__val)) {
              obj.set('answer', options_answer_analysis[__index].match(/答案(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
            } else if (analysisReg.test(__val)) {
              obj.set('analysis', options_answer_analysis[__index].match(/解析(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
            }
          })
          if (oaal.length !== 0) {
            oaal.reduce((__pre, __cur, __inx, __arr) => {
              options_list.push(info[__pre])
              if (__inx === __arr.length - 1)
                options_list.push(info[__pre])
              return __cur
            })
            obj.set('question_options', options_list.join('|'))
          } else {
            obj.set('question_options', '')
          }
          obj.set('type', _pre)
          obj.set('create_by', newData.create_by)
          obj.set('number_answers', 120)
          obj.set('number_errors', 30)
          queInfoList.push(obj)
          // 最后一个问题
          if (_inx === _arr.length - 1) {
            let _obj = new Map()
            // 判断问题中是否含有、或者.
            if (info[_cur].indexOf('、') + 1 === 0) {
              regInfoReg = /(.*)\.(.*)/
            }
            question_info = info[_cur].match(regInfoReg)
            _obj.set('question_id', question_info[1].trim())
            _obj.set('question', question_info[2].trim())
            // 取出所有选项+答案+解析, 并存入obj中
            let options_answer_analysis = info.slice(_cur + 1)
            let options_list = []
            let oaal = []
            options_answer_analysis.forEach((__val, __index) => {
              // 判断是否是选项
              if (optionsReg.test(__val)) {
                oaal.push(__index)
              } else if (answerReg.test(__val)) {
                obj.set('answer', options_answer_analysis[__index].match(/答案(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
              } else if (analysisReg.test(__val)) {
                obj.set('analysis', options_answer_analysis[__index].match(/解析(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
              }
            })
            if (oaal.length !== 0) {
              oaal.reduce((__pre, __cur, __inx, __arr) => {
                options_list.push(info[__pre])
                if (__inx === __arr.length - 1)
                  options_list.push(info[__pre])
                return __cur
              })
              obj.set('question_options', options_list.join('|'))
            } else {
              obj.set('question_options', '')
            }
            _obj.set('type', _pre)
            _obj.set('create_by', newData.create_by)
            _obj.set('number_answers', 120)
            _obj.set('number_errors', 30)
            queInfoList.push(_obj)
          }
          return _cur
        })
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
          ql.reduce((_pre, _cur, _inx, _arr) => {
            let obj = new Map()
            // 判断问题中是否含有、或者.
            if (info[_pre].indexOf('、') + 1 === 0) {
              regInfoReg = /(.*)\.(.*)/
            }
            // 将问题id和问题存入obj中
            let question_info = info[_pre].match(regInfoReg)
            obj.set('question_id', question_info[1].trim())
            obj.set('question', question_info[2].trim())
            // 取出所有选项+答案+解析, 并存入obj中
            let options_answer_analysis = info.slice(_pre + 1, _cur)
            let options_list = []
            let oaal = []
            options_answer_analysis.forEach((__val, __index) => {
              // 判断是否是选项
              if (optionsReg.test(__val)) {
                oaal.push(__index)
              } else if (answerReg.test(__val)) {
                obj.set('answer', options_answer_analysis[__index].match(/答案(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
              } else if (analysisReg.test(__val)) {
                obj.set('analysis', options_answer_analysis[__index].match(/解析(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
              }
            })
            oaal.reduce((__pre, __cur, __inx, __arr) => {
              options_list.push(info[__pre])
              if (__inx === __arr.length - 1)
                options_list.push(info[__pre])
              return __cur
            })
            obj.set('question_options', options_list.join('|'))
            obj.set('type', _pre)
            obj.set('create_by', newData.create_by)
            obj.set('number_answers', 120)
            obj.set('number_errors', 30)
            queInfoList.push(obj)
            // 最后一个问题
            if (_inx === _arr.length - 1) {
              let _obj = new Map()
              // 判断问题中是否含有、或者.
              if (info[_cur].indexOf('、') + 1 === 0) {
                regInfoReg = /(.*)\.(.*)/
              }
              question_info = info[_cur].match(regInfoReg)
              _obj.set('question_id', question_info[1].trim())
              _obj.set('question', question_info[2].trim())
              // 取出所有选项+答案+解析, 并存入obj中
              let options_answer_analysis = info.slice(_cur + 1)
              let options_list = []
              let oaal = []
              options_answer_analysis.forEach((__val, __index) => {
                // 判断是否是选项
                if (optionsReg.test(__val)) {
                  oaal.push(__index)
                } else if (answerReg.test(__val)) {
                  obj.set('answer', options_answer_analysis[__index].match(/答案(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                } else if (analysisReg.test(__val)) {
                  obj.set('analysis', options_answer_analysis[__index].match(/解析(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                }
              })
              oaal.reduce((__pre, __cur, __inx, __arr) => {
                options_list.push(info[__pre])
                if (__inx === __arr.length - 1)
                  options_list.push(info[__pre])
                return __cur
              })
              if (options_list.length === 0) {
                _obj.set('question_options', '')
              } else {
                _obj.set('question_options', options_list.join('|'))
              }
              _obj.set('type', _pre)
              _obj.set('create_by', newData.create_by)
              _obj.set('number_answers', 120)
              _obj.set('number_errors', 30)
              queInfoList.push(_obj)
            }
            return _cur
          })
        }
        return cur
      })
      console.log(queInfoList)
    })
    // return res.ck('添加题库成功!', '添加题库成功!', 0)
  })
}