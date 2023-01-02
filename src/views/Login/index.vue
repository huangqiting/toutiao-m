<template>
  <div class="login-container">
    <van-nav-bar
      left-arrow
      @click-left="$router.push({ name: 'home' })"
      title="登录"
    />
    <van-form ref="form" @submit="onSubmit">
      <van-field
        v-model="mobile"
        name="mobile"
        label=""
        maxlength="11"
        label-width="20"
        placeholder="请输入手机号"
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
        ]"
      >
        <template #label>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>

      <van-field
        v-model="code"
        name="code"
        label=""
        label-width="20"
        placeholder="请输入验证码"
        maxlength="6"
        :rules="[
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}/, message: '验证码格式不正确' },
        ]"
      >
        <template #label> <i class="toutiao toutiao-yanzhengma"></i> </template>
        <template #button>
          <!-- 按钮的默认类型，会触发表单提交，所以要指定明确的按钮类型 -->
          <!-- native-type="button"  表示将这个按钮变成一个普通按钮，不要触发表单提交 -->
          <van-button
            type="default"
            size="mini"
            round
            color="#eee"
            class="sms_btn"
            native-type="button"
            :loading="isLoadingOfCode"
            loading-text="发送中"
            :disabled="!isShowCountDown"
            @click="sendCode"
          >
            <!-- 
            template 标签只是一个临时包裹标签，
            本身不会渲染任何元素在页面上，只会将其内容渲染到页面上 
          -->
            <template v-if="isShowCountDown">
              &nbsp;&nbsp;获取验证码&nbsp;&nbsp;
            </template>
            <!-- change事件 时间发生变动就会触发 -->
            <van-count-down
              v-else
              @change="timeData"
              :time="6 * 1000"
              format=" ss 秒后重新获取"
            />
          </van-button>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button square block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
      <div class="footer">隐私条款</div>
    </van-form>
  </div>
</template>

<script>
import { sendCode, login } from "@/api/user";
export default {
  name: "LoginPage",
  data() {
    return {
      mobile: "",
      code: "",
      // 控制倒计时
      isShowCountDown: true,
      // 控制按钮发送中显示
      isLoadingOfCode: false,
    };
  },
  methods: {
    async sendCode() {
      // 1.验证手机号码是否正确
      // this.$refs可以获取组件实例，dom元素
      // validate方法是van-form组件上的方法，传入name，会触发表单效验，返回值是一个promise
      await this.$refs.form.validate("mobile");
      // 成功才会执行后面的代码
      this.isLoadingOfCode = true;
      // 2.请求 发送验证码 接口
      try {
        // 异步请求发送短信接口
        await sendCode(this.mobile);
        // 3.验证码倒计时
        this.isShowCountDown = false;
        // 捕捉报错
      } catch (err) {
        // 弹出轻提示提示用户发送短信异常
        this.$toast.fail(err.response.data.message);
        return;
        // finally最终执行的操作，不管请求接口是否成功都会执行
      } finally {
        // 把发送短信按钮的发送中状态关掉
        this.isLoadingOfCode = false;
      }
    },
    // timeData 里面有一个对象包含时间信息 seconds秒
    timeData({ seconds }) {
      // 判断用户点完发送短信 到0时 把倒计时结束 把发送短信显示
      if (seconds === 0) {
        this.isShowCountDown = true;
      }
    },
    // 表单提交事件 values是一个对象 键是表单name 值是表单value值
    async onSubmit(values) {
      console.log("submit", values);
      // 轻提示的加载提示 duration默认是2秒 设置为0表示无限加载
      this.$toast.loading({
        message: "登录中...",
        // forbidClick 为true 代表加载状态 用户不能点击页面
        forbidClick: true,
        duration: 0,
      });
      try {
        // 把手机号和短信 传参给接口作为date 提交数据
        const res = await login(values);
        console.log(res.data.data);
        this.$store.commit("user/changeUserToken", res.data.data);
        // 请求成功后结束登录加载 clear是布尔值
        this.$toast.clear();
        // 用name跳转路由 老师推荐
        this.$router.push({
          name: "home",
        });
      } catch (err) {
        // 登录失败
        this.$toast.fail(err.response.data.message);
      }
    },
  },
};
</script>
<style scoped lang="less">
.login-container {
  height: 100vh;
  background-color: #f7f8fa;
  .van-nav-bar {
    background-color: #2f95f9;
    // 加了/deep/ 不会加入私有的哈希值
    /deep/ .van-nav-bar__title {
      color: #fff;
    }
  }
}
i.toutiao {
  font-size: 40px;
}
.sms_btn {
  color: #333 !important;
}
.footer {
  position: fixed;
  left: 45%;
  bottom: 30px;
  font-size: 28px;
}
/deep/ .van-nav-bar .van-icon {
  color: white;
}
</style>
