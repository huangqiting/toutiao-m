<template>
  <div class="article-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 
        :error.sync 为什么要用 .sync 修饰符？ 
          因为同一个组件标签，不能绑定多个 v-model，如果有多个数据需要双向绑定，那么可以通过 .sync 修饰符实现
          .sync 修饰符的语法是用来简化子组件的属性绑定和自定义事件监听的，事件名格式形如：update:属性名
          :error.sync="error" 简化前的代码，就等价于  :error="error" @update:error="error = $event"
          $event 是事件对象，在子传父时，可以在父组件的模板中通过 $event 获取子组件传过来的数据
          能用 .sync 修饰符，有两个前提：
            ① 子组件的事件名称必须是 “ update:属性名 ” 这种格式
            ② 父组件监听事件的处理函数的执行逻辑必须是单纯的将 子组件传过来的数据 赋值给 父组件绑定那个的数据变量，形如：“数据名 = $event”

        父组件的 error 数据，是专门用来控制是否显示错误提示消息的，当列表加载失败时（ajax请求失败），
        需要显示错误提示消息，van-list 组件又支持点击错误提示消息重新加载这个功能，
        所以需要让子组件更新父组件的 error 数据，不然，点击的时候，如果不将 error 改成 false，岂不是错误消息一直显示？
      -->
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="我是有底线的"
        @load="onLoad"
      >
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
let i = 6;
export default {
  name: "ArticleList",
  data() {
    return {
      error: false, // 是否加载失败，用来控制在底部是否显示错误提示消息
      list: [1, 2, 3, 4, 5], // 文章列表数据
      loading: false, // 列表是否加载完成
      finished: false, // 列表是否正在加载中，当van-list组件触发加载的时候，会自动将loading改成true并显示转圈圈(加载中...文案)
      refreshing: false, // 是否正在刷新
    };
  },
  methods: {
    // 列表加载事件，上拉快触底时，会触发该事件，去加载更多
    // 当你加载后，如列表没有铺满整屏，会继续触发onLoad,直到finished变为true，表示加载完成，才不会继续触发onLoad
    onLoad() {
      return new Promise((resolve, reject) => {
        console.log("onLoad,loading", this.loading);
        setTimeout(() => {
          resolve();
          this.loading = false; // 转圈圈不管成功还是失败，都要停止
          // 模拟请求失败
          if (Math.random() > 0.5) {
            this.error = true;
            return;
          }
          this.list.push(i++, i++, i++, i++, i++);
          // 如果列表长度已经大于等于20了(实际需要：当请求文章列表数据时，没有新的文章了，那么就证明所有文章已经完了)
          if (this.list.length >= 40) {
            // 表示加载完成了
            this.finished = true;
          }
        }, 2000);
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
  props: {
    channel: {
      type: Object, // 传过来的数据必须为对象
      required: true, // 必须传
    },
  },
};
</script>
<style scoped lang="less"></style>
