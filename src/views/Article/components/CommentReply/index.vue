<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <template #left>
        <van-icon name="cross" color="#248ffa" @click="$emit('click_close')" />
      </template>
    </van-nav-bar>
    <div class="scroll_wrap">
      <!-- /导航栏 -->
      <CommentItem :comment="comment" />
      <van-cell title="全部回复" />
      <!-- 评论的回复列表 -->
      <CommentList :list="list" :articleArtId="comment.com_id" type="c" />
    </div>

    <div class="footer_btn">
      <van-button
        @click="isPostShow = true"
        style="width: 60%"
        size="small"
        round
        type="default"
        >写评论</van-button
      >
    </div>
    <van-popup v-model="isPostShow" position="bottom">
      <!--  -->
      <CommentPost
        @onpost_success="onPostSuccess"
        :articleArtId_ComId="comment.com_id"
      />
    </van-popup>
  </div>
</template>
<script>
import CommentItem from "../CommentItem";
import CommentList from "../CommentList";
import CommentPost from "../CommentPost";
export default {
  name: "CommentReply",
  props: {
    // 评论对象
    comment: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isPostShow: false, // 控制弹出层
      list: [], // 评论回复列表
    };
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  methods: {
    onLoad() {},
    onPostSuccess(data) {
      // data是CommentPost组件传过来的评论回复对象
      // 更新回复的数量
      this.comment.reply_count++;
      // 关闭弹窗
      this.isPostShow = false;
      // 将最新回复的内容展示到列表的顶部
      this.list.unshift(data.new_obj);
    },
  },
};
</script>
<style lang="less" scoped>
.scroll_wrap {
  height: calc(100vh - 92px - 100px);
  overflow-y: auto;
}
.footer_btn {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  height: 100px;
}
</style>
