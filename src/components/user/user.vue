<template>
  <el-card class="box-card">
    <!-- 1. 面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索栏 -->
    <el-row class="searchRow">
      <el-col>
        <el-input
          placeholder="请输入内容"
          v-model="queryString"
          class="inputSearch"
          clearable
          @clear="getUserList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
        <el-button
          type="primary"
          @click="dialogFormVisible = !dialogFormVisible"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 3.数据列表 -->
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="#" width="80" type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <!-- 创建时间 -->
        <!-- <el-table-column
          prop="create_time"
          label="创建时间"
          width="180"
          :formatter="fmtDate"
        >
        </el-table-column> -->
        <el-table-column label="创建时间" width="180">
          <template v-slot="slotProps">
            <span>{{ slotProps.row.create_time | fmtDate }}</span>
          </template>
        </el-table-column>
        <!-- 用户状态 -->
        <el-table-column label="用户状态" width="180">
          <template v-slot="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchState(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <template v-slot="slotProps">
            <el-button
              plain
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="openEditMsg(slotProps.row)"
            ></el-button>
            <el-button
              plain
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="openDeleteMsg(slotProps.row.id)"
            ></el-button>
            <el-button
              plain
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="openRoleMsg(slotProps.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框-添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="addForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密 码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电 话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户-对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogEditFormVisible">
      <el-form :model="form" ref="addForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input
            disabled
            v-model="formEdit.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电 话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="formEdit.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮 箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="formEdit.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色-对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleFormVisible">
      <el-form >
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <span style="fontWeight: 700; fontSize: 20px">{{currentUsername}}</span>
        </el-form-item>
        <el-form-item label="选择角色" :label-width="formLabelWidth">
          <el-select v-model="currentRoleId" placeholder="请选择要分配的角色">
            <el-option v-for="item in rolesData" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAssigin"
          >确定分配</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>
  <script>
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      queryString: "",
      pagenum: 1,
      pagesize: 10,
      value: true,
      total: 0,
      //  对话框
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      dialogRoleFormVisible: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      formEdit: { username: "", email: "", mobile: "" },
      editID: null,
      formLabelWidth: "80px",
      rules: {
        password: [{ required: true, meesage: "请输入密码", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名!!", trigger: "blur" },
        ],
      },
      currentUsername: '',
      currentRoleId: -1,
      currentUserId: -1,
      rolesData: []
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // assign role
    async openRoleMsg(user) {
        this.dialogRoleFormVisible = true
        this.currentUsername = user.username
        //获取角色数据list
        const res = await this.$http.get('roles')
        this.rolesData = res.data.data
        //根据用户id获取角色id
        const roleRes = await this.$http.get(`users/${user.id}`)
        console.log(roleRes.data)
        this.currentRoleId = roleRes.data.data.rid
        this.currentUserId = user.id

    },
    async handleAssigin(){
        /* 
          put
          users/:id/role
          {rid: number} 
        */
        const res = await this.$http.put(
            `users/${this.currentUserId}/role`,
            {rid: this.currentRoleId}
            )
        const {data: {meta: {msg, status}}} = res
        if (status === 200) {
            this.$message.success(msg)
            this.dialogRoleFormVisible = false
        } else {
            this.$message.error(msg)
        }
    },
    //change state
    async switchState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const {
        data: {
          meta: { msg, status },
        },
      } = res;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // edit user
    cancelEdit() {
      this.dialogEditFormVisible = false;
      this.formEdit = { username: "", email: "", mobile: "" };
    },
    openEditMsg(form) {
      this.dialogEditFormVisible = true;
      this.formEdit.username = form.username;
      this.formEdit.email = form.email;
      this.formEdit.mobile = form.mobile;
      this.editID = form.id;
    },
    async handleSubmitEdit() {
      const res = await this.$http.put(`users/${this.editID}`, this.formEdit);
      const {
        data: {
          meta: { msg, status },
        },
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogEditFormVisible = false;
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
    },
    //delete user
    openDeleteMsg(id) {
      this.$confirm("将要删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    async deleteUser(id) {
      console.log("delete:" + id);
      const res = await this.$http.delete(`users/${id}`);
      const {
        data: {
          meta: { msg, status },
        },
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        this.getUserList();
      } else {
        this.$message.error(msg);
      }
    },
    // add user
    handleSubmitAdd() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          console.log("submit!");
          this.addUser();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async addUser() {
      const res = await this.$http.post("users", this.form);
      console.log(res);
      const {
        data: { data, meta },
      } = res;
      if (meta.status === 201) {
        this.$message.success(meta.msg);
        this.resetForm("addForm");
        this.dialogFormVisible = false;
        this.getUserList();
      } else {
        this.$message.error(meta.msg);
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async getUserList() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.queryString.trim()}&pagenum=${
          this.pagenum
        }&pagesize=${this.pagesize}`
      );
      console.log(res);
      const {
        data: {
          data: { total, pagenum, users },
          meta,
        },
      } = res;
      this.total = total;
      this.$message.success(meta.msg);
      if (meta.status === 200) {
        this.tableData = users;
        console.log(this.tableData);
      }
    },

    fmtDate(row, column, cellValue, index) {
      return moment(cellValue).format("YYYY-MM-DD");
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin: 20px 0;
}
</style>