<template>
  <div id="app">
    <router-view />
    <!-- 只有isHideTabbar为true的时候，才隐藏tabbar -->
    <van-tabbar v-model="active" v-if="!$route.meta.isHideTabbar">
      <van-tabbar-item icon="home-o">标签</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      active: 0,
    };
  },
  watch: {
    "$route.name"() {
      // 回去当前路由信息对象，不是路由器对象
      console.log(this.$route);
    },
  },
};
</script>
