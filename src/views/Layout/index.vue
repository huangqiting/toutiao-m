<template>
  <div id="app">
    <router-view />
    <!-- 只有isHideTabbar为true的时候，才隐藏tabbar -->
    <van-tabbar route v-model="active">
      <van-tabbar-item :to="{ name: 'home' }" icon="home-o"
        >首页</van-tabbar-item
      >
      <van-tabbar-item :to="{ name: 'qa' }" icon="comment-o"
        >问答</van-tabbar-item
      >
      <van-tabbar-item :to="{ name: 'video' }" icon="video-o"
        >视频</van-tabbar-item
      >
      <van-tabbar-item :to="{ name: 'my' }" icon="user-o">我的</van-tabbar-item>
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
};
</script>
