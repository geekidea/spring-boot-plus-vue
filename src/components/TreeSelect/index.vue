<template>
  <div class="tree-select-item">
    <el-select
      v-model="selectNodeLabel"
      class="tree-select"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      popper-class="select-option"
      :popper-append-to-body="false"
      v-popover:tree-select-popover
      @clear="handleClear"
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
      },
      selectKey: {
        type: Number,
        default: null
      },
      selectLabel: {
        type: String,
        default: null
      },
      placeholder: {
        type: String,
        default: "请选择"
      },
      clearable: {
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
        selectNodeKey: null,
        selectNodeLabel: null
      }
    },
    created() {

    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      selectKey() {
        this.selectNodeKey = this.selectKey
      },
      selectLabel() {
        this.selectNodeLabel = this.selectLabel
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleChange(data, node) {
        this.visible = false
        this.selectNodeKey = node.key
        this.selectNodeLabel = node.label
        this.$emit('update:selectKey', this.selectNodeKey)
        this.$emit('update:selectLabel', this.selectNodeLabel)
        this.$emit('change', data, node)
      },
      handleClear() {
        this.visible = false
        this.selectNodeKey = null
        this.selectNodeLabel = null
        this.filterText = null
        this.$emit('update:selectKey', null)
        this.$emit('update:selectLabel', null)
        this.$emit('change', null, null)
      },
      setValue(key, label) {
        this.selectNodeKey = key
        this.selectNodeLabel = label
      }
    }
  }
</script>

<style>
  .tree-select-item {

  }
  .tree-select-item .select-option{
    display: none !important;
  }

  .tree-select-popper{
    /*border: 1px solid red;*/
    /*width: 100% !important;*/
    width: 200px !important;
  }
  .tree-select-filter-input{
    margin-bottom: 6px;
  }



</style>
