# 建立数据

在 云服务器后台通过用户名和密码链接 mysql 控制台。

使用下面的 sql 建库。

验证是否建立成功

show databases;

# 初始化数据库

mysql -u root -p

输入mysql 密码

执行建库语句

CREATE DATABASE `capofpro` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT
ENCRYPTION='N' */

执行测试用例来初始化数据库

cd /root/projects/doctalks.ai/

建表/更新表结构
npx mocha devops/devops.test.js --grep "update_table_schema"

# 更新及启动服务

cd /root/projects/doctalks.ai/

tmux ls

如果结果里面没有有 xeye 的话 new -s 一个。

tmux new -s doctalks

进入到 xeye 会话
tmux a -t doctalks

--------
cat /root/projects/devops/doctalks.env
export ENV_FILE_PATH="/root/projects/devops/doctalks.env"
echo $ENV_FILE_PATH
--------
ENV_FILE_PATH=/root/projects/devops/doctalks.env npm run dev
--------

退出 xeye 会话（在会话界面执行）

ctrl + b d

关闭 xeye 会话（在会话界面执行）

ctrl + d

# 常用 devops 脚本

建表/更新表结构
npx mocha devops/devops.test.js --grep "update_table_schema" --timeout 100000

删除表并重建
npx mocha devops/devops.test.js --grep "drop_and_recreate" --timeout 100000