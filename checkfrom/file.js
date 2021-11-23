const joi = require('@hapi/joi');

// 验证规则
const schemaUpdateFile = joi.object({
  id: joi.number().required().error(new Error('参数有误!'))
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