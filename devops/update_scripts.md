# 建表/更新表结构

npx mocha devops/devops.test.js --grep "update_table_schema"

# 删所有表除表

npx mocha devops/devops.test.js --grep "drop_table_schema"

# 下载或者更新 x3 KOL 数据

npx mocha devops/devops.test.js --grep "startCrawlX3Users"

# 导入 x3 数据到 Twitter user

npx mocha devops/devops.test.js --grep "importX3UsersToTwitterUser"
