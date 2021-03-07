<template>
  <el-card>
    <gqs-breadcrumb :crumbs="['商品管理', '商品列表']"></gqs-breadcrumb>
    <el-alert
      style="margin: 20px 0"
      title="添加商品信息"
      type="success"
      center
      show-icon
    >
    </el-alert>
    <!-- 步骤条 -->
    <!-- 
    基本信息
    商品参数
    商品属性
    商品图片
    商品内容 -->
    <el-steps :active="+activeName" align-center style="padding: 10px 0 30px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-tabs
      v-model="activeName"
      :tab-position="'left'"
      style="height: 60vh"
      @tab-click="handleClickNav"
    >
      <el-tab-pane label="基本信息" name="1">
        <!-- 
        商品名称
        商品价格
        商品重量
        商品数量
        商品分类 -->
        <el-form label-position="right" label-width="80px" :model="formAdd">
          <el-form-item label="商品名称">
            <el-input v-model="formAdd.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model.number="formAdd.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model.number="formAdd.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model.number="formAdd.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="cateValue"
              :options="goodsCate"
              :props="cateProps"
              @change="handleChangeCate"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="2">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="3">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="4">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="5">商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
const stepMap = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
};
export default {
  data() {
    return {
      activeName: "1",
      formAdd: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cate: "",
        goods_introduce: '',
        pics: '',
        attrs: ''
      },
      goodsCate: [],
      cateValue: [],
      cateProps: { 
          expandTrigger: 'hover',
          value: "cat_id",
          label: "cat_name"
          }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    handleChangeCate() {
        this.formAdd.goods_cate = this.cateValue.join(',')
        console.log('cate', this.cateValue, this.formAdd.goods_cate)
    },
    handleClickNav(tab, event) {
    //   console.log(tab, event);
    },
    async getGoodsCate() {
      const res = await this.$http.get("categories");
      this.goodsCate = res.data.data;
    //   console.log(this.goodsCate);
    },
  },
};
</script>
<style lang="less" scoped>
</style>