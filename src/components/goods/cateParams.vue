<template>
  <el-card>
    <gqs-breadcrumb :crumbs="['商品管理', '分类参数']"></gqs-breadcrumb>
    <el-alert class="alert" title="只允许为三级分类添加参数" type="error">
    </el-alert>
    <el-form>
      <el-form-item label="选择分级：">
        <el-cascader
          v-model="cateValues"
          :options="goodsCate"
          :props="cateProps"
          @change="handleChangeCate"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="first">
        <el-button type="danger" @click="openDialog">设置动态参数</el-button>
        <el-table :data="tableDataMany" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-tag
                :key="tag"
                v-for="tag in props.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(tag, props.row)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="handleInputConfirm(props.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-edit" circle></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">静态</el-tab-pane>
    </el-tabs>
    <!-- dialog - add dynAttr -->
    <el-dialog title="新增动态属性" :visible.sync="dialogFormVisibleDyn">
      <el-form :model="formDyn">
        <el-form-item label="属性名称" label-width="100">
          <el-input v-model="formDyn.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleDyn = false">取 消</el-button>
        <el-button type="primary" @click="hanleSubmitAdd"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      goodsCate: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
      },
      activeName: "first",
      cateValues: [],
      tableDataMany: [],
      tableDataOnly: [],
      formDyn: {
          attr_name: ''
      },
      //动态tag
      inputVisible: false,
      inputValue: "",
      //dialog
      dialogFormVisibleDyn: false,
    };
  },
  created() {
    this.getGoodsCate();
  },
  computed: {
      is3grade(){
          return this.cateValues[2] != undefined
      }
  },
  methods: {
    async hanleSubmitAdd(){
        const res = await this.addAttr(this.cateValues[2], 'many')
        const {data: {meta}} = res
        meta.status === 201 ? this.$message.success(meta.msg) :  this.$message.error(meta.msg)
    },
    async addAttr(cateId, type){
        const name = type === "many" ? this.formDyn.attr_name : ''
        await this.$http.post(`categories/${cateId}/attributes`,{
            attr_name: name,
            attr_sel: type
        })
    },
    openDialog(){
        if (this.is3grade) {
            this.dialogFormVisibleDyn = true
        } else {
            this.$message.error('请先选择3级分类')
        }
    },
    async handleChangeCate() {
      if (!this.is3grade) return;
      const id = this.cateValues[2];
      if (this.activeName === "first") {
        this.tableDataMany = await this.getAttriList(id, "many");
      } else {
        this.tableDataOnly = await this.getAttriList(id, "only");
      }
    },
    async getGoodsCate() {
      const res = await this.$http.get("categories");
      this.goodsCate = res.data.data;
    },
    handleClick() {},
    /* 
    only, many表示动态或静态参数  */
    async getAttriList(cateId, type) {
      const res = await this.$http.get(
        `categories/${cateId}/attributes?sel=${type}`
      );
      const attriList = res.data.data;
      attriList.forEach((item) => {
        item.attr_vals = item.attr_vals.split(",");
      });
      return attriList;
    },
    handleCloseTag(tag, attr) {
      const index = attr.attr_vals.indexOf(tag);
      attr.attr_vals.splice(index, 1);
      this.putDynAttr(attr);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        await this.putDynAttr(attr);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },

    async putDynAttr(attr) {
      await this.$http.put(
        `categories/${attr.cat_id}/attributes/${attr.attr_id}`,
        {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(","),
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.alert {
  margin: 20px 0;
}
/deep/ .el-tabs__content {
  min-height: 50vh;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>