<template>
  <div class="custom-tree-container">
    <div class="block" v-if="roleName">
      <p>{{roleName}}角色权限设置</p>
      <el-input
        class="filter-input"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable>
      </el-input>
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        ref="tree"
        :filter-node-method="filterNode"
        highlight-current
        :default-checked-keys="checkedKeys"
        default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="border: 0px solid red;width: 200px;">
          <i :class="data.icon"></i>
          {{ data.name }}
        </span>
        <span style="border: 0px solid blue;width: 700px">{{ data.remark }}</span>
      </span>
      </el-tree>

      <div class="btn-container">
        <el-button @click="handleClose()">关闭</el-button>
        <el-button type="primary" @click="handleSave()">保存</el-button>
      </div>

    </div>

    <div class="error-container" v-if="errorMessage">
      <el-alert
        :title="errorMessage"
        type="error"
        effect="dark"
        center
        :closable="false">
      </el-alert>
    </div>

  </div>

</template>

<script>
  import sysPermissionApi from '@/api/system/sys-permission-api'
  import sysRoleApi from '../../../api/system/sys-role-api'

  export default {
    name: 'SysRoleMenu',
    data() {
      return {
        filterText: '',
        data: null,
        checkedKeys: null,
        roleId: null,
        roleName: null,
        errorMessage: null
      }
    },
    created() {
      const roleId = this.$route.params && this.$route.params.id;
      console.log(roleId)
      this.roleId = roleId;
      this.getRole(roleId);
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      getMenus() {
        sysPermissionApi.getAllMenuTree().then(response => {
          this.data = response.data;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1 || data.remark.indexOf(value) !== -1;
      },
      getRole(roleId) {
        sysRoleApi.detail(roleId).then(response => {
          if (response.code === 200) {
            this.roleName = response.data.name;
            this.loadData();
          } else {
            this.errorMessage = response.message;
          }
        })
      },
      loadData() {
        // 获取所有菜单
        this.getMenus();
        // 根据角色获取菜单
        this.getMenuIdsByRoleId(this.roleId);
      },
      getMenuIdsByRoleId(roleId) {
        sysPermissionApi.getMenuIdsByRoleId(roleId).then(response => {
          this.checkedKeys = response.data;
        })
      },
      handleClose() {
        const view = this.$store.state.tagsView.visitedViews.find(item => {
          return item.name === 'sysRoleMenu';
        });
        this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
          if (visitedViews) {
            const latestView = visitedViews.slice(-1)[0];
            this.$router.push(latestView.fullPath);
          }
        })
      },
      handleSave() {
        const ids = this.$refs.tree.getCheckedKeys();
        console.log(ids);
        const param = {
          roleId: this.roleId,
          permissionIds: ids
        }
        sysRoleApi.updateSysRolePermission(param).then(response => {
          console.log(response.data);
          if (response.code === 200) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.loadData();
          }
        });
      }
    }
  };
</script>

<style>
  .custom-tree-container{
    max-width: 1000px;
    /*border: 1px solid red;*/
    margin: 20px 0px 50px 20px;
  }

  .filter-input{
    /*border: 1px solid red;*/
    margin-bottom: 15px;
    max-width: 600px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    /*padding-right: 8px;*/
    /*border: 1px solid red;*/
    padding: 6px 8px 6px 4px;
    margin: 10px 0px;
  }

  .btn-container{
    /*border: 1px solid red;*/
    padding: 30px 10px 30px 400px;

  }
</style>
