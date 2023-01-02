<template>
  <div class="update_Nickname">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="finish"
    />
    <div class="width_wrap">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="10"
        placeholder="请输入新昵称"
        show-word-limit
      />
    </div>
  </div>
</template>
<script>
import { updateUserInfo } from "@/api/user";
export default {
  name: "UpdateNickname",
  data() {
    return {
      message: "",
    };
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  created() {
    this.message = this.value;
  },
  methods: {
    // 修改姓名
    async finish() {
      // 非空校验
      if (!this.message) return this.$toast("输入内容不能为空");
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
      });
      try {
        await updateUserInfo({ name: this.message });
        this.$emit("close");
        this.$emit("input", this.message);
        this.$toast.success("修改成功");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.update_Nickname {
  height: 100vh;
  background-color: #f6f7f9;
  .width_wrap {
    margin: 20px;
  }
}
</style>
