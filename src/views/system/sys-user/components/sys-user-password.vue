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

      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" placeholder="请输入新密码" clearable autocomplete="off" show-password/>
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
      const validPassword = (rule, value, callback) => {
        const reg = /^[0-9a-zA-Z_]{6,16}$/
        if (!reg.test(value)) {
          callback(new Error('密码只能输入字母数字下划线'))
        } else {
          callback()
        }
      };
      const validConfirmPassword = (rule, value, callback) => {
        if (this.form.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      };

      return {
        dialogVisible: false,
        form: {
          newPassword: null,
          confirmPassword: null
        },
        updateId: null,
        rules: {
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
            { validator: validPassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请输入确认新密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
            { validator: validPassword, trigger: 'blur' },
            { validator: validConfirmPassword, trigger: 'blur' }
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
            this.resetPassword()
          } else {
            console.log('error submit!!')
            return false
          }
        });
      },
      resetPassword() {
        const updateParam = {
          userId: this.updateId,
          newPassword: this.form.newPassword,
          confirmPassword: this.form.confirmPassword
        }
        sysUserApi.resetPassword(updateParam).then(response => {
          if (response.code === 200) {
            this.restForm();
            this.$message({
              message: '重置密码成功',
              type: 'success'
            })
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

