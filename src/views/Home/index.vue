<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        :to="{ name: 'search' }"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- swipe-threshold 	滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动 	number | string 	5 -->
    <!-- v-model="activeChannelIndex" 会自动判断有效索引值，如果超出有效索引范围，自动重置为0 -->
    <van-tabs
      class="channel-tabs"
      v-model="activeChangeIndex"
      animated
      swipeable
      :swipe-threshold="2"
    >
      <van-tab v-for="item of channels" :key="item.id" :title="item.name">
        <div class="article_list_box">
          <ArticleList :channel="item" />
        </div>
        <!-- <div class="pb100"></div> -->
      </van-tab>
      <template #nav-right>
        <div class="placeholder"></div>
        <div @click="isChannelEditShow = true" class="hamburger-btn">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
      </template>
    </van-tabs>
    <!-- /导航栏 -->
    <!-- 频道编辑 -->
    <van-popup
      round
      class="edit-channel-popup"
      :value="isChannelEditShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      @click-close-icon="clickClose"
      close-icon-position="top-left"
      ><ChannelEdit
        ref="refChannelEdit"
        :myChannels="channels"
        :activeChangeIndex="activeChangeIndex"
        @update:changeActiveIndex="changeActiveIndex"
        @removeIndex="removeChannelsIndex"
        @addChannel="addChannel"
    /></van-popup>
    <!-- /频道编辑 -->
  </div>
</template>
<script>
import { getUserChannel } from "@/api/channel";
import ArticleList from "./components/ArticleList";
import ChannelEdit from "../Home/components/ChannelEdit";
import { getItem, setItem } from "@/utils/storage";
export default {
  name: "HomePage",
  data() {
    return {
      channels: [], // 我的频道列表
      isChannelEditShow: false,
      activeChangeIndex: 0, // 当前激活的频道索引
    };
  },
  methods: {
    clickClose() {
      if (this.$refs.refChannelEdit.isEdit) {
        this.$dialog
          .confirm({
            title: "您编辑尚未保存,确定要退出吗",
          })
          .then(() => {
            if (this.$store.state.user.token) {
              return this.getUserChannel();
            } else {
              this.channels = getItem("user_channels");
            }
          })
          .then(() => {
            // 将编辑状态改成非编辑状态（是否是编辑状态这个数据在 ChannelEdit 子组件中，所以需要通过 ref 来先获取到子组件实例）
            this.$refs.refChannelEdit.isEdit = false;
            this.isChannelEditShow = false; // 关闭弹层（应该等待请求完成后 再关）
          });
      } else {
        this.isChannelEditShow = false; // 关闭弹层
      }
    },
    changeActiveIndex(index) {
      this.activeChangeIndex = index;
    },
    removeChannelsIndex(index) {
      // 不能删除推荐
      if (index === 0) return;
      // 如果删除的是激活频道前的频道，那么激活频道的索引要-1
      if (index < this.activeChangeIndex) this.activeChangeIndex -= 1;
      // 如果删除的就是激活频道，那么激活频道的索引要-1（废弃） 或者 直接将激活的频道索引设置成第一个推荐频道0 （用这个）
      else if (index === this.activeChangeIndex) this.activeChangeIndex = 0;
      this.channels.splice(index, 1);
    },
    addChannel(value) {
      this.channels.push(value);
    },
    getUserChannel() {
      return getUserChannel()
        .then((res) => {
          this.channels = res.data.data.channels;
        })
        .catch((err) => {
          this.$toast.fail("获取频道列表数据失败");
        });
    },
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  created() {
    // 加载我的频道时，也要看有没有登录
    // 如果登录了，就调用后端接口
    if (this.$store.state.user.token) {
      this.getUserChannel();
    } else {
      this.channels = getItem("user_channels");
      // 如果本地存储中没有，那还是要掉调后端接口，获取默认的游客频道列表
      if (!this.channels) {
        this.getUserChannel().then(() => {
          // 获取完后，要将其存储到本地中，以免下次进来，本地存储没有数据
          setItem("user_channels", this.channels);
        });
      }
    }
  },
};
</script>
<style scoped lang="less">
.home-container {
  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
  .article_list_box {
    height: calc(100vh - 92px - 88px - 100px);
    overflow-y: auto;
  }
  .pb100 {
    padding-bottom: 100px;
  }

  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }

  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &::before {
      content: "";
      position: absolute;
      left: 0;
      width: 2px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }

  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
    }

    .van-tab--active .van-tab__text {
      color: #333 !important;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
  }
}
</style>
