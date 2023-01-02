<template>
  <div class="user_profile">
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />
    <van-cell-group>
      <van-cell @click="$refs.file.click()" is-link title="头像">
        <template #default>
          <van-image
            width="30"
            height="30"
            round
            fit="cover"
            :src="user.photo"
          />
        </template>
      </van-cell>
      <van-cell
        is-link
        title="昵称"
        @click="showNickname = true"
        :value="user.name"
      />
      <van-cell
        @click="showGender = true"
        is-link
        title="性别"
        :value="['男', '女'][user.gender]"
      />
      <van-cell
        @click="showBirthday = true"
        is-link
        title="生日"
        :value="user.birthday"
      />
    </van-cell-group>
    <!-- 修改姓名 -->
    <van-popup
      v-model="showNickname"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <UpdateNickname
        v-if="showNickname"
        v-model="user.name"
        @close="showNickname = false"
      />
    </van-popup>
    <!-- 修改性别 -->
    <van-popup v-model="showGender" position="bottom">
      <UpdateGender
        v-if="showGender"
        v-model="user.gender"
        @close="showGender = false"
      />
    </van-popup>
    <!-- 修改生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <UpdateBirthday
        v-if="showBirthday"
        v-model="user.birthday"
        @close="showBirthday = false"
      />
    </van-popup>
    <!-- 修改头像 -->
    <!-- 
      hidden隐藏input
      accept="image/*" 规定只能上传图片文件
      -->
    <input
      @change="changeFile"
      ref="file"
      type="file"
      hidden
      accept="image/*"
    />
    <!-- 头像弹层 -->
    <van-popup
      v-model="showHeadPortrait"
      style="height: 100%"
      position="bottom"
    >
      <UpdateHeadPortrait
        v-if="showHeadPortrait"
        :imgUrl="imgUrl"
        @uploading-success="user.photo = $event.photo"
        @close="showHeadPortrait = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateNickname from "./components/UpdateNickname";
import UpdateGender from "./components/UpdateGender";
import UpdateBirthday from "./components/UpdateBirthday";
import UpdateHeadPortrait from "./components/UpdateHeadPortrait";
export default {
  name: "UserProfile",
  data() {
    return {
      user: {}, // 用户个人信息
      showNickname: false, // 控制修改昵称弹层
      showGender: false, // 控制修改性别弹层
      showBirthday: false, // 控制修改性别弹层
      showHeadPortrait: false, // 控制修改头像裁切弹层
      imgUrl: null, // 图片文件临时地址
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    // 获取用户个人信息，调接口
    async getUserInfo() {
      const {
        data: { data },
      } = await getUserProfile();
      // console.log(data);
      this.user = data;
    },
    // 获取上传文件的内容
    changeFile() {
      // this.$refs.file.files[0] 获取图片文件 files是一个伪数组保存着文件
      // console.log("img", this.$refs.file.files[0]);
      // 在内存中创建一个临时地址，指向文件对象资源

      this.showHeadPortrait = true;
      this.imgUrl = window.URL.createObjectURL(this.$refs.file.files[0]);
      // input file类型 如果选了同一个文件不会触发change事件
      // 解决办法教室每次使用完毕 把value清空 value保存着文件地址
      this.$refs.file.value = "";
    },
  },
  components: {
    UpdateNickname,
    UpdateGender,
    UpdateBirthday,
    UpdateHeadPortrait,
  },
};
</script>

<style scoped lang="less">
.user_profile {
  height: 100vh;
  background-color: #f6f7f9;
  /deep/ .van-nav-bar {
    background-color: #3396fc;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__text {
      color: #fff;
    }
  }
}
</style>
