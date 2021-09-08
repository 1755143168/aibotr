<template>
  <div class="breadcrumb-container">
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="index==levelList.length-1">{{ item.meta.title }}</span>
        <a v-else @click.prevent="$router.push(item.path)" class="redirect">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched
      
      // const first = matched[0]
      // if (first && first.path !== 'home') {
      //   matched = [{ path: '/home', meta: { title: '首页' }}].concat(matched)
      // }

      this.levelList = matched.filter(item => item.meta && item.meta.title)
    },
  }
}
</script>

<style scoped>
  .breadcrumb-container {
    padding: 0 25px;
    /* box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04); */
  }
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 12px;
    line-height: 30px;
  }
  .app-breadcrumb.el-breadcrumb .redirect {
    color: #999;
    cursor: pointer;
  }
  
</style>
