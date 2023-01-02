<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell v-for="item of list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResult } from "@/api/search";
export default {
  name: "SearchResult",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perPage: 20,
    };
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText,
        });
        // 2.将数据添加到列表
        const { results } = data.data;
        this.list.push(...results);
        // 3.设置加载状态结束
        this.loading = false;
        // 4.判断数据是否加载完毕
        if (results.length) {
          this.page++; // 更新获取下一页的数据页面
        } else {
          this.finished = true; // 没有数据了，将加载状态设置结束，不再onLoad
        }
      } catch (err) {
        console.log(err);
        this.error = true;
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
