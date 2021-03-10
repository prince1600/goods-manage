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
    <el-form label-position="top" label-width="80px" :model="formAdd">
      <el-tabs
        v-model="activeName"
        :tab-position="'left'"
        style="height: 60vh; overflow: auto"
        @tab-click="handleClickNav"
      >
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="1">
          <!-- 
        商品名称
        商品价格
        商品重量
        商品数量
        商品分类 -->
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
              v-model="cateValues"
              :options="goodsCate"
              :props="cateProps"
              @change="handleChangeCate"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品参数 -->
        <el-tab-pane label="商品参数" name="2">
          <el-form-item
            v-for="item in dynAttrs"
            :key="item.attr_id"
            :label="item.attr_name"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :key="i"
                v-for="(val, i) in item.attr_vals"
                :label="val"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item
            v-for="item in staticAttrs"
            :key="item.attr_id"
            :label="item.attr_name"
          >
            <el-input v-model="item.attr_vals[0]"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://192.168.199.100:8888/api/private/v1/upload"
              :headers="uploadHeaders"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <quill-editor v-model="formAdd.goods_introduce"></quill-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitAdd"
              >提交新商品</el-button
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
const stepMap = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
};
export default {
  components: { quillEditor },
  data() {
    return {
      activeName: "1",
      formAdd: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      goodsCate: [],
      cateValues: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
      },
      staticAttrs: [],
      dynAttrs: [],
      checkList: [],
      //pics
      fileList: [],
      uploadHeaders: { Authorization: localStorage.getItem("token") },
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    dealAttrs() {
        this.formAdd.attrs = []
        const allAttrs = [...this.staticAttrs, ...this.dynAttrs]
        allAttrs.forEach(item => {
            item.attr_vals.forEach(val => {
                this.formAdd.attrs.push({
                    "attr_id": item.attr_id,
                    "attr_value": val
                })
            })
        })
    },
    async handleSubmitAdd(){
        this.dealAttrs()
        console.log(this.formAdd)
        console.log(this.staticAttrs, this.dynAttrs)
        const res = await this.$http.post('goods', this.formAdd)
        const {data: {meta: {msg, status}}} = res
        if (status === 201) {
            this.$message.success(msg)
        } else {
            this.$message.error(msg)
        }
    },
    handleSuccess(response, file, fileList) {
      console.log("success:", response, fileList, file);
      this.formAdd.pics.push({pic: response.data.tmp_path})
    },
    handlePreview(file) {},
    handleRemove(file, fileList) {
      console.log("remove", fileList, file);
      this.formAdd.pics = this.formAdd.pics.filter(item => {
          return item.pic !== file.response.data.tmp_path
      })
    },
    handleChangeCate() {
      this.formAdd.goods_cat = this.cateValues.join(",");
    },
    async handleClickNav(tab, event) {
      const attrTabNames = ["商品参数", "商品属性"];
      console.log("tabName", tab.label);
      if (attrTabNames.includes(tab.label)) {
        if (this.cateValues.length !== 3) {
          this.$message({
            message: "请在【基本信息】>【商品分类】中选择3级分类",
            type: "warning",
          });
          return;
        }
        if (tab.label === attrTabNames[0]) {
          this.dynAttrs = await this.getAttriList(this.cateValues[2], "many");
          console.log("many:dynAttrs", this.dynAttrs);
        } else {
          this.staticAttrs = await this.getAttriList(
            this.cateValues[2],
            "only"
          );
          console.log("only:staticAttrs", this.staticAttrs);
        }
      }
    },
    /* 
    only, many表示动态或静态参数  */
    async getAttriList(id, type) {
      const res = await this.$http.get(
        `categories/${id}/attributes?sel=${type}`
      );
      const attriList = res.data.data;
      attriList.forEach((item) => {
        item.attr_vals = item.attr_vals.split(",");
      });
      return attriList;
    },

    async getGoodsCate() {
      const res = await this.$http.get("categories");
      this.goodsCate = res.data.data;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ql-container {
  height: 250px !important;
}
</style>