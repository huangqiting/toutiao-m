import axios from "axios";
import store from "@/store";
import jsonBig from "json-bigint";
import { refreshToken } from "@/api/user";
import { Toast } from "vant";
import router from "@/router";
const request = axios.create({
  baseURL: "http://toutiao.itheima.net",
  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function (data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data);
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data,
        };
      }
    },
  ],
});
// 所有的请求，在发出去之前，都会先进入请求拦截处理，处理完后才会真正发出去
// 第一个函数表示过来的config没问题
// 第二个函数表示config报错了
request.interceptors.request.use(
  // config表示发生请求时那个请求配置对象
  (config) => {
    // 登录之后有token才添加请求头
    if (store.state.user.token) {
      // 通过自定义属性判断是不是需要refresh_token
      if (config.isRefreshToken) {
        config.headers.Authorization = `Bearer ${store.state.user.refresh_token}`;
      } else {
        config.headers.Authorization = `Bearer ${store.state.user.token}`;
      }
    }
    // 一定要返回出去，不返回就会报错
    return config;
  },
  (err) => {
    return err;
  }
);
// 所有的请求相应成功后，会进入这个响应拦截器处理完，再进行实际请求位置的后续操作(.then)
request.interceptors.response.use(undefined, (err) => {
  console.log("err", err);
  // 判断是不是请求失败了
  if (err.response.status === 401) {
    // 给跳到登录页面一个动画
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    // 用刷新token请求新的token
    return refreshToken().then(
      // 成功之后的回调
      (res) => {
        // 刷新token请求新的token更新vuex里的token
        store.commit("user/changeUserToken", {
          token: res.data.data.token,
          refresh_token: store.state.user.refresh_token,
        });
        console.log("res", res);
        // err.config保存着上一个请求的信息
        // request重新执行那个请求 返回出去进行实际请求位置的后续操作(.then)
        return request(err.config);
      },
      // 失败之后的回调
      () => {
        // 刷新token也过期，就直接跳转登录页
        router.push({ name: "login" });
        Toast.fail("登录过期,请重新登录");
      }
    );
  }
  // 必须返回异常，否则不会进失败回调
  return Promise.reject(err);
});
export default request;
