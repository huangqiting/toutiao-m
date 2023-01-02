<template>
  <div
    @click="
      $router.push({ name: 'article', params: { articleId: article.art_id } })
    "
    class="article_list_item"
  >
    <!-- 没有图片的结果 -->
    <template v-if="article.cover.type === 0">
      <div class="cover_type_0">
        <div class="title">{{ article.title }}</div>
        <div class="footer">
          <span v-if="article.is_top === 1" style="color: red">置顶</span>
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | rtime }}</span>
        </div>
      </div></template
    >
    <!-- 一张图片的结构 -->
    <template v-else-if="article.cover.type === 1">
      <div class="cover_type_1">
        <div class="left">
          <div class="title">{{ article.title }}</div>
          <div class="footer">
            <span v-if="article.is_top === 1" style="color: red">置顶</span>
            <span>{{ article.aut_name }}</span>
            <span>{{ article.comm_count }}评论</span>
            <span>{{ article.pubdate | rtime }}</span>
          </div>
        </div>
        <div>
          <van-image
            width="2.5rem"
            height="2.5rem"
            fit="cover"
            :src="article.cover.images[0]"
          />
        </div></div
    ></template>
    <!-- 三张图片的结构 -->
    <template v-else>
      <div class="cover_type_3">
        <div class="title">{{ article.title }}</div>
        <div class="images">
          <van-image
            v-for="(item, index) of article.cover.images"
            :key="index"
            width="2.5rem"
            height="2.5rem"
            fit="cover"
            :src="item"
          />
        </div>
        <div class="footer">
          <span v-if="article.is_top === 1" style="color: red">置顶</span>
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | rtime }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import dayjs from "@/plugins/dayjs";
export default {
  name: "ArticleListItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  // // 局部过滤器
  // filters: {
  //   // 一个过滤器其实就是一个函数
  //   rtime: (data) => dayjs(data).fromNow(),
  // },
};
</script>
<style scoped lang="less">
.article_list_item {
  padding: 20px;
  .cover_type_3 {
    .images {
      display: flex;
      margin-top: 20px;
      gap: 4px; //这个属性表示flex项之间的间隙，需设置给flex容器
      .van-image {
        flex: 1;
      }
    }
  }
  //   padding: 20px;
  .cover_type_1 {
    display: flex;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .footer {
        padding-bottom: 10px;
      }
    }
  }
  .cover_type_0,
  .cover_type_1,
  .cover_type_3 {
    .title {
      font-size: 35px;
    }
    .footer {
      font-size: 20px;
      color: #bdbbbb;
      span {
        &:nth-child(n + 2) {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
