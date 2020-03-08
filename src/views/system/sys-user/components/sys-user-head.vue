<template>
  <div>
    <el-dialog
      title="上传头像"
      :visible.sync="dialogVisible"
      width="500px">
      <div class="upload-container">
        <p class="img-container" clearable>
          <img class="head" :src="imageUrl" alt="">
        </p>
        <el-upload
          ref="upload"
          name="img"
          class="upload-demo"
          drag
          action=""
          :multiple="false"
          :auto-upload="false"
          :file-list="uploadFileList"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/jpg"
          :http-request="handleUpload"
          :before-upload="handleBeforeUpload"
          :on-change="handleChange"
          :on-error="handleError">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import sysUserApi from '@/api/system/sys-user-api'
  import uploadApi from '@/api/system/upload-api'

  export default {
    name: 'SysUserHead',
    data() {
      return {
        dialogVisible: false,
        id: null,
        imageUrl: null,
        uploadFileList: []
      }
    },
    created() {

    },
    watch: {
      dialogVisible() {
        if (!this.dialogVisible) {
          this.uploadFileList = []
        }
      }
    },
    methods: {
      handle(id, head) {
        this.id = id;
        this.imageUrl = head;
        console.log(this.id);
        console.log(this.imageUrl);
        this.dialogVisible = true;
      },
      handleChange(file, fileList) {
        // 将最后一个选择的文件赋值给文件列表
        if (fileList && fileList.length > 1) {
          fileList = [file]
        }
        this.uploadFileList = fileList
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleError() {
        this.$message({
          message: '上传错误',
          type: 'error'
        })
      },
      handleBeforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('头像大小不能超过 2MB!')
        }
        return isLt2M
      },
      submitForm() {
        if (this.uploadFileList.length === 0) {
          this.$message({
            message: '请选择文件',
            type: 'error'
          })
        }
        this.$nextTick(() => {
          this.$refs.upload.submit()
        })
      },
      resetForm() {
        this.dialogVisible = false
        this.uploadFileList = []
        this.$nextTick(() => {
          this.$refs.upload.clearFiles()
        })
      },
      handleUpload(param) {
        const formData = new FormData()
        formData.append("file", param.file)
        formData.append("type", 'head')
        // 文件上传后，调用修改用户头像方法
        uploadApi.upload(formData).then(response => {
          if (response.code === 200) {
            this.imageUrl = response.data
          } else {
            throw response.message
          }
        }).then(() => {
          // 修改头像
          sysUserApi.uploadHead({
            id: this.id,
            head: this.imageUrl
          }).then(response => {
            if (response && response.code === 200) {
              this.$message({
                message: '上传头像成功',
                type: 'success'
              })
              this.resetForm()
              this.$emit('change')
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
  .upload-container {
    padding: 0px 20px;
  }

  .img-container {
    width: 100%;
    text-align: center;
    padding: 0px;
    margin: 0px 0px 20px 0px;
  }

  .head {
    width: 100px;
    max-height: 100px;
  }

</style>
