<template>
  <div class="login-container">
      <div class="top-part">
        <!-- <img src="@/assets/image/logo1.png" alt="" height="40px"> -->
      </div>
      <div class="middle-part">
        <div class="login-form-container" >
          <p>账号登录</p>
          <!-- <p v-show="!flag">选择园区</p> -->
          <el-form class="login-form first" :model="loginForm" ref="loginForm">
            <el-form-item prop="username">
              <svg-icon icon-class="login" class="icon-opera"></svg-icon>
              <el-input type="text"  placeholder="请输入账号名或手机号" v-model="loginForm.account"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <svg-icon icon-class="password" class="icon-opera"></svg-icon>
              <el-input type="password"  placeholder="请输入密码" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item class="login-button">
              <el-button style="width:100%" type="primary"  @click="userLogin('loginForm')">登录</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-form v-show="!flag" class="login-form second" :model="loginForm" ref="loginForm">
            <el-form-item prop="park">
              <el-select placeholder="请选择园区" v-model="loginForm.park" filterable style="width:100%;">
                <el-option v-for="item in parkList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="login-button">
              <el-button style="width:100%" type="myLogin" @click="parkLogin('loginForm')">确定</el-button>
            </el-form-item>
          </el-form> -->
        </div>
      </div>
      <div class="bottom-part">
        <span>艾伯特小程序管理后台</span>
        <span>版权所有</span>
      </div>
  </div>
</template>

<script>
import { myGet,myPost,login } from "@/api/http";
export default {
  data() {
    return {
      // flag: true,
      loginForm:{
        account: '',
        password: '',
        park: ''
      },
      // parkList: [],
    };
  },
  created() {
    sessionStorage.removeItem('Token')
    sessionStorage.setItem('isLogin',false)
  },
  methods: {
    // 登录
    userLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          login(
            '/admin/login',
            {
              account: this.loginForm.account,
              password: this.loginForm.password
            }
          )
          .then(res => {
            if(res.data.code == 200){
              // 将唯一标识储存起来
              sessionStorage.setItem('Token', res.data.data);
              myPost('/admin/userInfo')
              .then(res => {
                if(res.data.data) {
                  //是否登录判断标识
                  sessionStorage.setItem('isLogin',true)   
                  sessionStorage.setItem('accountInfo', JSON.stringify(res.data.data))
                  if(this.$route.fullPath==='/login') {
                    var role = res.data.data.adminRole
                    if(role == 'CLASS_ADVISOR' || role == 'PARENT'){
                      this.$router.push({ path: '/normal_operate/student' })
                    }else if(role == 'TEACHER'){
                      this.$router.push({ path: '/normal_operate/courseware' })
                    }else{
                      this.$router.push({ path: '/normal_operate' })
                    }
                  }
                  else {
                    this.$router.push({ path: this.$route.query.redirect})
                  }
                } 
                else {
                  this.$alert('账号名或密码错误','警告',{
                    confirmButtonClass: "el-button--myPrimary",
                    type: "warning"
                  })
                }
              })
            }
            else {
              this.$alert(res.data.message,'警告',{
                confirmButtonClass: "el-button--myPrimary",
                type: "warning"
              })
            }
          })
        }
      }) 
    }
  }

};
</script>

<style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 30px 0 20px;
    box-sizing: border-box;
    background: url('../../assets/image/loginbg.jpg') no-repeat top left;
    background-size: cover;
  }
  .top-part {
    text-align: center;
    color: #fff;
  }
  .top-part span {
    padding-left: 20px;
    font-size: 20px;
  }
  .middle-part {
    display: flex;
    justify-content: flex-end;
    padding-right: 100px;
  }
  .login-form-container {
    /* position: relative; */
    background-color: #fff;
    z-index: 999;
    width: 400px;
    padding: 30px;
    box-sizing: border-box;
    box-shadow: 0px 30px 30px 0px rgba(0, 0, 0, 0.5);
  }
  .bottom-part {
    font-size: 12px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .bottom-part span {
    line-height: 20px;
  }
  /* .login-form {
    padding-right: 20px;
    border-right: 1px dashed #979797;
  } */
  .login-button {
    margin-top: 65px;
  }
  p {
    text-align: center;
    font-weight: 600;
    color: #0462BA;
  }
</style>
<style>
  .login-container .first .el-input__inner {
    border-left: 0px solid #fff;
    border-right: 0px solid #fff;
    border-top: 0px solid #fff;
    border-bottom: 1px solid #e5e5e5;
    border-radius: 0px;
  }
  .login-container .el-form-item__content {
    display: flex;
    align-items: center;
  }
</style>