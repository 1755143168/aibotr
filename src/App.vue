<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
   provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
  #app {
    font-family: 'PingFangSC','Microsoft YaHei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    height: 100%;
  }
  body,html {
    width: 100%;
    height: 100%;
  }
  body,h1,h2,h3,h4,h5,h6,ul,li,.el-table,div{
  margin: 0;
  padding: 0;
  list-style: none;
  }
  a,
  a:focus,
  a:hover,
  a:active {
    cursor: pointer;
    color: inherit;
    outline: none;
    text-decoration: none;
  }
  .uploadFiles:link,.uploadFiles:focus,.uploadFiles:hover,.uploadFiles:active,.uploadFiles:visited{
    font-size: 12px;
    padding-right: 20px;
    cursor: pointer;
    outline: none;
    text-decoration: none;
  }
  .uploadFiles:link{
    color: #66B1FF;
  }
  .uploadFiles:hover {
    color: #409EFF;
  }
  .clearfix::after {
    content: '.';
    height: 0;
    display: block;
    clear: both;
  }
  .clearfix {
    *zoom:1;
  }
  .title-first {
    font-size: 14px;
    font-weight: 500;
    margin-left: 30px;
    position: relative;
  }
  .title-first::before {
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    content: '';
    background-color: #0090FF;
    position: absolute;
    left: -10px;
    top: 8px;
  }
  h3 {
    display: block;
    color: #454545;
    font-size: 18px;
    /* font-weight: 600; */
    line-height: 40px;
    height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  .form-container,.table-container,.add-button-container,.searchForm-container {
    background-color: #fff;
  }
  .form-container {
    padding: 15px 20px 0;
  }
  .table-container {
    padding-bottom: 20px;
  }
  .searchForm-container {
    padding-top: 15px;
    position: relative;
  }
  .add-button-container {
    text-align: right;
    padding: 0 0 20px;
  }
  .base-part:last-child {
    padding-bottom: 20px;
  }
  .title-part  {
    display: flex;
    align-items: center;
  }
  .form-head {
    background-color: #ECF6FF;
    font-size: 12px;
    padding: 8px 20px;
    width: 100%;
    box-sizing: border-box;
    margin: 10px 0;
  }
  .process-button-container {
    text-align: center;
    padding: 10px 40px;
  }
  .confirm-button-container {
    text-align: center;
    padding: 20px;
  }
  .base-container {
    padding: 15px;
  }
  .cell-max { 
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* 表单公共样式 */
  .base-container .el-input__inner {
    /* background-color: #fff; */
    font-size: 12px;
  }
  .base-container .table-container .el-input__inner {
    text-align: center;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  /* 按钮样式封装 */
  .el-button--myLogin{
    background-color: #0462BA;
    border-color: #0462BA;
    color: #fff;
  }
  .el-button--myLogin.is-disabled,
  .el-button--myLogin.is-disabled:hover,
  .el-button--myLogin.is-disabled:focus{
    background-color: #80C0FC;
    border-color: #80C0FC;
    color: #fff;
  }
  .el-button--myLogin:hover{
    background-color: #7CC5FC;
    border-color: #7CC5FC;
    color: #fff;
  }
  .el-button--myLogin:focus{
    background-color: #027BD9;
    border-color: #027BD9;
    color: #fff;
  }
  .color-blue,.color-blue:hover,.color-blue:focus,.total-list .color-blue{
    color: #1890FF; 
    font-size: 12px;
  }
  .color-red,.color-red:hover,.color-red:focus{
    color: #F5222D; 
  }
  .color-orange,.color-orange:hover,.color-orange:focus{
    color: #eb6100; 
  }
  .color-green,.color-green:hover,.color-green:focus{
    color: #43CF7C; 
    font-size: 12px;
  }
  .el-upload-list__item {
    width: 200px;
    float: left;
  }
  .el-upload-list {
    display: inline;
  }
  .el-upload-list__item:first-child {
    margin-top: 5px;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #eee;
    color: #606266;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #eee;
    color: #606266;
  }
  /* .el-form .searchButton{
    margin-left: 30px;
  } */
  .el-form--inline .el-form-item {
    margin-right: 20px;
  }
  /* 单选框样式 */
  .el-radio__label {
    font-size: 12px;
}
  .el-radio__input.is-checked+.el-radio__label {
    color: #0090FF;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #0090FF;
    background: #fff;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    border-color: #0090FF;
    background: #0090FF;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    width: 6px;
    height: 6px;
  }
  /* tab标签页 */
  .el-tabs__header.is-top {
    padding-left: 20px;
  }
  .el-tabs__active-bar {
    background-color: #0090FF;
  }
  .el-tabs__item.is-active,.el-tabs__item:hover {
    color: #0090FF;
  }
  .submit-button-container {
    text-align: right;
    padding: 20px 0;
  }
  /* collapse公共样式 */
  .el-collapse-item__content,.el-collapse-item__header {
    font-size: 16px;
  }
  /* checkbox禁用样式调整 */
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .el-checkbox__input.is-disabled+span.el-checkbox__label {
    color: #409EFF;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #F8F8F8;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .my-pic-upload-box {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .icon-opera {
    margin-right: 5px;
  }
  .person-label {
    font-size: 12px;
    line-height: 32px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    color: #8c939d;
    text-align: center;
  }
  /* 谷歌 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none; 
    margin: 0; 
  }
  /* 火狐 */
  input{
    -moz-appearance: textfield;
  }
</style>
