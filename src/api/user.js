import request from "@/utils/request";
import store from "@/store";
export function getUserInfo() {
  return request({
    method: "GET",
    url: "/v1_0/user",
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`,
    // },
  });
}
export function sendCode(mobile) {
  return request({
    method: "GET",
    url: `/v1_0/sms/codes/${mobile}`,
  });
}

export function login(data) {
  return request({
    method: "POST",
    url: "/v1_0/authorizations",
    data,
  });
}
// 关注用户
export const addFollow = (userId) => {
  return request({
    method: "POST",
    url: "/v1_0/user/followings",
    data: {
      target: userId,
    },
  });
};
// 取消关注
export const deleteFollow = (userId) => {
  return request({
    method: "DELETE",
    url: `/v1_0/user/followings/${userId}`,
  });
};
// 刷新token
export const refreshToken = () => {
  return request({
    method: "PUT",
    url: "/v1_0/authorizations",
    isRefreshToken: true, // 不是axios带的配置，是我们自定义的
  });
};

// 获取用户信息
export const getUserProfile = () => {
  return request({
    method: "GET",
    url: "/v1_0/user/profile",
  });
};
// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    method: "PATCH",
    url: "/v1_0/user/profile",
    data,
  });
};
// 更新用户头像
export const updateUserHeadPortrait = (data) => {
  return request({
    method: "PATCH",
    url: "/v1_0/user/photo",
    data,
  });
};
