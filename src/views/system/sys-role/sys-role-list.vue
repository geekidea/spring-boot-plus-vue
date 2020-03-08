<template>
  <div id="sys-role-list" class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.state" placeholder="状态" @change="handleFilter" clearable class="filter-item" style="width: 120px">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-input
        placeholder="请输入关键字进行查询"
        clearable
        v-model="searchValue"
        class="input-with-select"
        @keyup.enter.native="getList()">
        <el-select v-model="searchColumn" slot="prepend" placeholder="请选择">
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-input>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="width: 115px;">搜索</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd" style="margin-left: 10px; width: 92px;">添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80px"
                       :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色编码" min-width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色备注" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" sortable="custom" min-width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            <span v-if="row.state===0">禁用</span>
            <span v-else-if="row.state===1">启用</span>
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
                <el-checkbox v-model="tableColumnChecked">角色名称</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">角色编码</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">角色备注</el-checkbox>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-checkbox v-model="tableColumnChecked">状态</el-checkbox>
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

          <router-link :to="'/system/sys-role-menu/'+row.id">
            <el-link type="primary" @click="handUpdate(row.id)">权限设置</el-link>
          </router-link>

          <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
          <el-link type="danger" @click="handleDelete(row.id, row.name)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageIndex"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"/>

    <sys-role is-detail ref="detailPage"></sys-role>
    <sys-role is-add ref="addPage" @change="getList"></sys-role>
    <sys-role is-update ref="updatePage" @change="getList"></sys-role>

  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'

  import SysRole from './components/sys-role'

  import sysRoleApi from '@/api/system/sys-role-api'

  export default {
    name: 'SysRoleList',
    components: { SysRole, Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        if (status === 0) {
          return "info";
        } else if (status === 1) {
          return "success";
        } else if (status === 2) {
          return "warning";
        }
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
          name: null,
          code: null,
          state: null,
          pageSorts: []
        },
        stateOptions: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 }
        ],
        tableColumnChecked: null,
        searchColumn: 'keyword',
        searchValue: null,
        searchOptions: [
          { label: '全部', value: 'keyword' },
          { label: '角色名称', value: 'name' },
          { label: '角色编码', value: 'code' }
        ],
        createTimeRange: null,
        showReviewer: true,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        downloadLoading: false
      }
    },
    created() {
      this.setDefaultSort()
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        sysRoleApi.getPageList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        });
      },
      handleFilter() {
        this.listQuery.pageIndex = 1
        this.listQuery.keyword = null;
        this.listQuery.name = null;
        this.listQuery.code = null;
        this.listQuery[this.searchColumn] = this.searchValue;
        this.getList()
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
        this.dialogStatus = 'create'
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
      handleDelete(id, name) {
        this.$confirm('您确定要删除 ' + name + ' ?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sysRoleApi.delete(id).then(response => {
            if (response.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.handleFilter()
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  #sys-role-list {
  }

  #sys-role-list .el-table th {
    padding: 6px 0px;
  }

  #sys-role-list .el-table td {
    padding: 8px 0px;
    /*border: 1px solid red;*/
  }

  #sys-role-list .filter-container {
    /*border: 1px solid red;*/
    /*padding-bottom: 10px;*/
  }

  #sys-role-list .input-with-select {
    /*border: 1px solid red;*/
    /*vertical-align: top;*/
    width: 505px;
    margin-right: 4px;
  }

  #sys-role-list .input-with-select .el-select .el-input {
    width: 120px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  #sys-role-list .filter-item {
    margin-right: 4px;
    /*border: 1px solid red;*/
    vertical-align: baseline;
  }

  #sys-role-list .el-table__body .operation .cell {
    /*border: 1px solid blue;*/
    text-align: center;
  }

</style>
