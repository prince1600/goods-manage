<template>
   <el-submenu :index="item.path" v-if="item.children.length">
       <template slot="title">
           <span>{{item.authName}}</span>
       </template>
       <sub-menu v-for="child in item.children" :key="child.id" :item="child"></sub-menu>
   </el-submenu>
   <el-menu-item v-else :route="{name: item.path}" :index="item.path">
       <span>{{item.authName}}</span>
   </el-menu-item>
</template>
<script>
export default {
    name: 'sub-menu',
    props: {
        item: Object
    }
}
</script>