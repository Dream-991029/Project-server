const joi = require('@hapi/joi');

// 验证规则
// 分页接口验证
const schemaGetUerInfoList = joi.object({
  user_name: joi.string().allow('').max(30).error(new Error('用户帐号长度不能超过30!')),
  page_num: joi.number().required().error(new Error('页数为非空数字!')),
  page_size: joi.number().required().error(new Error('条数为非空数字!'))
});
// 获取单个用户信息
const schemaGetUerInfo = joi.object({
  user_name: joi.string().allow('').max(30).error(new Error('用户帐号长度不能超过30!'))
});
// 添加用户
const schemaAddUserInfo = joi.object({
  user_name: joi.string().required().max(30).error(new Error('用户帐号不能为空,最大长度为30的字符串!')),
  user_type: joi.string().max(2).valid("00", "11").error(new Error('用户类型最大长度为2的字符串(允许值: 00或11)!')),
  phone_number: joi.string().pattern(/^1[3|4|5|6|7|8|9]\d{9}$/).error(new Error('手机号码必须为11位!')),
  sex: joi.string().max(1).valid("0", "1", "2").error(new Error('用户性别最大长度为1的字符串(允许值: 0 或 1 或 2)!')),
  password: joi.string().required().max(100).error(new Error('密码最大长度为100的字符串!')),
  create_by: joi.number().required().error(new Error('创建者id有误!')),
  confirm_password: joi.valid(joi.ref('password')).error(new Error('两次输入密码不一致!')),
  remark: joi.string().min(0).allow('').max(500).error(new Error('备注最大长度为500的字符串!'))
})
// 修改用户
const schemaEditUserInfo = joi.object({
  user_id: joi.number().required().error(new Error('用户id不能为空!')),
  user_name: joi.string().required().max(30).error(new Error('用户帐号不能为空,最大长度为30的字符串!')),
  user_type: joi.string().max(2).valid("00", "11").error(new Error('用户类型最大长度为2的字符串(允许值: 00或11)!')),
  phone_number: joi.string().pattern(/^1[3|4|5|6|7|8|9]\d{9}$/).error(new Error('手机号码必须为11位!')),
  sex: joi.string().max(1).valid("0", "1", "2").error(new Error('用户性别最大长度为1的字符串(允许值: 0 或 1 或 2)!')),
  password: joi.string().min(0).allow('').max(100).error(new Error('密码最大长度为100的字符串!')),
  status: joi.string().max(1).valid("0", "1").error(new Error('用户状态最大长度为1的字符串(允许值: 0 或 1)!')),
  update_by: joi.number().required().error(new Error('更新者不能为空!')),
  confirm_password: joi.valid(joi.ref('password')).error(new Error('两次输入密码不一致!')),
  remark: joi.string().min(0).allow('').max(500).error(new Error('备注最大长度为500的字符串!'))
})
// 删除用户
const schemaDeleteUserInfo = joi.object({
  user_id: joi.number().required().error(new Error('用户id不能为空!')),
  user_name: joi.string().required().max(30).error(new Error('用户帐号不能为空,最大长度为30的字符串!'))
})

// 公开验证规则
module.exports.schema = {
  schemaGetUerInfoList,
  schemaGetUerInfo,
  schemaAddUserInfo,
  schemaEditUserInfo,
  schemaDeleteUserInfo
}

// 公开验证接口
module.exports.validate = (data, schema) => {
  let { error, value} = schema.validate(data);
  if (error) {
    return error;
  }
  return null;
};