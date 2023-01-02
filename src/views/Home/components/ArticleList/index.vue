<template>
  <div class="article-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="我是有底线的"
        @load="onLoad"
      >
        <ArticleListItem
          v-for="item of list"
          :key="item.art_id"
          :title="item.title"
          :article="item"
        ></ArticleListItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from "@/api/article";
import ArticleListItem from "../ArticleListItem";
export default {
  name: "ArticleList",
  components: {
    ArticleListItem,
  },
  props: {
    channel: {
      type: Object, // 传过来的数据必须为对象
      required: true, // 必须传
    },
  },
  data() {
    return {
      timestamp: Date.now(), //时间戳 默认系统当前事件
      error: false, // 是否加载失败，用来控制在底部是否显示错误提示消息
      list: [], // 文章列表数据
      loading: false, // 列表是否正在加载中，当van-list组件触发加载的时候，会自动将loading改成true并显示转圈圈(加载中...文案)
      finished: false, // 列表是否加载完成
      refreshing: false, // 是否正在刷新
    };
  },
  methods: {
    // 列表加载事件，上拉快触底时，会触发该事件，去加载更多
    // 当你加载后，如列表没有铺满整屏，会继续触发onLoad,直到finished变为true，表示加载完成，才不会继续触发onLoad
    onLoad() {
      // this.channel.id是父传过来的频道id
      return getArticles(this.channel.id, this.timestamp)
        .then((res) => {
          const { results, pre_timestamp } = res.data.data;
          // 模拟置顶手动将第六条和第七条置顶
          results[6].is_top = 1;
          results[7].is_top = 1;
          // 为啥不用this.list = results的方式？ 不能直接赋值，因为会覆盖上一次列表数据
          this.list.push(...results);
          // 处理置顶排序
          // sort 函数 是一个高阶函数，可以接收一个 函数 作为实参
          //  在这个实参函数上有两个形参（a 和 b），分别是每次两两比较的数组元素项
          //  这个实参函数的返回值 决定了 a 和 b 这两个数组元素最终的排序位置
          //     a - b 从小到大排序 反之b - a 从大到小
          //    如果返回值 > 0，把 a 放到 b 的后面去（把 b 放到 a 的前面去）
          //    如果返回值 = 0，a 和 b 位置不动
          //    如果返回值 < 0，把 a 放到 b 的前面去（把 b 方法 a 的后面去）
          this.list.sort((a, b) => b.is_top - a.is_top);
          this.timestamp = pre_timestamp;
          // 判断拿过来的数组是否有内容，如果没有，则在底部显示已加载完成
          // if (results.length === 0) this.finished = true;
          if (pre_timestamp === null) this.finished = true;
        })
        .catch((err) => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 下拉刷新后，触发该函数
    onRefresh() {
      this.list = []; // 先清空当前列表
      this.error = false; // 将错误消息隐藏
      this.finished = false; // 将已完成状态重置为false
      /*
       将van-list的加载中状态变成true，两个目的：
      ① 为了占个坑，撑开列表容器的高度，从而可以显示加载中转圈圈效果；
      ② 为了能够在加载完成后（this.loading = false）时，
        触发 van-list 是否铺满整屏的检查逻辑，因为 van-list 组件会监听 loading 数据的变化，
        自动检查是否铺满整屏，如果没有，会自动触发下一次的加载事件，如果上一次 loading 是false，
        那么此时不会触发，因为数据没变，监听不到数据的变化
       */
      this.loading = true;
      this.onLoad().then(() => {
        // 等加载完成后，将刷新改成false
        this.refreshing = false;
      });
    },
  },
};
</script>
<style scoped lang="less"></style>
