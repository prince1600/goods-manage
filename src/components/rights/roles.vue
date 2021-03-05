<template>
  <el-card>
    <gqs-breadcrumb
      :crumbs="['首页', '权限管理', '角色列表']"
      class="crumbs"
    ></gqs-breadcrumb>
    <el-button @click="dialogVisibleAdd = true">添加角色</el-button>
    <!-- 数据表格 -->
    <el-table :data="roleList" style="width: 100%">
      <!-- 折叠column -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="(item, index) in props.row.children" :key="index">
            <el-col :span="4">
              <el-tag closable @close="deleteRoleAuth(props.row, item.id)">{{
                item.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    closable
                    @close="deleteRoleAuth(props.row, item2.id)"
                    type="success"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    @close="deleteRoleAuth(props.row, item3.id)"
                    type="warning"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <p v-if="props.row.children.length === 0" style="color: red">
            该角色暂未分配权限
          </p>
        </template>
      </el-table-column>

      <el-table-column label="#" width="80" type="index"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
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
            @click="openAuthMsg(slotProps.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框-修改权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisibleAssign"
      width="30%"
      :before-close="handleCloseAssign"
    >
      <el-tree
        :data="authTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        ref="authTree"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAssign = false">取 消</el-button>
        <el-button type="primary" @click="handleAssign">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框-增加角色 -->
    <el-dialog title="增加角色" :visible.sync="dialogVisibleAdd" width="30%">
      <el-form :model="formAdd" :rules="addRules" ref="roleAddForm">
        <el-form-item label="角色名称" label-width="100" prop="roleName">
          <el-input v-model="formAdd.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100">
          <el-input v-model="formAdd.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd('roleAddForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 对话框-编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="dialogVisibleEdit">
      <el-form :model="currentRole">
        <el-form-item label="角色名称" label-width="100">
          <el-input disabled v-model="currentRole.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100">
          <el-input v-model="currentRole.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editRole(currentRole.id)"
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
      roleList: [],
      dialogVisibleAssign: false,
      authTree: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defaultCheckedKeys: [],
      currentRid: -1,
      dialogVisibleAdd: false,
      dialogVisibleEdit: false,
      formAdd: {
        roleName: "",
        roleDecs: "",
      },
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      currentRole: {
          roleName: '',
          roleDesc: ''
      }
    };
  },
  created() {
    this.getRoleList();
    this.getAuthTree();
  },
  methods: {
    // edit role
    openEditMsg(user) {
        this.currentRole = user
        this.dialogVisibleEdit = true
    },
    async editRole(rid) {
        const res = await this.$http.put(`roles/${rid}`, this.currentRole)
        const {
            data: {
              meta: { msg, status },
            },
          } = res;
          if (status === 200) {
            this.$message.success(msg);
            this.dialogVisibleEdit = false;
            this.getRoleList();
          } else {
            this.$message.error(msg);
          }

    },
    // delete role
    openDeleteMsg(rid) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${rid}`);
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg);
            this.getRoleList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 增加角色
    handleAdd(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post("roles", this.formAdd);
          const {
            data: {
              meta: { msg, status },
            },
          } = res;
          if (status === 201) {
            this.$message.success(msg);
            this.dialogVisibleAdd = false;
            this.getRoleList();
          } else {
            this.$message.error(msg);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //   获取所有角色权限列表
    async getRoleList() {
      const res = await this.$http.get("roles");
      const {
        data: { data, meta },
      } = res;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.roleList = data;
        console.log("roles", this.roleList);
      } else {
        this.$message.error(meta.msg);
      }
    },

    // 删除指定权限
    async deleteRoleAuth(role, rightID) {
      /**
       * path: /roles/:roleId/rights/:rightId
       * method: delete
       */
      const res = await this.$http.delete(
        `/roles/${role.id}/rights/${rightID}`
      );
      const {
        data: { data, meta },
      } = res;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        role.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 获取权限树
    async getAuthTree() {
      const res = await this.$http.get("rights/tree");
      this.authTree = res.data.data;
    },

    /*
     * 分配权限
     */
    openAuthMsg(auth) {
      this.defaultCheckedKeys = [];
      this.dialogVisibleAssign = true;
      console.log(auth);
      this.currentRid = auth.id;
      this.addKeyToList(auth, this.defaultCheckedKeys);
      this.$nextTick(() => {
        this.$refs["authTree"].setCheckedKeys(this.defaultCheckedKeys);
        // this.$refs["authTree"].setExpandedKeys(this.defaultCheckedKeys);
      });
    },
    addKeyToList(auth, target) {
      const ls = auth.children;
      function add(ls) {
        ls.forEach((item) => {
          if (item.children) {
            add(item.children);
          } else {
            target.push(item.id);
          }
        });
      }
      add(ls, target);
      //   console.log(this.defaultCheckedKeys);
    },
    async handleAssign() {
      const halfCheckedIds = this.$refs["authTree"].getHalfCheckedKeys();
      const checkedIds = this.$refs["authTree"].getCheckedKeys();
      const keys = [...halfCheckedIds, ...checkedIds];
      const res = await this.$http.post(`roles/${this.currentRid}/rights`, {
        rids: keys.join(),
      });
      const {
        data: {
          meta: { status, msg },
        },
      } = res;
      if (status === 200) {
        this.$message.success(msg);
        this.getRoleList();
        this.dialogVisibleAssign = false;
      } else {
        this.$message.error(msg);
      }
    },
    handleCloseAssign() {
      this.dialogVisibleAssign = false;
      this.defaultCheckedKeys = [];
    },
  },
};
</script>
<style lang="">
</style>