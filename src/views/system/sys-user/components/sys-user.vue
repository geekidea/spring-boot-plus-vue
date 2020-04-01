<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    custom-class="page-dialog sys-user-dialog"
  >
    <el-form
      ref="sysUserForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="80px"
      class="page-form"
      style="width: 100%;"
    >

      <el-form-item label="用户账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户账号" clearable :readonly="!isAdd" />
      </el-form-item>
      <el-form-item label="用户名称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输入用户名称" clearable :readonly="isDetail" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" clearable :readonly="isDetail" />
      </el-form-item>
      <el-form-item v-if="isAdd" label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="部门" prop="departmentId">
        <tree-select
          :data="treeSelectData"
          :disabled="isDetail"
          :select-key.sync="form.departmentId"
          :select-label.sync="departmentName"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" filterable class="filter-item" placeholder="请选择" style="width: 100%" :disabled="isDetail">
          <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state" :disabled="isDetail">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="2">锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注" :readonly="isDetail" />
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
  import sysUserApi from '@/api/system/sys-user-api'
  import sysDepartmentApi from '@/api/system/sys-department-api'
  import sysRoleApi from '@/api/system/sys-role-api'
  import TreeSelect from '@/components/TreeSelect'

  export default {
    name: 'SysUser',
    components: { TreeSelect },
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
          username: null,
          nickname: null,
          phone: null,
          gender: null,
          head: null,
          remark: null,
          state: 1,
          departmentId: null,
          roleId: null,
          deleted: null
        },
        departmentName: null,
        updateId: null,
        departmentOptions: null,
        roleOptions: null,
        treeSelectData: null,
        rules: {
          username: [
            { required: true, message: '请输入用户账号', trigger: 'blur' },
            { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '长度11个字符', trigger: 'blur' }
          ],
          departmentId: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ],
          roleId: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          remark: [
            { max: 100, message: '长度100个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {},
    created() {

    },
    mounted() {

    },
    methods: {
      handle(id) {
        if (this.isDetail) {
          this.rules = null;
          this.dialogTitle = '系统用户详情';
          this.getUserDetail(id);
        } else if (this.isAdd) {
          this.dialogTitle = '新增系统用户';
          this.getDepartmentTree()
          this.getRoleList()
        } else if (this.isUpdate) {
          this.dialogTitle = '修改系统用户';
          this.updateId = id;
          this.getUserDetail(id);
          this.getDepartmentTree()
          this.getRoleList()
        }
        this.dialogVisible = true
      },
      getDepartmentTree() {
        sysDepartmentApi.getDepartmentTree().then(response => {
          this.treeSelectData = response.data;
        });
      },
      getRoleList() {
        sysRoleApi.getList().then(response => {
          this.roleOptions = response.data;
          console.log(this.roleOptions)
        });
      },
      submitAddForm() {
        console.log("form...")
        console.log(this.form.departmentId)
        console.log(this.departmentName)
        this.$refs.sysUserForm.validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.addUser()
            // this.$emit("getList")
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      submitUpdateForm() {
        this.$refs.sysUserForm.validate((valid) => {
          if (valid) {
            console.log('submit!')
            this.updateUser()
            // this.$emit("getList")
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      getUserDetail(id) {
        sysUserApi.detail(id).then(response => {
          if (response.code === 200) {
            this.form = response.data;
            if (this.isDetail) {
              this.form.roleId = response.data.roleName
            }
            this.departmentName = response.data.departmentName
          }
        });
      },
      addUser() {
        console.log(this.form)
        const addParam = {
          username: this.form.username,
          nickname: this.form.nickname,
          phone: this.form.phone,
          password: this.form.password,
          remark: this.form.remark,
          state: this.form.state,
          departmentId: this.form.departmentId,
          roleId: this.form.roleId
        }
        sysUserApi.add(addParam).then(response => {
          if (response.code === 200) {
            this.restForm();
            this.$message({
              message: '保存系统用户成功',
              type: 'success'
            })
            this.$emit('change')
          }
        })
      },
      updateUser() {
        const updateParam = {
          id: this.updateId,
          nickname: this.form.nickname,
          phone: this.form.phone,
          remark: this.form.remark,
          state: this.form.state,
          departmentId: this.form.departmentId,
          roleId: this.form.roleId
        }
        sysUserApi.update(updateParam).then(response => {
          if (response.code === 200) {
            this.restForm();
            this.$message({
              message: '修改系统用户成功',
              type: 'success'
            })
            this.$emit('change')
          }
        })
      },
      restForm() {
        this.$refs.sysUserForm.resetFields()
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss">
  .sys-user-dialog {
    margin-top: 40px !important;
  }
</style>

<style lang="scss" scoped>

</style>
