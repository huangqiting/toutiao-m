<template>
  <div class="my-container">
    <div class="header">
      <div v-if="!$store.state.user.token" class="notlogin">
        <img
          class="mobile-img"
          src="~@/assets/mobile.png"
          @click="$router.push({ name: 'login' })"
        />
        <div class="text">登录 / 注册</div>
      </div>
      <div v-else class="logined">
        <div class="c1">
          <div class="c1_1">
            <div>
              <van-image
                round
                fit="cover"
                width="1.5rem"
                height="1.5rem"
                :src="userInfo.photo"
              />
            </div>
            <div>{{ userInfo.name }}</div>
          </div>
          <div class="c1_2">
            <!-- :to="{ name: 'user_profile' }" -->
            <van-button
              @click="$router.push({ name: 'user_profile' })"
              round
              size="mini"
              type="default"
              >&nbsp;&nbsp;编辑资料&nbsp;&nbsp;</van-button
            >
          </div>
        </div>
        <div class="c2">
          <div class="c2_1">
            <div>{{ userInfo.art_count }}</div>
            <div>头条</div>
          </div>
          <div class="c2_1">
            <div>{{ userInfo.follow_count }}</div>
            <div>关注</div>
          </div>
          <div class="c2_1">
            <div>{{ userInfo.fans_count }}</div>
            <div>粉丝</div>
          </div>
          <div class="c2_1">
            <div>{{ userInfo.like_count }}</div>
            <div>获赞</div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-nav">
      <van-grid clickable :column-num="2">
        <van-grid-item>
          <template #icon>
            <van-icon color="#ee7374" size="28px" name="star-o" />
          </template>
          <template #text><div class="text">收 藏</div></template>
        </van-grid-item>
        <van-grid-item
          ><template #icon>
            <van-icon color="#ffb85f" size="28px" name="underway-o" />
          </template>
          <template #text
            ><div class="text">历 史</div></template
          ></van-grid-item
        >
      </van-grid>
    </div>
    <van-cell title="消息通知" is-link url="" />
    <van-cell title="实名认证" is-link url="" />
    <van-cell title="用户反馈" is-link url="" />
    <van-cell title="小智同学" is-link url="" />
    <van-cell title="系统设置" is-link url="" />
    <van-cell
      v-if="$store.state.user.token"
      class="logout-cell"
      title="退出登录"
      center
      @click="logout"
    />
  </div>
</template>

<script>
import { getUserInfo } from "@/api/user";
export default {
  name: "MyPage",
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    async logout() {
      await this.$dialog.confirm({
        message: "确定退出吗？",
      });
      this.$store.commit("user/changeUserToken", null);
      this.$router.push({ name: "login" });
    },
  },
  async created() {
    try {
      const res = await getUserInfo();
      this.userInfo = res.data.data;
    } catch (err) {
      console.log(err.response.data.message);
    }
  },
};
</script>

<style scoped lang="less">
.my-container {
  height: 100vh;
  background-color: #f5f7f9;
  .logout-cell {
    height: 100px;
    text-align: center;
    color: #eb5253;
    margin: 10px 0;
    font-size: 30px;
  }

  > .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile-img {
      width: 132px;
      height: 132px;
    }
    .text {
      font-size: 32px;
      color: white;
      margin-top: 10px;
    }
  }
  .grid-nav {
    .text {
      font-size: 32px;
    }
  }
  .logined {
    width: 100vw;
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    .c1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      .c1_1 {
        display: flex;
        align-items: center;
        .van-image {
          border: 6px solid white;
          border-radius: 50%;
          margin-right: 20px;
        }
        :last-child {
          font-size: 35px;
          color: white;
        }
      }
    }
    .c2 {
      display: flex;
      justify-content: space-around;
      text-align: center;
      color: white;
      font-size: 30px;
      margin-top: 35px;
    }
  }
}
</style>
