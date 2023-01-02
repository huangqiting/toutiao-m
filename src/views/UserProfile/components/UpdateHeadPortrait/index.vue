<template>
  <div class="update_head">
    <img ref="img" :src="imgUrl" alt="" />
    <div class="toolbox">
      <span @click="$emit('close')">取消</span>
      <span @click="finish">完成</span>
    </div>
  </div>
</template>
<script>
// 图片裁切的插件
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserHeadPortrait } from "@/api/user";
export default {
  name: "UpdateHead",
  props: {
    imgUrl: {
      type: String,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: "move", // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false, // 关闭默认背景
    });
  },
  methods: {
    finish() {
      // 获取裁切之后的图片
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // blob就是裁切之后的图片
        // form-data上传文件必须转成这个格式
        const fn = new FormData();
        fn.append("photo", blob);
        this.$toast.loading({
          message: "上传图片中...",
          forbidClick: true,
          duration: 0, // 持续展示 toast
        });
        // 调修改头像的接口
        updateUserHeadPortrait(fn).then(({ data: { data } }) => {
          this.$toast.success("上传成功");
          this.$emit("close");
          this.$emit("uploading-success", data);
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.update_head {
  width: 100%;
  height: 100%;
  background-color: #000;
  .toolbox {
    position: fixed;
    bottom: 10px;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 28px;
    padding: 0 15px;
  }
  // 图片裁切的插件配置
  img {
    display: block;
    max-width: 100%;
  }
}
</style>
