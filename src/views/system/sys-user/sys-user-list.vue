<template>
  <div id="sys-user-list" class="app-container">
    <div class="filter-container">
      <tree-select
        :data="treeSelectData"
        placeholder="部门名称"
        clearable
        :select-key.sync="listQuery.departmentId"
        @change="handleFilter"/>
      <el-select v-model="listQuery.roleId" placeholder="角色名称" @change="handleFilter" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-select v-model="listQuery.state" placeholder="状态" @change="handleFilter" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <date-picker-range
        :date-range.sync="createTimeRange"
        :start-date.sync="listQuery.createTimeStart"
        :end-date.sync="listQuery.createTimeEnd"
        @change="handleCreateTimeFilter"
      />
      <br/>
      <el-input placeholder="请输入关键字进行查询" clearable v-model="searchValue" class="input-with-select" @clear="handleClear" @keyup.enter.native="handleFilter()">
        <el-select v-model="searchColumn" slot="prepend" placeholder="请选择">
          <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-input>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="width: 115px;">搜索</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd" style="margin-left: 10px; width: 92px;">添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80px" align="center">
        <template slot-scope="{row}">
          <img :src="row.head" alt="" style="width: 34px; max-height: 34px; vertical-align: middle;">
        </template>
      </el-table-column>
      <el-table-column label="账号" min-width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="手机号码" min-width="115px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.departmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" sortable="custom" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state | stateClassFilter">
            <span>{{row.state | stateFilter}}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="240" class-name="operation">
        <template slot="header" slot-scope="scope">
          操作
          <el-dropdown trigger="click">
            <el-link type="primary" style="vertical-align: baseline;">
              <i class="el-icon-s-operation"/>
            </el-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">账号</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">用户名称</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">电话号码</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">性别</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link type="primary" style="vertical-align: baseline;margin: 0px 3px;">
            <i class="el-icon-document"/>
          </el-link>
          <el-link type="primary" style="vertical-align: baseline;">
            <i class="el-icon-printer"/>
          </el-link>
        </template>
        <template slot-scope="{row}">
          <el-link type="primary" @click="handDetail(row.id)">详情</el-link>
          <el-link type="primary" @click="handleHeadUpload(row.id, row.head)">上传头像</el-link>
          <el-link type="primary" @click="handleRestPassword(row.id)">重置密码</el-link>
          <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
          <el-link type="danger" @click="handleDelete(row.id, row.username)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList"/>

    <sys-user is-detail ref="detailPage"/>
    <sys-user is-add ref="addPage" @change="handleFilter"/>
    <sys-user is-update ref="updatePage" @change="getList"/>
    <sys-user-head ref="headUploadPage" @change="getList"/>
    <sys-user-password ref="resetPasswordPage"/>

  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'
  import TreeSelect from '@/components/TreeSelect'
  import DatePickerRange from '@/components/DatePickerRange'

  import SysUser from './components/sys-user'
  import SysUserHead from './components/sys-user-head'
  import SysUserPassword from './components/sys-user-password'

  import sysUserApi from '@/api/system/sys-user-api'
  import sysDepartmentApi from '@/api/system/sys-department-api'
  import sysRoleApi from '@/api/system/sys-role-api'

  const stateEnum = { 0: '禁用', 1: '启用', 2: '锁定' }
  const stateClassEnum = { 0: 'info', 1: 'success', 2: 'warning' }
  const stateOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
    { label: '锁定', value: 2 }
  ]
  const searchOptions = [
    { label: '全部', value: 'keyword' },
    { label: '账号', value: 'username' },
    { label: '用户名称', value: 'nickname' }
  ]

  export default {
    name: 'SysUserList',
    components: { DatePickerRange, TreeSelect, SysUserPassword, SysUserHead, SysUser, Pagination },
    directives: { waves },
    filters: {
      stateClassFilter(state) {
        return stateClassEnum[state]
      },
      stateFilter(state) {
        return stateEnum[state];
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        sortColumn: 'id',
        sortAsc: false,
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          keyword: null,
          username: null,
          nickname: null,
          departmentId: null,
          roleId: null,
          state: null,
          createTimeStart: null,
          createTimeEnd: null,
          pageSorts: []
        },
        treeSelectData: null,
        roleOptions: [],
        stateOptions,
        tableColumnChecked: null,
        searchColumn: 'keyword',
        searchValue: null,
        searchOptions,
        createTimeRange: null,
        showReviewer: true,
        downloadLoading: false
      }
    },
    created() {
      this.setDefaultSort()
      this.getList()
      this.getDepartmentTree()
      this.getRoleList()
    },
    methods: {
      getList() {
        this.listLoading = true
        sysUserApi.getPageList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        });
      },
      getDepartmentTree() {
        sysDepartmentApi.getDepartmentTree().then(response => {
          this.treeSelectData = response.data;
        });
      },
      getRoleList() {
        sysRoleApi.getList().then(response => {
          this.roleOptions = response.data;
        });
      },
      handleFilter() {
        this.listQuery.pageIndex = 1
        this.listQuery.keyword = null;
        this.listQuery.username = null;
        this.listQuery.nickname = null;
        this.listQuery[this.searchColumn] = this.searchValue;
        this.getList()
      },
      handleCreateTimeFilter() {
        this.handleFilter();
      },
      handleClear() {
        this.handleFilter()
      },
      setDefaultSort() {
        // 设置默认排序
        this.listQuery.pageSorts = [{
          column: this.sortColumn,
          asc: this.sortAsc
        }]
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'createTime') {
          this.sortColumn = 'create_time'
        } else {
          this.sortColumn = prop
        }
        this.sortAsc = order === 'ascending'
        this.listQuery.pageSorts = [{
          column: this.sortColumn,
          asc: this.sortAsc
        }]
        this.handleFilter()
      },
      getSortClass: function(key) {
        if (this.sortColumn === key) {
          return this.sortAsc ? 'ascending' : 'descending'
        } else {
          return ''
        }
      },
      handleAdd() {
        this.$nextTick(() => {
          this.$refs.addPage.handle()
        });
      },
      handDetail(id) {
        this.$nextTick(() => {
          this.$refs.detailPage.handle(id)
        });
      },
      handUpdate(id) {
        this.$nextTick(() => {
          this.$refs.updatePage.handle(id)
        });
      },
      handleHeadUpload(id, head) {
        this.$nextTick(() => {
          this.$refs.headUploadPage.handle(id, head);
        });
      },
      handleRestPassword(id) {
        this.$nextTick(() => {
          this.$refs.resetPasswordPage.handle(id);
        });
      },
      handleDelete(id, username) {
        this.$confirm('您确定要删除 ' + username + ' ?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sysUserApi.delete(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.handleFilter();
          })
        });
      }
    }
  }
</script>

<style lang="scss">
  #sys-user-list .el-table th, .el-table td{
    padding: 6px 0px;
  }

  #sys-user-list .filter-container {
    padding-bottom: 10px;
  }

  #sys-user-list .filter-container .tree-select-item{
    width: 120px;
    display: inline-block;
    vertical-align: top;
    margin-right: 4px;
  }

  #sys-user-list .input-with-select {
    vertical-align: top;
    width: 505px;
    margin-right: 4px;
  }

  #sys-user-list .input-with-select .el-select .el-input {
    width: 120px;
  }

  #sys-user-list .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  #sys-user-list .filter-item {
    margin-right: 4px;
  }

  #sys-user-list .el-table__body .operation .cell {
    text-align: center;
  }

</style>
