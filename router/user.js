const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入用户路由处理函数
const userHandler = require("../router-handler/user");
// 创建注册路由
router.post('/register', userHandler.register);
// 创建登录路由
router.post('/login', userHandler.login);

// 导出路由对象
module.exports = router;
