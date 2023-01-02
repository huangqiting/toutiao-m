<template>
  <!-- 弹出层 -->
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button :disabled="!message.length" @click="onPost" class="post-btn"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
  props: {
    articleArtId_ComId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 依赖注入接收的值 用法相当于props
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async onPost() {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "发布中...",
        forbidClick: true, // 是否禁止背景点击
      });
      try {
        const { data } = await addComment({
          target: this.articleArtId_ComId, // 评论的目标id,id可以为文章id或评论的id
          content: this.message, // 评论的内容
          art_id: this.articleId, // 文章id,对评论回复需要此参数值, 代表所属文章id, 对文章评论无需此参数
        });
        this.$toast.success("发布成功");
        this.$emit("onpost_success", data.data);
      } catch (err) {
        this.$toast.fail(err.response.data.message);
        console.log(err);
      }
      this.message = "";
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
