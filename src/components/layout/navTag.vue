<template>
  <div class="tag-container" v-if="tagsShow">
    <el-tag v-for="(item,i) in tags" :key="item.path" closable :type="item.type" size="small" @click="tagClick(item)" @close.stop="closeTagClick(item,i)">{{item.title}}</el-tag>
  </div>
</template>

<script>
import store from '@/utils/store'
export default {
  data() {
    return {
      state: store.state,
      tags: [],
      tagsShow: true
    }
  },
  
  mounted() {
    this.addViewTags()
  },
  watch: {
    $route() {
      this.addViewTags()
    },
  },
  methods: {
    addViewTags() {
      this.tagsShow = false
      let hasCurrent = this.tags.some(e=>e.path===this.$route.path)
      if(!hasCurrent) {
        this.tags.push({
          path: this.$route.path,
          title: this.$route.meta.title,
        })
      }
      this.tags.map(e=>{
        if(e.path === this.$route.path) {
          e.type = 'success'
        }
        else {
          e.type = 'info'
        }
      })
      this.tagsShow = true
    },
    tagClick(tag) {
      this.$router.push({path: tag.path})
    },
    closeTagClick(tag,index) {
      if(this.tags[index].path===tag.path) {
        if(index>0) {
          this.$router.push({path:this.tags[index-1].path})
        }
        else {
          this.$router.push({path:this.tags[this.tags.length-1].path})
        }
      }
      this.tags.splice(index,1)
    }
  }
}
</script>

<style scoped>
  .tag-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    height: 40px;
    padding-top: 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  }
</style>
<style >
  .el-tag {
    margin-left: 10px;
    cursor: pointer;
  }
</style>