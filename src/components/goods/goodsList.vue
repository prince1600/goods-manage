<template>
  <el-card>
    <gqs-breadcrumb :crumbs="['商品管理', '商品列表']"></gqs-breadcrumb>
    <el-input
      placeholder="请输入内容"
      v-model="searchText"
      class="search-input"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="primary" @click="$router.push({path: '/goods/add'})">新增商品</el-button>
    <el-table
      height='65vh'
      :data="goodsData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template #default='props'>
            <span>{{props.row.add_time | fmtDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template #default="">
            <el-button plain type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button plain type="danger" icon="el-icon-delete" circle size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20, 40, 60, 80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
    data() {
        return {
            searchText: '',
            goodsData: [],
            total: 0,
            currentPage: 1,
            pageSize: 20,
        }
    },
    created(){
        this.getGoodsList()
    },
    methods: {
        async getGoodsList(){
            const res = await this.$http.get(`goods?query=${this.searchText}&pagenum=${this.currentPage}&pagesize=${this.pageSize}`)
            const {total, goods} = res.data.data
            this.total = total
            this.goodsData = goods
            console.log('商品列表数据：', this.goodsData)
        },
        handleSizeChange(size){
            this.pageSize = size
            this.getGoodsList()
        },
        handleCurrentChange(pagenum){
            this.currentPage = pagenum
            this.getGoodsList()
        },
    },
};
</script>
<style lang="less" scoped>
.search-input {
    width: 300px;
    margin: 20px 0;
}
</style>