<template>
  <el-card style="height: 100%">
    <!-- 面包屑 -->
    <gqs-breadcrumb
      :crumbs="['首页', '权限管理', '权限列表']"
      class="crumbs"
    ></gqs-breadcrumb>
    <!-- 数据列表 -->
    <section style="height: 70vh">
      <el-table :data="rightsList" border style="width: 100%;height: 100%;overflow: auto">
        <el-table-column type="index" label="#" width="80"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="280">
        </el-table-column>
        <el-table-column
          prop="level"
          label="层级"
          width="280"
          :formatter="fmtLevel"
        >
        </el-table-column>
      </el-table>
    </section>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  mounted() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const res = await this.$http.get("rights/list");
      const {
        data: { data, meta },
      } = res;
      this.rightsList = data;
    },
    fmtLevel(row, column, cellVal, index) {
      const valMap = {
        0: "一级",
        1: "二级",
        2: "三级",
      };
      return valMap[cellVal];
    },
  },
};
</script>
<style lang="less" scope>
.crumbs {
  margin: 10px 0 20px;
}
</style>