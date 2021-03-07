<template>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(crumb,index) in crumbs" :key="index">{{crumb}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
    props: {
        crumbs: Array,
    }
}
</script>
<style lang="">
    
</style>