# 小程序用户端

appId: wx023da9ff4aea096f 

主题色 #E95555

## 配置底部tabBar

爱心小屋 向高一号楼一楼理发店旁

首页轮播图 1600*900

安装uView



用户表

| **字段名称** | **字段类型** | **约束**               | **说明**               |
| ------------ | ------------ | ---------------------- | ---------------------- |
| user_id      | int          | 主键                   | 用户id                 |
| openid       | varchar(255) | 非空                   | 微信小程序用户唯一标识 |
| username     | varchar(50)  |                        | 姓名                   |
| grade        | varchar(50)  |                        | 年级专业               |
| phone        | varchar(15)  |                        | 手机号                 |
| create_time  | timestamp    | 非空 CURRENT_TIMESTAMP | 注册时间               |



物品类别表

| **字段名称** | **字段类型** | **约束** | **说明**   |
| ------------ | ------------ | -------- | ---------- |
| category_id  | tinyint      | 主键     | 物品类别id |
| name         | varchar(50)  | 非空     | 类别名称   |

物品表

| **字段名称** | **字段类型** | **约束**  | **说明** |
| ------------ | ------------ | --------- | -------- |
| item_id      | int          | 主键      | 物品id   |
| name         | VARCHAR(255) | 非空      | 物品名称 |
| number       | tinyint      | 非空      | 物品数量 |
| category_id  | tinyint      | 外键 非空 | 物品类别 |
| picture      | varchar(255) |           |          |

记录表

| **字段名称** | **字段类型** | **约束**  | **说明**             |
| ------------ | ------------ | --------- | -------------------- |
| record_id    | int          | 主键      | 记录id               |
| item_id      | int          | 外键 非空 | 物品id               |
| user_id      | int          | 外键 非空 | 用户id               |
| picture      | varchar(255) | 非空      | 拍照                 |
| create_time  | timestamp    | 非空      | 时间                 |
| number       | tinyint      | 非空      | 数量                 |
| type         | tinyint      |           | 类型 0：捐赠 1：领取 |



jwt

登陆流程

1. 判断是否存在token 
2. 不存在 进行无感登陆 login获取code、后台解析获取openid
3. 判断数据库是否有该用户
4. 有 返回token和用户信息
5. 不存在则注册
6. 再 返回token和用户信息

如果token失效 ，401，则再进行登陆流程



并发未处理

比如同时领取
