<template>
  <div class="login-wrapper">
    <el-form
      label-position="top"
      label-width="80px"
      :model="formData"
      class="login-form"
    >
      <h3>用户登录</h3>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-btn" @click.prevent="login"
        >登录</el-button
      >
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      const res = await this.$http.post("login", this.formData);
      const {
        data,
        meta: { msg, status },
      } = res.data;
      console.log(status, data);
      if (status === 400) {
        this.$message.error(msg);
      } else if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$message.success(msg);
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.login-wrapper {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
  }
  .login-btn {
    width: 100% !important;
  }
}
</style>