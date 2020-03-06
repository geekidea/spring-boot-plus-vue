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
          name="img"
          class="upload-demo"
          drag
          :auto-upload="false"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/jpg"
          action="http://localhost:8888/api/upload/"
          :on-change="handleHeadPreview">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'SysUserHead',
    data() {
      return {
        dialogVisible: false,
        id: null,
        imageUrl: null
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
      handleHeadPreview(file, fileList) {
        console.log(file)
        console.log(fileList)
        console.log(file.url)
        this.imageUrl = URL.createObjectURL(file.raw);
        this.dialogVisible = true;
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>

  .upload-container {
    /*border: 1px solid red;*/
    padding: 0px 20px;
  }

  .img-container {
    width: 100%;
    text-align: center;
    padding: 0px;
    margin: 0px 0px 20px 0px;
    /*border: 1px solid red;*/
  }

  .head {
    width: 100px;
  }


</style>
