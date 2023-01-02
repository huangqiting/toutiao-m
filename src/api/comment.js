import request from "@/utils/request";
// 获取评论列表
export const getArticleComment = (params) => {
  return request({
    method: "GET",
    url: "/v1_0/comments",
    params,
  });
};
// 点赞评论
export const addCommentLike = (target) => {
  return request({
    method: "POST",
    url: "/v1_0/comment/likings",
    data: {
      target,
    },
  });
};
// 取消点赞
export const delCommentLike = (target) => {
  return request({
    method: "DELETE",
    url: `/v1_0/comment/likings/${target}`,
  });
};
// 添加评论或评论回复
export const addComment = (data) => {
  return request({
    method: "POST",
    url: "/v1_0/comments",
    data,
  });
};
