<template>
  <div class="pagination-container">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage"
      :page-size.sync="limit"
      :page-sizes="pageSizes"
      layout="total, sizes,prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50,100]
      }
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.pageIndex
      },
      set(val) {
        this.$emit('update:pageIndex', val)
      }
    },
    limit: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
 
  methods: {
     //选择每页条数
    handleSizeChange(val) {
      this.$emit('pagination', { pageIndex: this.currentPage, pageSize: val })
    },
    // 点击数字
    handleCurrentChange(val) {
      this.$emit('pagination', { pageIndex: val, pageSize: this.limit })
    }
  },
}
</script>

<style>
  .el-pagination {
    padding-top: 10px;
    text-align: right;
  }
</style>