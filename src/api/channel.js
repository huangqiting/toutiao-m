import request from "@/utils/request";
export const setUserChannel = (channels) =>
  request({ method: "PUT", url: "/v1_0/user/channels", data: { channels } });
export const getUserChannel = () =>
  request({ method: "GET", url: "/v1_0/user/channels" });
export const getAllChannel = () =>
  request({ method: "GET", url: "/v1_0/channels" });
