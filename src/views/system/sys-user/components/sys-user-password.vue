<template>
  <el-dialog
    title="重置密码"
    :visible.sync="dialogVisible"
    custom-class="page-dialog sys-user-password-dialog"
  >
    <el-form
      ref="sysUserPasswordForm"
      :rules="rules"
      :model="form"
      label-position="right"
      label-width="100px"
      class="page-form"
      style="width: 100%;">

      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" clearable autocomplete="off" show-password/>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" placeholder="请输入确认密码" clearable autocomplete="off" show-password/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="restForm()">取消</el-button>
      <el-button type="primary" @click="submitForm()">修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import sysUserApi from '@/api/system/sys-user-api'

  export default {
    name: 'SysUserPassword',
    data() {
      return {
        dialogVisible: false,
        form: {
          password: null,
          confirmPassword: null
        },
        updateId: null,
        rules: {
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {},
    created() {

    },
    methods: {
      handle(id) {
        this.updateId = id;
        this.dialogVisible = true
      },
      submitForm() {
        this.$refs.sysUserPasswordForm.validate((valid) => {
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
      updateUser() {
        console.log(this.form)
        const updateParam = {
          id: this.updateId,
          nickname: this.form.nickname,
          phone: this.form.phone,
          remark: this.form.remark,
          state: this.form.state,
          departmentId: this.form.departmentId,
          roleId: this.form.roleId
        }
        console.log(updateParam)
        sysUserApi.update(updateParam).then(response => {
          if (response.code === 200) {
            console.log('update response')
            // {code: 200, msg: "操作成功", success: true, data: null, time: "2020-02-26 11:25:02"}
            console.log(response)
            this.restForm();
            this.$message({
              message: '修改系统用户成功',
              type: 'success'
            })
            this.$emit('getList')
          }
        })
      },
      restForm() {
        this.$refs.sysUserPasswordForm.resetFields()
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss">
  .sys-user-password-dialog {
    margin-top: 150px !important;
  }
</style>

