<template>
  <van-icon
    @click="onLike"
    color="#777"
    :name="value === 1 ? 'good-job' : 'good-job-o'"
  />
</template>
<script>
import { addLike, delLike } from "@/api/article";
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleArtId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    async onLike() {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
      });
      try {
        // 取消点赞
        if (this.value === 1) {
          await delLike(this.articleArtId);
          this.$toast.success("取消点赞");
          this.$emit("input", 0);
        } else {
          // 点赞
          await addLike(this.articleArtId);
          this.$toast.success("点赞成功");
          this.$emit("input", 1);
        }
      } catch (err) {
        console.log(err);
        this.$toast.fail(err.response.data.message);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.van-icon.van-icon-good-job {
  color: #e5645f !important;
}
</style>
