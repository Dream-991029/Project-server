// 导入数据库模块
const db = require('../db/mysql');
// 导入用户表单验证
const menuFromCheck = require('../checkfrom/menu');

// 查找根节点
function findRootNode (allMenu, data) {
  // 根节点
  let rootNode = [];
  // 遍历菜单列表,根据id获取根节点
  allMenu.forEach(val => {
    if (val.menu_id === parseInt(data.id)) {
      rootNode[rootNode.length] = val;
      return;
    }
  })
  return rootNode;
}

// 获取节点下面的子节点
function getChildNode (allMenu, root) {
  // 创建一个空数组,用于装子节点
  var childList = [];
  allMenu.forEach(val => {
    // 遍历出的parentid和节点的menuid相等,则将所有子节点装进数组中
    if (val.parent_id === root.menu_id) {
      childList[childList.length] = val;
    }
  })
  // 返回节点的子节点列表
  return childList;
}

// 获取根节点下面所有节点
function getAllNode (allMenu, rootNode) {
  // 根节点所有子节点
  var childList = getChildNode(allMenu, rootNode[0])
  // 若没找到子节点,则只返回一个根节点列表即可
  if (childList.length === 0) {
    return;
  } else {
    // 找到子节点,则继续遍历所有子节点,获取后代节点
    childList.forEach((val, inx, self) => {
      self[inx].children = getAllNode(allMenu, [self[inx]]);
    })
    // 将子节点添加到根节点中
    rootNode[0].children = childList;
  }
  // 所有节点全部遍历完成,将根节点返回
  return childList
}

module.exports.getMenuInfo = (req, res) => {
  let data = req.params;
  const valueErr = menuFromCheck.validate(data, menuFromCheck.schema.schemaGetMenuInfo);
  if (valueErr) {
    return res.ck(valueErr);
  }
  // 获取菜单表中所有数据
  const sqlGetMenu = 'SELECT * FROM sys_menu info ORDER BY info.order_num';
  db.query(sqlGetMenu, (err, results) => {
    if (err) return res.ck(err);
    // 保存菜单所有数据
    let allMenu = results;
    // 根节点
    let rootNode = findRootNode(allMenu, data);
    // 没找到根节点
    if (rootNode.length === 0) {
      return res.ck('此菜单不存在')
    }
    // 找到根节点, 查找根节点下面所有子节点
    rootNode.children = getAllNode(allMenu, rootNode)
    return res.ck(rootNode, 0)
  })
}
