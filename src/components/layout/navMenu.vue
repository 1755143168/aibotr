<template>
  <div class="navmenu-container">
    <div style="height:20px"></div>
    <!--<img style="padding-left:15px;" v-if="state.isCollapse" src="@/assets/image/logo.png" alt="" width="24px">
    <img v-else src="@/assets/image/logo.png" alt="" width="160px">
     <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" :collapse="isCollapse" router>
      <template v-for="route in permissions">
        <el-menu-item v-if="route.children[0].path===null" class="onlyFirst" :key="route.path" :index="route.path">
            <svg-icon :icon-class="route.src"></svg-icon>
            <span class="title-name">{{route.remark}}</span>
        </el-menu-item>
      </template>
      <template v-for="route in permissions">
        <el-submenu v-if="route.children[0].path!==null" :key="route.path" :index="route.path" >
          <template slot="title">
            <svg-icon :icon-class="route.src"></svg-icon>
            <span class="title-name">{{route.remark}}</span>
          </template>
          <template v-for="item in route.children">
            <el-menu-item v-if="item.children[0].path===null" :key="item.path" style="padding-left:50px;" :index="item.path">{{item.remark}}</el-menu-item>
            <el-submenu v-if="item.children[0].path!==null" :key="item.path" style="padding-left:10px;"  :index="item.path">
              <template slot="title">{{item.remark}}</template>
              <el-menu-item v-for="element in item.children" style="padding-left:50px;" :key="element.path" :index="element.path">{{element.remark}}</el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu> -->
    <el-menu :default-active="this.$route.path" class="el-menu-vertical-demo" :collapse="state.isCollapse" router :unique-opened="true">
      <el-submenu index="/normal_operate">
        <template slot="title">
          <svg-icon icon-class="home"></svg-icon>
          <span class="title-name">日常运营</span>
        </template>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/normal_operate/infoboard">信息看板</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN' || role == 'CLASS_ADVISOR' || role == 'PARENT'" index="/normal_operate/student">学员管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/normal_operate/class">班级管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/normal_operate/course">课程管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/normal_operate/teacher">教师管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN' || role == 'TEACHER'" index="/normal_operate/courseware">课件管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" index="/normal_operate/fileInfo">文件管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" index="/normal_operate/rollcall">点名统计</el-menu-item>

      </el-submenu>
      <el-submenu index="/sys_config">
        <template slot="title">
          <svg-icon icon-class="sysconfig"></svg-icon>
          <span class="title-name">系统设置</span>
        </template>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/sys_config/notice">通知管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" v-if="role == 'ADMIN'" index="/sys_config/admin">用户管理</el-menu-item>
        <el-menu-item style="padding-left:50px;" index="/sys_config/password">修改密码</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import store from '@/utils/store'
  export default {
    data() {
      return {
        state: store.state,
        myActivePath: '',
        avaterUrl: '',
        isCollapse: false,
        outPermissions: [],
        permissions: [],
        role: '',
      }
    },
    created() {
      // this.myActivePath = this.$route.path
      // if(this.$route.path.indexOf('/sysconfig/role')==1) {
      //   this.myActive = '/sysconfig/role'
      // }
      const accountInfo = JSON.parse(sessionStorage.getItem('accountInfo'))
      this.role = accountInfo.adminRole
      // this.outPermissions = accountInfo.permissions
      // this.getMenu()
    },
    methods: {
      // findSubNodes(id) {
      //   let result = this.outPermissions.filter(item=> item.parentId === id )
      //   result.forEach(ele => {
      //     ele.children = this.findSubNodes(ele.id)
      //   })
      //   return result
      // },  
      // getMenu() {
      //   this.permissions = this.findSubNodes(null)
      //   sessionStorage.setItem('permissions',JSON.stringify(this.permissions))
      // }
    },
  }
</script>

<style scoped>
  .navmenu-container {
    background-color: #001528;
    height: 100%;
    /* overflow: auto; */
    overflow-x: hidden;
    overflow-y: scroll;
    width: calc( 100% + 20px);
  }
  .navmenu-container .el-menu-vertical-demo .svg-icon {
    width: 1.0em;
    height: 1.0em;
    vertical-align: -0.2em;
  }
  .el-menu-vertical-demo span {
    font-size: 14px;
  }
  .toggle-container {
    font-size: 14px;
    text-align: right;
    cursor: pointer;
    padding: 10px 25px 0 0;
  }
  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }
  .el-menu-vertical-demo {
    height: 100%;
  }
  .title-name {
    padding: 10px;
  }
  img {
    padding: 10px;
  }
</style>

<style>
  .el-menu {
    background-color: #001528;
  }
  .el-menu-item, .el-submenu__title {
    height: 40px;
    line-height: 40px;
    color: #D3D3DE;
  }
  .el-menu-item:hover,.el-menu-item.onlyFirst:hover,.el-submenu .el-submenu__title:hover {
    background-color: #0A345A;
  }
  .el-menu-item.is-active {
    color: #fff;
    background-color: #0090FF;
  }
  .el-menu-item.is-active.onlyFirst {
    color: #0090FF;
    background-color: #001528;
  }
  .el-submenu .el-menu-item {
    height: 35px;
    line-height: 35px;
  }
  .el-submenu.is-active>.el-submenu__title{
    color: #0090FF;
    background-color: #001528;
  }
</style>

