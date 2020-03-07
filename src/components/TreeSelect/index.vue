<template>
  <div class="tree-select-container">
    <el-select
      v-model="selectLabel"
      class="tree-select-item"
      placeholder="请选择"
      :disabled="disabled"
      popper-class="select-option"
      :popper-append-to-body="false"
      v-popover:tree-select-popover
      style="width: 100%"></el-select>
    <el-popover
      ref="tree-select-popover"
      v-model="visible"
      :disabled="disabled"
      placement="bottom-start"
      popper-class="tree-select-popper"
      :visible-arrow="false"
      trigger="click">
      <el-input
        v-if="showFilterInput"
        class="tree-select-filter-input"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        clearable>
      </el-input>
      <el-tree
        ref="tree"
        :data="data"
        :props="props"
        :node-key="nodeKey"
        :filter-node-method="filterNode"
        highlight-current
        @current-change="handleChange"
        :default-checked-keys="checkedKeys"
        :expand-on-click-node="false"
        default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span style="border: 0px solid red;">
          <i :class="data.icon"></i>
          {{ node.label }}
        </span>
      </span>
      </el-tree>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: "TreeSelect",
    props: {
      data: {
        type: Array,
        default: null
      },
      props: {
        type: Object,
        default() {
          return { label: 'name', children: 'children' }
        }
      },
      showFilterInput: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        nodeKey: 'id',
        valueId: null,
        filterText: '',
        checkedKeys: [1],
        visible: false,
        selectLabel: null
      }
    },
    created() {

    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleChange(data, node) {
        this.visible = false
        this.selectLabel = node.label
        this.$emit('getValue', data, node)
      },
      setValue(id, name) {
        this.selectLabel = name
      }
    }
  }
</script>

<style>
  .tree-select-container {

  }
  .tree-select-container .select-option{
    display: none !important;
  }

  .tree-select-popper{
    /*border: 1px solid red;*/
    /*width: 100% !important;*/
    width: 300px !important;
  }
  .tree-select-filter-input{
    margin-bottom: 6px;
  }



</style>
