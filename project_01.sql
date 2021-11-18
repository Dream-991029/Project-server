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

 Date: 18/11/2021 02:25:46
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
  PRIMARY KEY (`user_id`) USING BTREE,
  FULLTEXT INDEX `ft_user_name`(`user_name`) WITH PARSER `ngram`
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'admin', '00', '15888888888', '0', '$2a$10$0IiwuIgV/qGglLIaKvh15uZDmp6Ele8nxR7OL2DJRReYV0MA.09Zm', '0', '0', 1, '2021-11-15 16:15:23', NULL, NULL, '管理员');
INSERT INTO `sys_user` VALUES (2, 'dream', '11', '19888888888', '2', '$2a$10$0IiwuIgV/qGglLIaKvh15uZDmp6Ele8nxR7OL2DJRReYV0MA.09Zm', '0', '0', 2, '2021-11-16 01:16:21', NULL, NULL, 'dream');
INSERT INTO `sys_user` VALUES (3, 'cs1', '11', '19888888888', '0', '$2a$10$Nhy28Bnd4uZ7K1ro9OsFW.c3Bp9OnAJ.mIVbLppCla3K7oK9Gs0PO', '0', '2', 3, '2021-11-16 01:16:56', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (4, 'km1', '00', '13585664151', '0', '$2a$10$GbICwir0NJ49lcMXhmz6cepqCc/Iw5UmDjFPgGAaXUm0C81GCiw7y', '0', '0', 4, '2021-11-18 02:07:15', NULL, NULL, '123124第三方撒发送到');
INSERT INTO `sys_user` VALUES (5, 'cs2', '11', '19888888888', '1', '$2a$10$Pr678UQ40VV2jv6rcHSNKOD8ukvWLsEmT7EJ452uAFenPXtlKQFUq', '0', '0', 5, '2021-11-16 01:17:28', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (6, 'dm1', '00', '13321312132', '0', '$2a$10$iqWoU7UJ3vyAe9uci4Iq7upKHDHssqoNNJZ.DUEA.juGtycsU/mgu', '1', '0', 6, '2021-11-16 01:17:53', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (7, 'root1', '00', '16899999999', '2', '$2a$10$UZUX7QAuHuwRXDD2K7C7hOdtif5RhHJJPowvlNs38Dw.zAFflhRxy', '0', '0', 7, '2021-11-16 01:18:22', 1, '2021-11-17 18:05:56', 'root用户');
INSERT INTO `sys_user` VALUES (8, 'wanggang1', '11', '19999999999', '1', '$2a$10$iVHftZstfYTvCU2r3ujBleAVedwUUmYS3nFyMhLSHkbNOU.AwOdga', '0', '0', 8, '2021-11-17 23:54:58', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (9, 'xiaoming1', '11', '19999999999', '0', '$2a$10$MAWXiuO6RlKx16pqRaNmTOQrK.GybcSof5Vi1l/2HfQHSdeXE.WUS', '1', '0', 9, '2021-11-17 23:55:18', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (10, 'wangwu1', '11', '19999999998', '0', '$2a$10$gjUnkGv4MPUHpFyGAgowdeecGmNIfj9/we1/jT1Uux1ygT0OfeWtu', '0', '0', 10, '2021-11-17 23:55:42', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (11, 'lisi11', '11', '18888888888', '1', '$2a$10$VlBbMrEFYKsMXkr7L0HEceF8tYLDhuBXsemGfgrP11GUwhf1f7jSq', '0', '0', 11, '2021-11-17 23:56:01', 2, '2021-11-17 13:06:25', '');
INSERT INTO `sys_user` VALUES (12, 'nvjing1', '00', '19999999999', '1', '$2a$10$2RE6Fj5owqDvxvzSBC0iwuu0cuQJ0PUao6w8P.b4hBzbMF.zbIIlu', '0', '0', 12, '2021-11-17 23:56:26', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (13, 'nuoshou1', '00', '19999999999', '2', '$2a$10$V5HXMNXryEWM1oCbOkFBlOV4f04IFIWYnnUc2qii6RZlh3JBBSml.', '1', '0', 13, '2021-11-17 23:56:37', NULL, NULL, '');
INSERT INTO `sys_user` VALUES (14, 'dema1', '00', '13595515151', '0', '$2a$10$QMekQaALD7y/1GcYD3oE4eD4rekC3vf5fMCIs4OjXybojXnau/0i6', '0', '0', 14, '2021-11-17 23:57:11', 2, '2021-11-16 19:06:39', '');
INSERT INTO `sys_user` VALUES (15, 'yasuo1', '11', '14521611351', '0', '$2a$10$D3wB9G1ZwohlaNRL/kjf4.rEZXL5yZPNHq7wFaEtgRES6Pkud1bLC', '0', '0', 15, '2021-11-17 23:57:35', NULL, NULL, '');

-- ----------------------------
-- Table structure for sys_user_sex
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_sex`;
CREATE TABLE `sys_user_sex`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `sex_id` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  `sex` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `gender`(`sex`) USING BTREE,
  INDEX `gender_2`(`sex`, `sex_id`) USING BTREE,
  INDEX `sex_id`(`sex_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_sex
-- ----------------------------
INSERT INTO `sys_user_sex` VALUES (2, '1', '女');
INSERT INTO `sys_user_sex` VALUES (3, '2', '未知');
INSERT INTO `sys_user_sex` VALUES (1, '0', '男');

-- ----------------------------
-- Table structure for sys_user_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_type`;
CREATE TABLE `sys_user_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_type_id` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_type
-- ----------------------------
INSERT INTO `sys_user_type` VALUES (1, '00', '系统用户');
INSERT INTO `sys_user_type` VALUES (2, '11', '普通用户');

SET FOREIGN_KEY_CHECKS = 1;
