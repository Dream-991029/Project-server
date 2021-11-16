// 导入express模块
const express = require('express');
// 导入body-parser
const bodyParser = require('body-parser');
// 创建一个express服务器对象
const app = express();
// 导入cors跨域
const cors = require('cors');
// 服务器主机
const host = "0.0.0.0";
// 服务器端口
const port = 8024;
// 导入解析Token的中间件
const expressJwt = require('express-jwt');
// 导入配置文件
const config = require("./config");
// 注册cors
app.use(cors());
// 解析表单数据
app.use(express.urlencoded({extended: false}));
// 解析body
app.use(bodyParser.json())
// 响应数据中间件
app.use((req, res, next) => {
  res.ck = (err, message = '', status = 1) => {
    let obj = {
      status,
      msg: err instanceof Error ? err.message : err
    };
    if (status != 1) {
      obj = {
        status,
        msg: message,
        data: err
      }
      res.json(obj);
    } else {
      res.send(obj);
    }
  };
  next();
});
// 解析token
app.use(expressJwt({ secret: config.jwtSecretkey, algorithms: ['HS256'] }).unless({ path: [/^\/user\//] }));
// 导入用户路由
const userRouter = require('./router/user.js');
app.use('/user', userRouter);
// 导入用户信息路由
const userInfoRouter = require('./router/userinfo.js')
app.use('/userinfo', userInfoRouter)
// 导入菜单树路由
const treeMenuRouter = require('./router/menu.js')
app.use('/menu', treeMenuRouter);
// 检测token
app.use((err, req, res, next) => {
  console.log(err);
  let errInfo = "身份已过期!"
  if (err.name === "UnauthorizedError" && (err.message === "invalid signature" || err.inner.message === "No authorization token was found")) {
    errInfo = "身份验证错误!";
  }
  return res.ck(errInfo);
})
// 启动服务器
app.listen(port, host,() => {
  console.log(`服务器启动成功! 访问http://${host}:${port}`);
})