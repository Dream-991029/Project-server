const joi = require('@hapi/joi');

// 验证规则
const schemaUpdateFile = joi.object({
  name: joi.string().required().max(100).error(new Error('用户帐号不能为空,最大长度为100的字符串!')),
  create_by: joi.number().required().error(new Error('创建者id有误!')),
  import_type: joi.string().max(1).valid("0", "1", "2", "3", "4").error(new Error('导入类型有误!'))
});

// 公开验证规则
module.exports.schema = {
  schemaUpdateFile
}

// 公开验证接口
module.exports.validate = (data, schema) => {
  let { error, value} = schema.validate(data);
  if (error) {
    return error;
  }
  return null;
};