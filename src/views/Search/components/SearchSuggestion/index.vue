<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) of suggestion"
      @click="$emit('search', item)"
      :key="index"
      icon="search"
    >
      <template #title>
        <span v-html="highlightText(item)"></span>
      </template>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestion } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestion: [],
    };
  },
  watch: {
    searchText: {
      // 监听处理函数
      //   handler(newVal) {
      //     this.loadSearchSuggestion(newVal);
      //   },
      //加入lodash的防抖 debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(function (newVal) {
        this.loadSearchSuggestion(newVal);
      }, 500),
      // 受此监视触发
      immediate: true,
    },
  },
  methods: {
    async loadSearchSuggestion(q) {
      try {
        const { data } = await getSearchSuggestion(q);
        this.suggestion = data.data.options.filter((v) => !!v); // 处理数组内容为空
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
    // 匹配内容高亮
    highlightText(text) {
      const reg = new RegExp(`(${this.searchText})`, "gi");
      return text.replace(reg, `<span class="active">$1</span>`);
    },
  },
};
</script>
<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3196fa;
  }
}
</style>
