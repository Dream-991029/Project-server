const joi = require('@hapi/joi');

// 验证规则
const schemaGetUerInfo = joi.object({
  user_name: joi.string().allow('').max(30).error(new Error('用户帐号长度不能超过30!')),
  page_num: joi.number().required().error(new Error('页数为非空数字!')),
  page_size: joi.number().required().error(new Error('条数为非空数字!'))
});

// 公开验证规则
module.exports.schema = {
  schemaGetUerInfo
}

// 公开验证接口
module.exports.validate = (data, schema) => {
  let { error, value} = schema.validate(data);
  if (error) {
    return error;
  }
  return null;
};