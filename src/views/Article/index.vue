<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | rtime }}
          </div>
          <FollowUser :article="article" />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          ref="contentRef"
          v-html="article.content"
          class="article-content markdown-body"
        ></div>
        <van-divider>正文结束</van-divider>
        <ArticleComment
          :list="commentList"
          @onload_success="totalCount = $event.total_count"
          :articleArtId="article.art_id"
          @click_reply="onReplyClick"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            @click="isPostShow = !isPostShow"
            class="comment-btn"
            type="default"
            round
            size="small"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="totalCount" color="#777" />
          <CollectArticle
            :articleArtId="article.art_id"
            v-model="article.is_collected"
          />
          <LikeArticle
            :articleArtId="article.art_id"
            v-model="article.attitude"
          />

          <van-icon name="share" color="#777777"></van-icon>
          <van-popup v-model="isPostShow" position="bottom"
            ><CommentPost
              @onpost_success="onPostSuccess"
              :articleArtId_ComId="article.art_id"
          /></van-popup>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle()" class="retry-btn"
          >点击重试</van-button
        >
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
      <CommentReply
        v-if="isReplyShow"
        @click_close="isReplyShow = false"
        :comment="currentComment"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>
<script>
import { getArticleById } from "@/api/article";
import dayjs from "@/plugins/dayjs";
import "./github-markdown.css";
import { ImagePreview } from "vant";
import FollowUser from "@/components/FollowUser";
import CollectArticle from "@/components/CollectArticle";
import LikeArticle from "@/components/LikeArticle";
import ArticleComment from "./components/ArticleComment";
import CommentPost from "./components/CommentPost";
import CommentReply from "./components/CommentReply";
export default {
  name: "ArticleIndex",
  props: {
    // 这是vue路由开启props传参，params传过来的id
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 依赖注入 用法相当于data
  // 不能滥用 用于祖先组件 需要传值给多个子组件
  provide() {
    return {
      articleId: this.articleId,
    };
  },
  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 转圈圈加载状态
      errStatus: null,
      totalCount: 0, // 总数据条数
      isPostShow: false, //控制弹出层
      commentList: [], // 评论数组
      isReplyShow: false, // 控制回复弹层
      currentComment: {}, // 点击回复的那个评论对象
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        // 随机错误
        // if (Math.random() > 0.5) {
        //   JSON.parse("adasdacw");
        // }
        const { data } = await getArticleById(this.articleId);
        // console.log(data);
        this.article = data.data;
        // 数据加载完成
        setTimeout(() => {
          this.previewImg();
        }, 0);
        // this.$nextTick(() => {
        //   this.previewImg();
        // });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        console.log(err);
      }
      this.loading = false;
    },
    // 图片预览
    previewImg() {
      // 获取内容的dom节点
      const contentEl = this.$refs.contentRef;
      // 获取dom节点所有的图片
      const allImg = contentEl.querySelectorAll("img");
      const images = [];
      allImg.forEach((item, index) => {
        images.push(item.src);
        // 点击图片打开预览
        item.onclick = () => {
          ImagePreview({
            // images: [
            //   "https://img01.yzcdn.cn/vant/apple-1.jpg",
            //   "https://img01.yzcdn.cn/vant/apple-2.jpg",
            // ],
            images,
            startPosition: index,
          });
        };
      });
    },
    // 发布评论
    onPostSuccess(data) {
      this.commentList.unshift(data.new_obj);
      this.isPostShow = false;
    },
    // 评论回复
    onReplyClick(comment) {
      this.currentComment = comment;
      // 显示评论回复弹出层
      this.isReplyShow = true;
    },
  },
  // 局部过滤器
  // filters: {
  //   // 一个过滤器其实就是一个函数
  //   rtime: (data) => dayjs(data).fromNow(),
  // },
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    ArticleComment,
    CommentPost,
    CommentReply,
  },
};
</script>
<style lang="less" scoped>
.article-container {
  /deep/ .van-nav-bar .van-icon {
    color: white;
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
