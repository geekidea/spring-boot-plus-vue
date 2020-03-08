<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    custom-class="page-dialog sys-role-dialog"
  >
    <el-form
      ref="sysRoleForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="80px"
      class="page-form"
      style="width: 100%;">

      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" :readonly="isDetail"/>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code"  :readonly="isDetail"/>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state" :disabled="isDetail">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" :readonly="isDetail"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="isDetail">
        <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
      </template>
      <template v-else-if="isAdd">
        <el-button @click="restForm()">取消</el-button>
        <el-button type="primary" @click="submitAddForm()">保存</el-button>
      </template>
      <template v-else-if="isUpdate">
        <el-button @click="restForm()">取消</el-button>
        <el-button type="primary" @click="submitUpdateForm()">修改</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
  import sysRoleApi from '@/api/system/sys-role-api'

  export default {
    name: 'SysRole',
    props: {
      // detail: 详细页面，add: 添加页面，update：编辑页面
      isDetail: {
        type: Boolean,
        default: false
      },
      isAdd: {
        type: Boolean,
        default: false
      },
      isUpdate: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        dialogTitle: null,
        form: {
          id: null,
          name: null,
          code: null,
          remark: null,
          state: 1
        },
        updateId: null,
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 4, max: 16, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入角色编码', trigger: 'blur' },
            { min: 4, max: 10, message: '长度在 4 到 20 个字符', trigger: 'blur' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
      }
    },
    computed: {},
    created() {

    },
    methods: {
      handle(id) {
        // alert(111)
        if (this.isDetail) {
          console.log('detail...' + id)
          this.rules = null;
          this.dialogTitle = '系统角色详情';
          this.getRoleDetail(id);
        } else if (this.isAdd) {
          console.log('add...')
          this.dialogTitle = '新增系统角色';
        } else if (this.isUpdate) {
          console.log('update...')
          this.dialogTitle = '修改系统角色';
          this.updateId = id;
          this.getRoleDetail(id);
        }
        this.dialogVisible = true
      },
      submitAddForm() {
        this.$refs.sysRoleForm.validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.addRole()
            // this.$emit("getList")
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      submitUpdateForm() {
        this.$refs.sysRoleForm.validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.updateRole()
            // this.$emit("getList")
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      getRoleDetail(id) {
        sysRoleApi.detail(id).then(response => {
          if (response.code === 200) {
            this.form = response.data;
          }
        });
      },
      addRole() {
        const addParam = {
          name: this.form.name,
          code: this.form.code,
          remark: this.form.remark,
          state: this.form.state
        }
        console.log(addParam)
        sysRoleApi.add(addParam).then(response => {
          if (response.code === 200) {
            this.restForm();
            this.$message({
              message: '保存系统角色成功',
              type: 'success'
            })
            this.$emit('change')
          }
        })
      },
      updateRole() {
        const updateParam = {
          id: this.updateId,
          name: this.form.name,
          code: this.form.code,
          remark: this.form.remark,
          state: this.form.state
        }
        sysRoleApi.update(updateParam).then(response => {
          if (response.code === 200) {
            this.restForm();
            this.$message({
              message: '修改系统角色成功',
              type: 'success'
            })
            this.$emit('change')
          }
        })
      },
      restForm() {
        this.$refs.sysRoleForm.resetFields()
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss">
  .sys-role-dialog{
    margin-top: 130px !important;
  }
</style>

<style lang="scss" scoped>

</style>
