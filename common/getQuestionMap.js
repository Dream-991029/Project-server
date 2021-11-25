module.exports = (status, info, queinx, curent, type, create_by, number_answers, number_errors) => {
  // 选择题选项正则
  let optionsReg = /^[A-Z]{1}(、|\.){1}.*$/
  // 答案正则
  let answerReg = /^答案/
  // 解析正则
  let analysisReg = /^解析/
  // 定义一个Map对象
  let obj = new Map()
  // 问题id
  let qid = ''
  // 问题
  let q = ''
  // 问题(两种情况: 1. 数字+、   2. 数字+.)
  if (info[queinx].indexOf('、') + 1 !== 0) {
    qid = info[queinx].slice(0, info[queinx].indexOf('、')).trim()
    q = info[queinx].slice(info[queinx].indexOf('、') + 1).trim()
  } else if (info[queinx].indexOf('.') + 1 !== 0) {
    qid = info[queinx].slice(0, info[queinx].indexOf('.')).trim()
    q = info[queinx].slice(info[queinx].indexOf('.') + 1).trim()
  }
  // 将问题id和问题存入obj中
  obj.set('question_id', parseInt(qid))
  obj.set('question', q)
  // 取出选项+答案+解析列表
  let options_answer_analysis = []
  if (status === 0) {
    options_answer_analysis = info.slice(queinx + 1)
  } else {
    options_answer_analysis = info.slice(queinx + 1, curent)
  }
  // 选项列表
  let options_list = []
  // 选项索引列表
  let oaal = []
  // 取出选项索引并添加到选项索引列表中，找到答案和解析
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
  // 判断此问题是否有解析, 若没有解析则返回undefind
  if (obj.get('analysis') === undefined) {
    obj.set('analysis', undefined)
  }
  // 判断此问题是否有选项, 若没有选项则返回undefind, 否则进一步获取选项列表
  if (oaal.length === 0) {
    options_list = undefined
  } else {
    // 遍历选项索引列表
    oaal.forEach((_v, _i, _a) => {
      // 选项在一行, 使用空字符进行分割得到选项列表
      if (_a.length === 1) {
        options_list = options_answer_analysis[_v].split(/\s+/)
      } else if (_a.length === 2) {
        // 选项在两行, 共遍历两次, 在每次遍历中以空白字符分割, 依次添加到选项列表中
        options_answer_analysis[_v].split(/\s+/).forEach((__v, __i, __a) => {
          options_list.push(__v.trim())
        })
      } else {
        // 选项行数 > 2, 将选项依次添加到列表中
        options_list.push(options_answer_analysis[_v].trim())
      }
    })
  }
  // 添加问题选项
  obj.set('question_options', JSON.stringify(options_list))
  // 添加问题类型
  obj.set('type', type.toString())
  // 添加创建者
  obj.set('create_by', parseInt(create_by))
  // 添加此问题总答题数
  obj.set('number_answers', number_answers)
  // 添加此问题回答错误数
  obj.set('number_errors', number_errors)
  return obj
}
