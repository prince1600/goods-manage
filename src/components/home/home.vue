<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"
          ><div class="grid-content bg-purple">logo</div></el-col
        >
        <el-col :span="16">
          <div class="grid-content bg-purple-light">
            <h3>电商管理后台</h3>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="logout">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <!-- <el-menu
          class="el-menu-vertical-demo"
          unique-opened
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="user">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="right">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-location"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-location"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-location"></i>
              <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu> -->
        <el-menu
          class="el-menu-vertical-demo"
          unique-opened
          router
          :default-active="this.$route.name"
        >
          <template v-for="item in navData">
            
            <sub-menu :key="item.id" :item="item"></sub-menu>
          </template>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- delete -->
  </el-container>
</template>


<script>
import subMenu from "./subMenu"
export default {
  data() {
    return {
      navData: [],
    };
  },
  components: { "sub-menu": subMenu },
  // beforeCreate() {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     this.$router.push({ name: "login" });
  //   }
  // },
  beforeMount() {
    this.getNavData();
    console.log(this.$route)
  },
  methods: {
    logout() {
      localStorage.clear("token");
      this.$message.success("退出登录");
      this.$router.push({ name: "login" });
    },
    async getNavData() {
      const res = await this.$http.get("menus");
      this.navData = res.data.data;
      console.log('菜单数据', this.navData);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
}
.grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}
</style>