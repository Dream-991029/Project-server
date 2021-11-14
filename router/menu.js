const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入用户路由处理函数
const menuHandler = require("../router-handler/menu");
// 创建获取菜单树路由
router.get('/:id', menuHandler.getMenuInfo);

// 导出路由对象
module.exports = router;
