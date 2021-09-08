<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container" >
        <div class="password-container">
          <el-form :model="form" ref="form" label-width="80px" size="small">
            <el-row>
              <el-col :span="24">
                <el-form-item label="旧密码：">
                  <el-input v-model="form.oldPassword" placeholder="请输入旧密码" show-password class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="新密码：">
                  <el-input v-model="form.newPassword"  placeholder="请输入新密码" show-password class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="确认密码：">
                  <el-input v-model="form.confirmPassword" placeholder="请输入确认密码" show-password class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                 <el-button type="primary" size="small" class="confirmButton" @click="confirm()">提交</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {myPost } from "@/api/http";
export default {
  data() {
    return {
        form:{
            oldPassword:"",
            newPassword:"",
            confirmPassword:""
        },
        resetForm:{
            oldPassword:"",
            newPassword:"",
            confirmPassword:""
        }
    };
  },
  created() {
  },
  methods: {
      confirm(){
          if(this.form.newPassword != this.form.confirmPassword){
              this.$message.error("两次输入密码不一致")
          }else{
            myPost("/admin/password/edit",this.form).then(res =>{
              this.$message.success("密码修改成功")
              this.form = {...this.resetForm}
            })
          }
          
      }
  }
};
</script>

<style scoped>
  .confirmButton{
    margin-left: 47%;
    width: 100px;
    margin-top: 20px;
  }
  .password-container{
    margin-left: 20%;
    width: 50%;
    margin-top: 50px;
    height: 400px;
  }
  .diaInput {
    width: 100%;
  }
  .course_time {
    text-decoration: underline;
    margin-right: 5px;
    cursor: pointer;
  }
  .rest_time,.hour_form {
    font-size: 12px;
  }
  .time_hour {
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .hour_form {
    display: flex;
    align-items: center;
    padding: 5px 0;
    background-color: #f2f2f2;
  }
  .imgUrl-uploader-icon {
    font-size: 16px;
    width: 160px;
    height: 90px;
    line-height: 100px;
  }
</style>