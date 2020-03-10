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
          <div class="operation-area" @click.stop>
            <el-link type="primary" @click="handDetail(row.id)">详情</el-link>
            <el-link type="warning" @click="handUpdate(row.id)">修改</el-link>
            <el-link type="danger" @click="handleDelete(row.id, row.name)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <sys-menu is-detail ref="detailPage"></sys-menu>
    <sys-menu is-add ref="addPage" @change="getList"></sys-menu>
    <sys-menu is-update ref="updatePage" @change="getList"></sys-menu>

  </div>
</template>

<script>
  import sysPermissionApi from '@/api/system/sys-permission-api.js'
  import SysMenu from './components/sys-menu'

  export default {
    name: 'SysMenuList',
    components: { SysMenu },
    directives: {  },
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
        tableData: [],
        tableRowData: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleExpandAll() {
        // 如果当前是展开，则设置为折叠，反之亦然
        this.expandAll = !this.expandAll
        this.expandRow = {}
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
          }
        })
      },
      handleRowClick(row, column, event) {
        const expandState = this.expandRow[row.id];
        if (expandState === undefined) {
          this.expandRow[row.id] = !this.expandAll;
        } else if (expandState) {
          this.expandRow[row.id] = false
        } else {
          this.expandRow[row.id] = true;
        }
        this.$refs.menuTable.toggleRowExpansion(row, this.expandRow[row.id]);
      },
      handleFilter() {
        this.getList()
      },
      handleAdd(event) {
        this.$nextTick(() => {
          this.$refs.addPage.handle()
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
      handleDelete(id, name) {
        this.$confirm('您确定要删除 ' + name + ' ?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          sysPermissionApi.delete(id).then(response => {
            if (response.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.handleFilter()
            }
          })
        })
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
  }

  #sys-menu-list .filter-item {
    margin-right: 4px;
    vertical-align: baseline;
  }

  #sys-menu-list .el-table__body .operation {
    padding: 0px;
  }

  #sys-menu-list .el-table__body .operation .cell {
    text-align: center;
    padding: 0px;
  }

  #sys-menu-list .el-table__body .operation .cell .operation-area{
    text-align: center;
    padding: 8px 0px;
    margin: 0px;
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
