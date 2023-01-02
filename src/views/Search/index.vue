<template>
  <div>
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3196fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 搜索结果 -->
      <div class="search_result_box" v-if="isResultShow">
        <SearchResult :searchText="searchText" />
      </div>
      <!-- 联想建议 -->
      <SearchSuggestion
        @search="onSearch"
        :searchText="searchText"
        v-else-if="searchText"
      />
      <!-- 历史记录 -->
      <SearchHistory
        @search="onSearch"
        :searchHistories="searchHistories"
        v-else
      />
    </form>
  </div>
</template>
<script>
import { getItem, setItem } from "@/utils/storage";
import SearchHistory from "./components/SearchHistory";
import SearchResult from "./components/SearchResult";
import SearchSuggestion from "./components/SearchSuggestion";
export default {
  data() {
    return {
      searchText: "",
      isResultShow: false,
      searchHistories: getItem("search_histories") || [],
    };
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion,
  },

  methods: {
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val;
      // 存储搜索历史记录
      // 要求，不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);
      // 渲染搜索结果
      this.isResultShow = true;
    },
    onCancel() {
      this.$router.back();
    },
  },
  watch: {
    searchHistories(val) {
      // 同步到本地存储
      setItem("search_histories", val);
    },
  },
};
</script>
<style lang="less" scoped>
.search_result_box {
  height: calc(100vh - 108px);
  overflow-y: auto;
}
.van-search {
  .van-search__action {
    color: #fff;
  }
}
</style>
