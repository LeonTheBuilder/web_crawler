# 安装依赖
PUPPETEER_SKIP_DOWNLOAD=true npm install
PUPPETEER_SKIP_DOWNLOAD=true npm update aframework
PUPPETEER_SKIP_DOWNLOAD=true npm update user_service
PUPPETEER_SKIP_DOWNLOAD=true npm update ai_service
PUPPETEER_SKIP_DOWNLOAD=true npm update message_service
npm run dev

ENV_FILE_PATH=/Users/chence/dev/devops/doctalks.env npm run dev
ENV_FILE_PATH=/Users/chence/dev/devops/doctalks.env npm run dev


# 设计
## 数据获取

数据获取采用能见到就抓取的原则，尽可能获取可见的全量数据。

数据的类型包括：交易数据、新闻数据。

对于多个网站存在相同数据（比如都有股票列表、股票基础信息）的处理原则：同一种数据可以有多个抓取器，但是同一时间只使用（生效）一个，避免重复抓取。

对于数据没有唯一标识（比如大宗交易列表，就无法确定一条数据是否重复抓取了）的处理原则：采用静止原则，等待数据静止了在抓取。比如15点之后大单交易列表就静止了，或者14点之后抓取14点之前的数据。同一份数据只抓取一次，如果重新抓取就将原有数据删除。


最小路径原则：就是按照一定的顺序打开页面，尝试打开最少的页面获取最多的数据。比如股票列表页是一个可以 loop 的页面，列表每一项都可以进入到股票明细页，而股票明细页可以获得大宗交易、融资融券、十大持股等信息。


