<template>
  <div class="update_gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="finish"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>
<script>
import { updateUserInfo } from "@/api/user";
export default {
  name: "UpdateGender",
  data() {
    return {
      columns: ["男", "女"],
      gender: 0,
    };
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  methods: {
    // 修改性别
    async finish() {
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
      });
      try {
        await updateUserInfo({ gender: this.gender });
        this.$emit("close");
        this.$emit("input", this.gender);
        this.$toast.success("修改成功");
      } catch (err) {
        console.log(err);
      }
    },
    onChange(picker, value, index) {
      // 当前值：value, 当前索引：index
      this.gender = index;
    },
  },
};
</script>
<style lang="less" scoped></style>
