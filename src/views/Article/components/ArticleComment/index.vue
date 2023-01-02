<template>
  <!-- 评论区域 -->
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem
        v-for="(item, index) of list"
        :key="index"
        :comment="item"
        :title="item.content"
        @click_reply="$emit('click_reply', $event)"
      ></CommentItem>
    </van-list>
  </div>
</template>
<script>
import { getArticleComment } from "@/api/comment";
import CommentItem from "../CommentItem";
export default {
  name: "ArticleComment",
  props: {
    articleArtId: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false, //是否加载中
      finished: false, // 是否加载完成
      offset: null, // 请求下一页的数据的页码
    };
  },
  methods: {
    async onLoad() {
      // 1.请求获取数据
      const { data } = await getArticleComment({
        // 评论类型, 只能是'a'或'c', 'a'代表对文章的评论列表, 'c'代表对评论的回复列表
        type: "a",
        // 文章id或评论id, 如果type为'a'这里传递文章id, 如果type为'c'这里传评论id
        source: this.articleArtId,
        // 偏移量id(评论id), 值为评论id, 偏移量, 表示告诉后台从此id往后返回数据给前端, 做加载更多效果
        offset: this.offset,
        // 获取评论数量, 不传, 默认后台返回10条
        limit: 10,
      });
      // console.log(data);
      this.$emit("onload_success", data.data);
      // 2.将数据添加到列表中
      const { results } = data.data;
      this.list.push(...results);
      // 3.将加载更多的loading设置为false
      this.loading = false;
      // 4.判断是否还有数据
      if (results.length) {
        // 获取下一页的页面
        this.offset = data.data.last_id;
      } else {
        this.finished = true;
      }
    },
  },
  created() {
    this.onLoad();
  },
  components: {
    CommentItem,
  },
};
</script>
<style lang="less" scoped></style>
