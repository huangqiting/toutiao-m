import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    // 全部以name的方式跳转路由`
    name: "login",
    path: "/login",
    // 路由懒加载，当你访问这个/login路由页面时，才去加载对应的页面组件
    component: () => import("@/views/Login/index.vue"),
    // 路由元数据，专门用来放路由相关的数据
    meta: {
      isHideTabbar: true,
    },
  },
  {
    name: "search",
    path: "/search",
    component: () => import("@/views/Search"),
  },
  {
    name: "article",
    path: "/article/:articleId",
    component: () => import("@/views/Article"),
    // 开启props传参，就是把路由参数映射到组件里
    props: true,
  },
  {
    // name: "layout",
    path: "/",
    component: () => import("@/views/Layout"),
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("@/views/Home/index.vue"),
      },
      {
        name: "my",
        path: "/my",
        component: () => import("@/views/My/index.vue"),
      },
      {
        name: "qa",
        path: "/qa",
        component: () => import("@/views/QA/index.vue"),
      },
      {
        name: "video",
        path: "/video",
        component: () => import("@/views/Video/index.vue"),
      },
    ],
  },
  // 跳转修改用户信息的页面
  {
    name: "user_profile",
    path: "/user/profile",
    component: () => import("@/views/UserProfile"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
