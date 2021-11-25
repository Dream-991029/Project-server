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
      const queTypeList = ['单选题', '多选题', '判断题', '填空题', '问答题']
      let queInfoList = []
      let questionReg = /^\d+(、|\.){1}.*$/
      let optionsReg = /^[A-Z]{1}(、|\.){1}.*$/
      let answerReg = /^答案/
      let analysisReg = /^解析/
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
        if (ql.length === 1) {
          let obj = new Map()
          let qid = ''
          let q = ''
          if (info[ql[0]].indexOf('、') + 1 !== 0) {
            qid = info[ql[0]].slice(0, info[ql[0]].indexOf('、')).trim()
            q = info[ql[0]].slice(info[ql[0]].indexOf('、') + 1).trim()
          } else if (info[ql[0]].indexOf('.') + 1 !== 0) {
            qid = info[ql[0]].slice(0, info[ql[0]].indexOf('.')).trim()
            q = info[ql[0]].slice(info[ql[0]].indexOf('.') + 1).trim()
          }
          // 将问题id和问题存入obj中
          obj.set('question_id', parseInt(qid))
          obj.set('question', q)
          // 取出所有选项+答案+解析, 并存入obj中
          let options_answer_analysis = info.slice(ql[0] + 1)
          let options_list = []
          let oaal = []
          options_answer_analysis.forEach((__val, __index) => {
            // 判断是否是选项
            if (optionsReg.test(__val)) {
              oaal.push(__index)
            } else if (answerReg.test(__val)) {
              obj.set('answer', __val.match(/答案(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
            } else if (analysisReg.test(__val)) {
              obj.set('analysis', __val.match(/解析(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
            }
          })
          if (obj.get('analysis') === undefined) {
            obj.set('analysis', undefined)
          }
          if (oaal.length === 0) {
            options_list = undefined
          } else {
            oaal.forEach((_v, _i, _a) => {
              if (_a.length === 1) {
                options_list = options_answer_analysis[_v].split(/\s+/)
              } else if (_a.length === 2) {
                options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                  options_list.push(__v.trim())
                })
              } else {
                options_list.push(options_answer_analysis[_v].trim())
              }
            })
          }
          obj.set('question_options', JSON.stringify(options_list))
          obj.set('type', (inx - 1).toString())
          obj.set('create_by', parseInt(newData.create_by))
          obj.set('number_answers', 120)
          obj.set('number_errors', 30)
          queInfoList.push(obj)
        } else {
          ql.reduce((_pre, _cur, _inx, _arr) => {
            let obj = new Map()
            // 判断问题中是否含有、或者.
            let qid = ''
            let q = ''
            if (info[_pre].indexOf('、') + 1 !== 0) {
              qid = info[_pre].slice(0, info[_pre].indexOf('、')).trim()
              q = info[_pre].slice(info[_pre].indexOf('、') + 1).trim()
            } else if (info[_pre].indexOf('.') + 1 !== 0) {
              qid = info[_pre].slice(0, info[_pre].indexOf('.')).trim()
              q = info[_pre].slice(info[_pre].indexOf('.') + 1).trim()
            }
            // 将问题id和问题存入obj中
            obj.set('question_id', parseInt(qid))
            obj.set('question', q)
            // 取出所有选项+答案+解析, 并存入obj中
            let options_answer_analysis = info.slice(_pre + 1, _cur)
            let options_list = []
            let oaal = []
            options_answer_analysis.forEach((__val, __index) => {
              // 判断是否是选项
              if (optionsReg.test(__val)) {
                oaal.push(__index)
              } else if (answerReg.test(__val)) {
                obj.set('answer', __val.match(/答案(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
              } else if (analysisReg.test(__val)) {
                obj.set('analysis', __val.match(/解析(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
              }
            })
            if (obj.get('analysis') === undefined) {
              obj.set('analysis', undefined)
            }
            if (oaal.length === 0) {
              options_list = undefined
            } else {
              oaal.forEach((_v, _i, _a) => {
                if (_a.length === 1) {
                  options_list = options_answer_analysis[_v].split(/\s+/)
                } else if (_a.length === 2) {
                  options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                    options_list.push(__v.trim())
                  })
                } else {
                  options_list.push(options_answer_analysis[_v].trim())
                }
              })
            }
            obj.set('question_options', JSON.stringify(options_list))
            obj.set('type', (inx - 1).toString())
            obj.set('create_by', parseInt(newData.create_by))
            obj.set('number_answers', 120)
            obj.set('number_errors', 30)
            queInfoList.push(obj)
            // 最后一个问题
            if (_inx === _arr.length - 1) {
              let _obj = new Map()
              // 判断问题中是否含有、或者.
              let qid = ''
              let q = ''
              if (info[_cur].indexOf('、') + 1 !== 0) {
                qid = info[_cur].slice(0, info[_cur].indexOf('、')).trim()
                q = info[_cur].slice(info[_cur].indexOf('、') + 1).trim()
              } else if (info[_cur].indexOf('.') + 1 !== 0) {
                qid = info[_cur].slice(0, info[_cur].indexOf('.')).trim()
                q = info[_cur].slice(info[_cur].indexOf('.') + 1).trim()
              }
              // 将问题id和问题存入obj中
              _obj.set('question_id', parseInt(qid))
              _obj.set('question', q)
              // 取出所有选项+答案+解析, 并存入obj中
              let options_answer_analysis = info.slice(_cur + 1)
              let options_list = []
              let oaal = []
              options_answer_analysis.forEach((__val, __index) => {
                // 判断是否是选项
                if (optionsReg.test(__val)) {
                  oaal.push(__index)
                } else if (answerReg.test(__val)) {
                  _obj.set('answer', __val.match(/答案(.*)/)[1].trim('：').trim(':').trim())
                } else if (analysisReg.test(__val)) {
                  _obj.set('analysis', __val.match(/解析(.*)/)[1].trim('：').trim(':').trim())
                }
              })
              if (_obj.get('analysis') === undefined) {
                _obj.set('analysis', undefined)
              }
              if (oaal.length === 0) {
                options_list = undefined
              } else {
                oaal.forEach((_v, _i, _a) => {
                  if (_a.length === 1) {
                    options_list = options_answer_analysis[_v].split(/\s+/)
                  } else if (_a.length === 2) {
                    options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                      options_list.push(__v.trim())
                    })
                  } else {
                    options_list.push(options_answer_analysis[_v].trim())
                  }
                })
              }
              _obj.set('question_options', JSON.stringify(options_list))
              _obj.set('type', (inx - 1).toString())
              _obj.set('create_by', parseInt(newData.create_by))
              _obj.set('number_answers', 120)
              _obj.set('number_errors', 30)
              queInfoList.push(_obj)
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
            let obj = new Map()
            let qid = ''
            let q = ''
            if (info[ql[0]].indexOf('、') + 1 !== 0) {
              qid = info[ql[0]].slice(0, info[ql[0]].indexOf('、')).trim()
              q = info[ql[0]].slice(info[ql[0]].indexOf('、') + 1).trim()
            } else if (info[ql[0]].indexOf('.') + 1 !== 0) {
              qid = info[ql[0]].slice(0, info[ql[0]].indexOf('.')).trim()
              q = info[ql[0]].slice(info[ql[0]].indexOf('.') + 1).trim()
            }
            // 将问题id和问题存入obj中
            obj.set('question_id', parseInt(qid))
            obj.set('question', q)
            // 取出所有选项+答案+解析, 并存入obj中
            let options_answer_analysis = info.slice(ql[0] + 1)
            let options_list = []
            let oaal = []
            options_answer_analysis.forEach((__val, __index) => {
              // 判断是否是选项
              if (optionsReg.test(__val)) {
                oaal.push(__index)
              } else if (answerReg.test(__val)) {
                obj.set('answer', __val.match(/答案(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
              } else if (analysisReg.test(__val)) {
                obj.set('analysis', __val.match(/解析(.*)/)[1].trim(':', 'left').trim('：', 'left').trim())
              }
            })
            if (obj.get('analysis') === undefined) {
              obj.set('analysis', undefined)
            }
            if (oaal.length === 0) {
              options_list = undefined
            } else {
              oaal.forEach((_v, _i, _a) => {
                if (_a.length === 1) {
                  options_list = options_answer_analysis[_v].split(/\s+/)
                } else if (_a.length === 2) {
                  options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                    options_list.push(__v.trim())
                  })
                } else {
                  options_list.push(options_answer_analysis[_v].trim())
                }
              })
            }
            obj.set('question_options', JSON.stringify(options_list))
            obj.set('type', inx.toString())
            obj.set('create_by', parseInt(newData.create_by))
            obj.set('number_answers', 120)
            obj.set('number_errors', 30)
            queInfoList.push(obj)
          } else {
            ql.reduce((_pre, _cur, _inx, _arr) => {
              let obj = new Map()
              // 判断问题中是否含有、或者.
              let qid = ''
              let q = ''
              if (info[_pre].indexOf('、') + 1 !== 0) {
                qid = info[_pre].slice(0, info[_pre].indexOf('、')).trim()
                q = info[_pre].slice(info[_pre].indexOf('、') + 1).trim()
              } else if (info[_pre].indexOf('.') + 1 !== 0) {
                qid = info[_pre].slice(0, info[_pre].indexOf('.')).trim()
                q = info[_pre].slice(info[_pre].indexOf('.') + 1).trim()
              }
              // 将问题id和问题存入obj中
              obj.set('question_id', parseInt(qid))
              obj.set('question', q)
              // 取出所有选项+答案+解析, 并存入obj中
              let options_answer_analysis = info.slice(_pre + 1, _cur)
              let options_list = []
              let oaal = []
              options_answer_analysis.forEach((__val, __index) => {
                // 判断是否是选项
                if (optionsReg.test(__val)) {
                  oaal.push(__index)
                } else if (answerReg.test(__val)) {
                  obj.set('answer', __val.match(/答案(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                } else if (analysisReg.test(__val)) {
                  obj.set('analysis', __val.match(/解析(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                }
              })
              if (obj.get('analysis') === undefined) {
                obj.set('analysis', undefined)
              }
              if (oaal.length === 0) {
                options_list = undefined
              } else {
                oaal.forEach((_v, _i, _a) => {
                  if (_a.length === 1) {
                    options_list = options_answer_analysis[_v].split(/\s+/)
                  } else if (_a.length === 2) {
                    options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                      options_list.push(__v.trim())
                    })
                  } else {
                    options_list.push(options_answer_analysis[_v].trim())
                  }
                })
              }
              
              obj.set('question_options', JSON.stringify(options_list))
              obj.set('type', inx.toString())
              obj.set('create_by', parseInt(newData.create_by))
              obj.set('number_answers', 120)
              obj.set('number_errors', 30)
              queInfoList.push(obj)
              // 最后一个问题
              if (_inx === _arr.length - 1) {
                let _obj = new Map()
                // 判断问题中是否含有、或者.
                let qid = ''
                let q = ''
                if (info[_cur].indexOf('、') + 1 !== 0) {
                  qid = info[_cur].slice(0, info[_cur].indexOf('、')).trim()
                  q = info[_cur].slice(info[_cur].indexOf('、') + 1).trim()
                } else if (info[_cur].indexOf('.') + 1 !== 0) {
                  qid = info[_cur].slice(0, info[_cur].indexOf('.')).trim()
                  q = info[_cur].slice(info[_cur].indexOf('.') + 1).trim()
                }
                // 将问题id和问题存入obj中
                _obj.set('question_id', parseInt(qid))
                _obj.set('question', q)
                // 取出所有选项+答案+解析, 并存入obj中
                let options_answer_analysis = info.slice(_cur + 1)
                let options_list = []
                let oaal = []
                options_answer_analysis.forEach((__val, __index) => {
                  // 判断是否是选项
                  if (optionsReg.test(__val)) {
                    oaal.push(__index)
                  } else if (answerReg.test(__val)) {
                    _obj.set('answer', __val.match(/答案(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                  } else if (analysisReg.test(__val)) {
                    _obj.set('analysis', __val.match(/解析(.*)/)[1].trim('：', 'left').trim(':', 'left').trim())
                  }
                })
                if (_obj.get('analysis') === undefined) {
                  _obj.set('analysis', undefined)
                }
                if (oaal.length === 0) {
                  options_list = undefined
                } else {
                  oaal.forEach((_v, _i, _a) => {
                    if (_a.length === 1) {
                      options_list = options_answer_analysis[_v].split(/\s+/)
                    } else if (_a.length === 2) {
                      options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
                        options_list.push(__v.trim())
                      })
                    } else {
                      options_list.push(options_answer_analysis[_v].trim())
                    }
                  })
                }
                _obj.set('question_options', JSON.stringify(options_list))
                _obj.set('type', inx.toString())
                _obj.set('create_by', parseInt(newData.create_by))
                _obj.set('number_answers', 120)
                _obj.set('number_errors', 30)
                queInfoList.push(_obj)
              }
              return _cur
            })
          }
        }
        return cur
      })
      const key_list = Array.from(queInfoList[0].keys()).join(',')
      queInfoList.forEach((val, inx, arr) => {
        arr[inx] = Array.from(val.values())
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