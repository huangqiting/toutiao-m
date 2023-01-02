// 新版的dayjs只能用 import * as xxx from "dayjs" 语法引入
import * as dayjs from "dayjs";
import Vue from "vue";
// 引入 相对时间 插件模块
import relativeTime from "dayjs/plugin/relativeTime";
// 引入中文语言包，注意：语言包不需要变量来接收，引入即可
import "dayjs/locale/zh-cn";
// 配置语言环境
dayjs.locale("zh-cn");
// 注册相对时间 这个插件
dayjs.extend(relativeTime);
// 注册全局过滤时间
Vue.filter("rtime", (data) => dayjs(data).fromNow());
export default dayjs;
