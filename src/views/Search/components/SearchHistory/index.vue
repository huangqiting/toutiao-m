<template>
  <div class="search-history">
    <van-cell title="历史记录">
      <template v-if="isDeleteShow">
        <span @click="searchHistories.splice(0)">全部删除</span>
        &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </template>
      <van-icon @click="isDeleteShow = true" v-else name="delete" />
    </van-cell>
    <van-cell
      v-for="(item, index) of searchHistories"
      :key="index"
      :title="item"
      @click="onHistoryClick(item, index)"
    >
      <van-icon
        @click="searchHistories.splice(index, 1)"
        v-show="isDeleteShow"
        name="close"
      />
    </van-cell>
  </div>
</template>
<script>
export default {
  name: "SearchHistory",
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleteShow: false,
    };
  },
  methods: {
    onHistoryClick(item, index) {
      // 如果是删除状态则执行删除操作
      if (this.isDeleteShow) {
        searchHistories.splice(index, 1);
      } else {
        // 否则执行搜索操作
        this.$emit("search", item);
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
