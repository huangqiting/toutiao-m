<template>
  <div class="update_birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      @cancel="$emit('close')"
      @confirm="finish"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </div>
</template>
<script>
import { updateUserInfo } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "UpdateBirthday",
  data() {
    return {
      // min-date 和 max-date 属性可以确定可选的时间范围。
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value), // 默认选中时间
    };
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    // 修改生日
    async finish() {
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
        duration: 0, // 持续展示 toast
      });
      try {
        // 用moment或者dayjs处理时间 否则是这种格式 Tue Jul 31 2012 00:00:00 GMT+0800
        const birthdayDate = dayjs(this.currentDate).format("YYYY-MM-DD");
        await updateUserInfo({ birthday: birthdayDate });
        this.$emit("close");
        this.$emit("input", birthdayDate);
        this.$toast.success("修改成功");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
