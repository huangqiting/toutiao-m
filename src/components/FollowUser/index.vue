<template>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    v-if="article.is_followed"
    :loading="isFollowLoading"
    >关注</van-button
  >
  <van-button
    :loading="isFollowLoading"
    v-else
    @click="onFollow"
    class="follow-btn"
    round
    size="small"
    >已关注</van-button
  >
</template>
<script>
import { addFollow, deleteFollow } from "@/api/user";
export default {
  name: "FollowUser",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFollowLoading: false,
    };
  },
  methods: {
    // 关注用户
    async onFollow() {
      // 开启按钮的loading状态
      this.isFollowLoading = true;
      try {
        // 如果关注，则取消关注
        if (this.article.is_followed) {
          await deleteFollow(this.article.aut_id);
        } else {
          await addFollow(this.article.aut_id);
        }
        // 更新视图
        this.article.is_followed = !this.article.is_followed;
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败");
      }
      // 关闭按钮的loading状态
      this.isFollowLoading = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
