/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : 192.168.10.7:3306
 Source Schema         : project_01

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 15/11/2021 01:19:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `menu_id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `menu_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '菜单名称',
  `parent_id` bigint NULL DEFAULT 0 COMMENT '父菜单ID',
  `order_num` int NULL DEFAULT 0 COMMENT '显示顺序',
  `path` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '组件路径',
  `is_frame` int NULL DEFAULT 1 COMMENT '是否为外链（0是 1否）',
  `is_cache` int NULL DEFAULT 0 COMMENT '是否缓存（0缓存 1不缓存）',
  `menu_type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `sys_code` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '系统编码（属于那个系统下面）',
  `visible` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0显示 1隐藏）',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '菜单状态（0正常 1停用）',
  `perms` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '权限标识',
  `icon` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '#' COMMENT '菜单图标',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1124 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (1064, 'BASE系统', 0, 1, 'base', '', 1, 0, 'M', '2020112614055706588491', '0', '0', '', 'iconfont iconbasesalesintegralSpecial', 1, '2020-11-26 14:05:57', 1, '2020-12-09 21:44:40', '');
INSERT INTO `sys_menu` VALUES (1065, '系统管理', 1064, 1, 'system', 'base/system/index', 1, 0, 'M', '2020112614055706588491', '0', '0', '', 'iconfont iconxitongguanli', 1, '2020-11-26 14:07:44', 1, '2020-11-27 09:12:47', '');
INSERT INTO `sys_menu` VALUES (1066, '菜单管理', 1065, 6, 'menu', 'base/system/menu', 1, 0, 'C', '2020112614055706588491', '0', '0', 'system:menu:list', 'iconfont iconcaidanguanli1', 1, '2020-11-26 14:13:18', 1, '2020-11-27 19:21:55', '');
INSERT INTO `sys_menu` VALUES (1068, '部门管理', 1065, 5, 'dept', 'base/system/dept', 1, 0, 'C', '2020112614055706588491', '0', '0', 'system:dept:list', 'iconfont iconbumenguanli', 1, '2020-11-26 19:28:44', 1, '2020-11-26 20:18:02', '');
INSERT INTO `sys_menu` VALUES (1069, '公司管理', 1065, 1, 'company', 'base/system/company', 1, 0, 'C', '2020112614055706588491', '0', '0', 'system:company:list', 'iconfont icongongsi', 1, '2020-11-26 19:35:56', 1, '2020-11-26 19:37:35', '');
INSERT INTO `sys_menu` VALUES (1071, '用户管理', 1065, 3, 'user', 'base/system/user', 1, 0, 'C', '2020112614055706588491', '0', '0', 'system:user:list', 'iconfont iconyonghuguanli', 1, '2020-11-26 20:16:28', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1072, '菜单查询', 1066, 1, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:menu:query', '#', 1, '2020-11-27 09:37:58', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1073, '菜单新增', 1066, 2, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:menu:add', '#', 1, '2020-11-27 09:38:22', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1074, '菜单修改', 1066, 3, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:menu:edit', '#', 1, '2020-11-27 09:38:41', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1075, '菜单删除', 1066, 4, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:menu:remove', '#', 1, '2020-11-27 09:39:19', 1, '2020-11-27 09:40:19', '');
INSERT INTO `sys_menu` VALUES (1096, '用户查看', 1071, 1, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:user:query', '#', 1, '2020-11-30 16:33:12', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1097, '用户新增', 1071, 2, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:user:add', '#', 1, '2020-11-30 16:33:37', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1098, '用户修改', 1071, 3, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:user:edit', '#', 1, '2020-11-30 16:34:14', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1107, '用户删除', 1071, 4, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:user:remove', '#', 1, '2020-11-30 16:45:52', NULL, NULL, '');
INSERT INTO `sys_menu` VALUES (1108, '用户导出', 1071, 5, '', '', 1, 0, 'F', '2020112614055706588491', '0', '0', 'system:user:export', '#', 1, '2020-11-30 16:46:38', NULL, NULL, '');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `user_id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户账号',
  `user_type` varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '11' COMMENT '用户类型（00系统用户 11:普通用户）',
  `phone_number` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '手机号码',
  `sex` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '密码',
  `status` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
  `del_flag` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '删除标志（0代表存在 2代表删除）',
  `create_by` bigint NULL DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` bigint NULL DEFAULT NULL COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '00', '15888888888', '1', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', '0', '0', 0, '2020-11-12 15:05:30', 0, NULL, '管理员');
INSERT INTO `sys_user` VALUES (37, 'dream', '00', '19999999999', '1', '$2a$10$srVJrOLY3KvuyMBdarFM5OyfmUzcTaqhk5IC5NyRuHO4ag73LYzIW', '0', '0', 0, '2021-11-14 15:59:00', NULL, NULL, 'dream');
INSERT INTO `sys_user` VALUES (38, 'cs', '11', '19999999999', '1', '$2a$10$WMv0uoprgnMqOF84wK2UUOHkiNvUmBi9RQhUDbi3nY1V8qk09yXlO', '0', '0', 0, '2021-11-14 19:44:27', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (39, 'cs2', '11', '19999999999', '0', '$2a$10$AcQPDPogLXlf4670ZoDiAOAwsEsZmLa0H/QescGb5ULRZTOvjGLtC', '0', '0', 0, '2021-11-14 19:45:52', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (40, 'cs3', '11', '18888888888', '0', '$2a$10$mq7Kqw6gFGntjCDCkrXsy.2CuvM1P5.AxtQxcfYQx2Os9eU.v8nc6', '0', '0', 0, '2021-11-14 19:48:27', NULL, NULL, '');

SET FOREIGN_KEY_CHECKS = 1;
