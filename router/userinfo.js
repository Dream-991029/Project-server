const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入用户路由处理函数
const userInfoHandler = require("../router-handler/userinfo");

// 创建获取用户信息路由
router.get('', userInfoHandler.getUserInfo);

// 导出路由对象
module.exports = router;


