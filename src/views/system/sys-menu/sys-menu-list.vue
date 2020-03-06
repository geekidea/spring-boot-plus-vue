<template>
  <div id="sys-menu-list" class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleExpandAll">折叠/展开</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="handleAdd" style="margin-left: 10px; width: 92px;">添加</el-button>
    </div>

    <el-table
      :data="tableData"
      type="selection"
      ref="menuTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      @row-click="handleRowClick"
      border
      :default-expand-all="expandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="id"
        label="编号"
        width="130">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称"
        min-width="210"
        class-name="menu-name">
        <template slot-scope="{row}">
          <i :class="row.icon"></i>
          {{row.name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="菜单类型"
        min-width="100"
        align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            <span v-if="row.type===1">菜单</span>
            <span v-else-if="row.type===2">按钮</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="菜单编码"
        min-width="210px">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单路径"
        min-width="210px">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        max-width="100px"
        align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.state | stateFilter">
            <span v-if="row.state===1">启用</span>
            <span v-else-if="row.state===0">禁用</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        max-width="100px"
        align="center">
      </el-table-column>

      <el-table-column label="操作" align="center" width="160" class-name="operation">
        <template slot-scope="{row}">
          <el-link type="primary" @click="handDetail(row.id)">详情</el-link>
          <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
          <el-link type="danger" @click="handleDelete(row.id, row.username)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <sys-menu is-detail ref="detailPage"></sys-menu>
    <sys-menu is-add ref="addPage"></sys-menu>
    <sys-menu is-update ref="updatePage"></sys-menu>

  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive

  import sysPermissionApi from '@/api/system/sys-permission-api.js'
  import SysMenu from './components/sys-menu'

  export default {
    name: 'SysMenuList',
    components: { SysMenu },
    directives: { waves },
    filters: {
      typeFilter(type) {
        if (type === 1) {
          return 'success'
        } else if (type === 2) {
          return 'info'
        }
      },
      stateFilter(state) {
        if (state === 0) {
          return 'info'
        } else if (state === 1) {
          return 'success'
        }
      }
    },
    data() {
      return {
        expandAll: true,
        expandRow: {},
        // 获取row的key值
        getRowKeys(row) {
          return row.id;
        },
        // 要展开的行，数值的元素是row的key值
        expands: [],
        tableData: null,
        tableRowData: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageIndex: 1,
          pageSize: 10,
          keyword: null,
          username: null,
          nickname: null,
          roleId: null,
          state: null,
          createTimeStart: null,
          createTimeEnd: null,
          pageSorts: [{
            column: 'id',
            asc: false
          }]
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
      this.getList()
    },
    methods: {
      handleExpandAll() {
        // 如果当前是展开，则设置为折叠，反之亦然
        this.expandAll = !this.expandAll
        if (this.tableRowData) {
          this.tableRowData.forEach(row => {
            this.$refs.menuTable.toggleRowExpansion(row, this.expandAll)
          })
        }
      },
      getList() {
        this.listLoading = true
        sysPermissionApi.getAllMenuTree().then(response => {
          this.tableData = response.data
          this.listLoading = false
          // 获取一级/二级菜单对象
          if (this.tableData) {
            this.tableData.forEach(row => {
              this.tableRowData.push(row);
              if (row.children && row.children.length > 0) {
                row.children.forEach(r => {
                  this.tableRowData.push(r);
                })
              }
            })
            console.log(this.tableRowData)
          }
        })
      },
      handleRowClick(row, column, event) {
        // const expandState = this.expandRow[row.id];
        // if (expandState === undefined) {
        //   this.expandRow[row.id] = !this.expandAll;
        // } else {
        //   this.expandRow[row.id] = !expandState;
        // }
        // this.$refs.menuTable.toggleRowExpansion(row, this.expandRow[row.id]);
      },
      handleFilter() {
        // this.$refs.sysUserAdd.showxxx(666);
        this.listQuery.pageIndex = 1
        console.log('search...')
        console.log(this.listQuery)
        console.log(this.searchColumn)
        console.log(this.searchValue)
        this.listQuery.keyword = null
        this.listQuery.username = null
        this.listQuery.nickname = null
        this.listQuery[this.searchColumn] = this.searchValue
        this.getList()
      },
      handleCreateTimeFilter() {
        console.log(this.createTimeRange)
        if (this.createTimeRange) {
          this.listQuery.createTimeStart = this.createTimeRange[0]
          this.listQuery.createTimeEnd = this.createTimeRange[1]
          console.log(this.listQuery.createTimeStart)
          console.log(this.listQuery.createTimeEnd)
          this.handleFilter()
        }
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        } else if (prop === 'createTime') {
          this.sortByCreateTime(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.pageSorts = [{
            column: 'id',
            asc: true
          }]
        } else {
          this.listQuery.pageSorts = [{
            column: 'id',
            asc: false
          }]
        }
        this.handleFilter()
      },
      sortByCreateTime(order) {
        if (order === 'ascending') {
          this.listQuery.pageSorts = [{
            column: 'create_time',
            asc: true
          }]
        } else {
          this.listQuery.pageSorts = [{
            column: 'create_time',
            asc: false
          }]
        }
        this.handleFilter()
      },
      handleAdd(event) {
        this.dialogStatus = 'create'
        this.$nextTick(() => {
          this.$refs.addPage.handle()
          // this.$refs['dataForm'].clearValidate()
        })
      },
      handDetail(id) {
        this.$nextTick(() => {
          this.$refs.detailPage.handle(id)
        })
      },
      handUpdate(id) {
        this.$nextTick(() => {
          this.$refs.updatePage.handle(id)
        })
      },
      handleDelete(id, username) {
        this.$confirm('您确定要删除 ' + username + ' ?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      getSortClass: function(key) {
        const sort = this.listQuery.sort
        return sort === `+${key}` ? 'ascending' : 'descending'
      }
    }
  }
</script>

<style lang="scss">
  #sys-menu-list {
  }

  #sys-menu-list .el-table th {
    padding: 6px 0px;
  }

  #sys-menu-list .el-table td {
    padding: 8px 0px;
    /*border: 1px solid red;*/
  }

  #sys-menu-list .filter-container {
    /*border: 1px solid red;*/
    /*padding-bottom: 10px;*/
  }

  #sys-menu-list .input-with-select {
    /*border: 1px solid red;*/
    /*vertical-align: top;*/
    width: 505px;
    margin-right: 4px;
  }

  #sys-menu-list .input-with-select .el-select .el-input {
    width: 120px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  #sys-menu-list .filter-item {
    margin-right: 4px;
    /*border: 1px solid red;*/
    vertical-align: baseline;
  }

  #sys-menu-list .el-table__body .operation .cell {
    /*border: 1px solid blue;*/
    text-align: center;
  }

  #sys-menu-list .el-table__row--level-1 .menu-name .cell {
    border: 0px solid red !important;
    padding-left: 25px !important;
  }

  #sys-menu-list .el-table__row--level-2 .menu-name .cell {
    border: 0px solid blue !important;
    padding-left: 40px !important;
  }
</style>
