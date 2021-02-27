<template lang="">
    <el-container class="container">
  <el-header class="header">
      <el-row>
        <el-col :span="4"><div class="grid-content bg-purple">logo</div></el-col>
        <el-col :span="16">
            <div class="grid-content bg-purple-light">
                <h3>电商管理后台</h3>
            </div>
        </el-col>
        <el-col :span="4">
            <div class="grid-content bg-purple">
                <el-button type="primary">退出</el-button>
            </div>
        </el-col>
    </el-row>
  </el-header>
  <el-container>
    <el-aside width="200px" class="aside">Aside</el-aside>
    <el-main class="main">Main</el-main>
  </el-container>
</el-container>

</template>

<script>
export default {};
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