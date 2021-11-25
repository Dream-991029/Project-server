const express = require('express');
// 创建路由对象
const router = express.Router();
// 导入multer模块
const multer = require('multer')
// 导入path路径模块
const path = require('path');
// 导入uuid
const { v4: uuidv4 } = require('uuid');
var storage = multer.diskStorage({
  // 保存的路径,自己创建
  destination (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  // 处理文件名
  filename (req, file, cb) {
    // 取后缀
    const fileFormat = (file.originalname).split('.')
    cb(null, uuidv4() + '.' + fileFormat[fileFormat.length - 1])
  }
})
// 设置上传文件存储位置
const upload = multer({ storage });
// 导入用户路由处理函数
const fileHandler = require("../router-handler/file");
// 创建上传路由
router.post('/upload', upload.single('topicFile'), fileHandler.uploadFile);
// 获取题库路由
router.get('', fileHandler.getTopicInfo)

// 导出路由对象
module.exports = router;
