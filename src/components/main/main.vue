<template>
  <el-container>
    <el-aside :width="state.asideWidth" ><nav-menu></nav-menu></el-aside>
    <el-container>
      <el-header height="50px"><nav-header></nav-header></el-header>
      <el-header height="40px"><nav-tag></nav-tag></el-header>
      <el-main><main-content></main-content></el-main>
    </el-container>
  </el-container>
</template>

<script>
  import store from '@/utils/store'
  import navHeader from '@/components/layout/navHeader'
  import navTag from '@/components/layout/navTag'
  import navMenu from '@/components/layout/navMenu'
  import mainContent from '@/components/layout/mainContent'
  export default {
    components: {
      navHeader,
      navTag,
      navMenu,
      mainContent
    },
    data() {
      return {
        state: store.state
      }
    },
  }
</script>

<style scoped>
    .el-header {
      padding: 0;
      width: 100%;
      color: #333;
      box-sizing: border-box;
    }
    
    .el-aside {
      background-color: #fff;
      color: #808080;
      text-align: left;
      overflow: hidden;
      /* line-height: 180px; */
      height: 100%;
      transition: width 0.5s;
    }
    
    .el-main {
      background-color: #F3F7FD;
      color: #333;
      width: 100%;
      height: 100%;
      text-align: left;
      padding: 0;
    }
    .el-footer {
      width: 100%;
      text-align: center;
      line-height: 40px;
      background-color: #fff;
    }
  
    .el-container {
      width: 100%;
      height: 100%;
    }
    /* @media screen and (-webkit-min-device-pixel-ratio:0) {
      .el-container:nth-child(1) {
        height: 100%;
      }
    }
    @-moz-document url-prefix() {
      .el-container:nth-child(1) {
        height: calc(100%)!important;
      }
    } */
    /* .el-container:nth-child(2) {
      height: 100%;
      width: 100%;
    } */
</style>

