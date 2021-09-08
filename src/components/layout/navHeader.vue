<template>
  <div class="head-container">
    <div class="left-part">
      <hamberger :toggle-click="flagClick" :is-active="!state.isCollapse" class="hamburger-container"></hamberger>
      <breadcrumb></breadcrumb>
    </div>
    <ul class="account-list">
      <li><span>欢迎您，{{username}}</span></li>
      <li><span @click.stop="logOut()">退出登录</span></li>
    </ul>

    <el-dialog title="修改密码" :visible.sync="passVisible" top="10vh" :close-on-click-modal="false" width="500px">
      <el-form :model="passForm" ref="passForm" :rules="rules" label-width="100px" size="small">
        <el-row>
          <el-col :span="20">
            <el-form-item label="旧密码：" prop="oldPassword">
              <el-input type="password" v-model="passForm.oldPassword" placeholder="请输入新密码" class="diaInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="新密码：" prop="newPassword">
              <el-input type="password" v-model="passForm.newPassword" placeholder="请输入新密码" class="diaInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="确认密码：" prop="confirmPass">
              <el-input type="password" v-model="passForm.confirmPass" placeholder="请再次输入新密码" class="diaInput"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="myPrimary" @click="submitChanePass('passForm')">确定</el-button>
        <el-button size="small" type="myCancel" @click="passVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {myPost,base_url} from '@/api/http'
import store from '@/utils/store'
import breadcrumb from '@/components/layout/breadcrumb'
import hamberger from '@/components/hamberger/hamberger'
export default {
  data() {
    var checkconfirmPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("确认密码不能为空"));
      }
      if (value!==this.passForm.password) {
        callback(new Error("确认密码必须与新密码一致"))
      }
      else {
        callback();
      }
    }
    return {
      state: store.state,
      header:{
        Token:sessionStorage.getItem("Token")
      },
      isCollapse: false,
      roleIds: [],
      passVisible:false,
      username:"",
      passForm:{
        oldPassword: '',
        newPassword: '',
        confirmPass: ''
      },
      rules: {
        oldPassword: [{required: true, message: '旧密码不能为空', trigger: 'blur'},
        { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }],
        newPassword: [{required: true, message: '新密码不能为空', trigger: 'blur'},
        { min: 6, max: 16, message: '密码长度在6到16个字符', trigger: 'blur' }],
        confirmPass: [{required: true,validator: checkconfirmPass,trigger: 'blur'}],
      }
    }
  },
  components: {breadcrumb,hamberger},
  created(){
    const accountInfo = JSON.parse(sessionStorage.getItem('accountInfo'))
    this.username = accountInfo.username
  },
  methods:{
    flagClick() {
      this.isCollapse = !this.isCollapse
      if(this.isCollapse) {
        store.setAsideWidthAction('64px')
      }
      else {
        store.setAsideWidthAction('180px')
      }
      store.setCollapseAction(this.isCollapse)
    },
    logOut(){
      this.$confirm('是否退出登录?', '提示', {
      confirmButtonClass: "el-button--myPrimary",
      type: 'warning'
      })
      .then(() => {
        this.$message({
        type: 'success',
        message: '退出登录成功，请重新登录!'
        })
        this.$router.push({ path: '/login' })
      })
      .catch(() => {
        this.$message({
        type: 'info',
        message: '已取消退出登录'
        }) 
      })
    },
    changePassword(){
      this.passForm.oldPass = ''
      this.passForm.password = ''
      this.passForm.confirmPass = ''
      this.passVisible = true
    },    
    submitChanePass(formName){
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/login/edit/password",this.passForm)
          .then(res =>{
            this.$message.success("修改密码成功")
            this.passVisible = false;
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .head-container {
    height: 100%;
    width: 100%;
    /* background-color: #0AAFE7; */
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .hamburger-container {
    /* line-height: 46px; */
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
  }
  .hamburger-container:hover {
    background: rgba(0, 0, 0, .025)
  }
  .left-part {
    width: 50%;
    display: flex;
  }
  .account-list {   
    height: 40px;
    /* width: 400px; */
    padding: 0 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
  }
  .account-list li {
    padding-left: 15px;
  }
  .account-list li:last-child {
    padding-right: 15px;
    color: #0090FF;
    cursor: pointer;
  }
  .account-list li p{
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }
  .avatar,.avatar img {
    height: 36px;
    width: 36px;
  }
  .avatar {
    border-radius: 50%;
    overflow: hidden;
    position: relative;
  }
  .item {
    height: 40px;
  }
  .bell-icon {
    margin-top: 7px;
  }
  .notice {
    padding-right: 15px;
  }
  .notice,.avatar,.power-item {
    cursor: pointer;
  }
  .logo-list {
    width: 100%;
    height: 100%;
    padding: 0 20px 0 180px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo {
    /* width: 50px; */
    height: 40px;
    overflow: hidden;
    /* background-color: #0AAFE7; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .logo img {
    height: 35px;
  }
  .pic-container {
    display: flex;
  }
  .el-icon-arrow-down {
    font-size: 12px;
    color: #333;
    font-weight: 600;
    position: absolute;
    top: 12px;
    left: 40px;
  }
</style>

<style>
  .el-badge__content.is-fixed {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
