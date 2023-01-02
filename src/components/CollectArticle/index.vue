<template>
  <van-icon
    color="#777"
    @click="onCollect"
    :class="{ collect_color: value }"
    :loading="loading"
    :name="value ? 'star' : 'star-o'"
  />
</template>
<script>
import { addCollect, delCollect } from "@/api/article";
export default {
  name: "CollectArticle",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    articleArtId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        if (this.value) {
          await delCollect(this.articleArtId);
        } else {
          await addCollect(this.articleArtId);
        }
        // 提示用户
        this.$toast.success(this.value ? "取消收藏" : "收藏成功");
        // 更新视图
        this.$emit("input", !this.value);
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
  },
};
</script>
<style lang="less" scoped>
.collect_color.van-icon-star {
  color: #ffa400 !important;
}
</style>
