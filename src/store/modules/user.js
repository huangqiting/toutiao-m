// 一次性导入该模块导出的所有内容，是一个对形式storage:{getItem,setItem,removeItem}
import * as storage from "@/utils/storage";
export default {
  namespaced: true,
  state: {
    token: storage.getItem("usertoken")
      ? storage.getItem("usertoken").token
      : null,
    refresh_token: storage.getItem("usertoken")
      ? storage.getItem("usertoken").refresh_token
      : null,
  },
  getters: {},
  mutations: {
    // userToken 包含 token和refresh_token
    changeUserToken(state, userToken) {
      if (userToken) {
        // 把返回的数据保存到本地存储
        // storage.setItem 是封装的 localStorage.setItem
        storage.setItem("usertoken", userToken);
        state.token = userToken.token;
      } else {
        state.token = null;
        storage.removeItem("usertoken");
      }
    },
  },
  actions: {},
};
