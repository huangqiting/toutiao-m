<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button
        :class="{ finish_btn: isEdit }"
        @click="onClickChangeBtn"
        size="mini"
        round
        type="danger"
        plain
        >&nbsp;&nbsp;{{ isEdit ? "完成" : "编辑" }}&nbsp;&nbsp;</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <!-- 
        补充说明：
          1. 自定义组件指的是 所有的 非原生标签，包括第三方 UI 组件库的 组件 也是自定义组件，只不过，是别人定义的
          2. 在自定义组件身上绑定的所有事件，都属于组件的自定义事件，别看名字长得像原生事件，比如（@click、@keyup、@change），除非加了.native修饰符，才表示监听的是原生事件，比如（@click.native、@keyup.native、@change.native）
          3. 基于上述第2点，所以，不是所有自定义组件都能监听类似于（@click、@keyup、@change）的，能监听的前提条件是：该组件内部通过$emit('click||keyup||change') 触发了该自定义事件
      -->
      <van-grid-item
        class="channel-item"
        v-for="(value, index) of myChannels"
        :key="value.id"
        @click="updateActiveIndex(index)"
      >
        <template #text>
          <span class="text" :class="{ active: index === activeChangeIndex }">{{
            value.name
          }}</span>
        </template>
        <template #icon>
          <!-- 推荐不显示删除图标 -->
          <van-icon v-show="isEdit && index !== 0" name="close" />
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false"></van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="channel-item"
        v-for="value of recommendChannels"
        :key="value.id"
        :text="value.name"
        icon="plus"
        @click="addChannel(value)"
      />
    </van-grid>
  </div>
</template>
<script>
import { getAllChannel, setUserChannel } from "@/api/channel";
import { setItem } from "@/utils/storage";
export default {
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    activeChangeIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isEdit: false, // 是否编辑状态
      allChannels: [], // 所有频道列表
    };
  },
  methods: {
    onClickChangeBtn() {
      if (this.isEdit) {
        if (this.$store.state.user.token) {
          const channels = this.myChannels.map((item, index) => {
            return {
              id: item.id,
              seq: index + 1,
            };
          });
          // 发出请求之前，开启加载中转圈圈
          this.$toast.loading({
            message: "更新中...",
            duration: 0,
            forbidClick: true,
          });
          setUserChannel(channels).then(
            () => {
              this.isEdit = false;
              this.$toast.success("更新成功"); // 请求成功后，给出成功提示
            },
            (err) => {
              this.$toast.fail(err.response.data.message); // 获取后端返回的错误消息，提示出来
            }
          );
        } else {
          this.isEdit = false;
          setItem("user_channels", this.myChannels);
          this.$toast.success("更新成功"); // 请求成功后，给出成功提示
        }
      } else {
        this.isEdit = true;
      }
    },
    updateActiveIndex(index) {
      if (this.isEdit) {
        this.$emit("removeIndex", index);
      } else {
        this.$emit("update:changeActiveIndex", index);
      }
    },
    addChannel(value) {
      if (this.isEdit) {
        this.$emit("addChannel", value);
      }
    },
  },
  async created() {
    const res = await getAllChannel();
    this.allChannels = res.data.data.channels;
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((v) => {
        return !this.myChannels.some((v2) => v2.id === v.id);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.channel-edit {
  .finish_btn {
    background-color: #ee0a24;
    color: white;
  }
  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 36px;
    color: #ccc;
  }

  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      .van-icon {
        font-size: 24px;
      }

      .van-grid-item__text {
        font-size: 24px;
        margin-top: 0;
      }
    }
  }

  .channel-item {
    height: 86px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__icon-wrapper {
        position: unset;
      }
      .text {
        color: #222;
        font-size: 24px;
      }
      .active {
        color: red;
      }
    }
  }
}
</style>
