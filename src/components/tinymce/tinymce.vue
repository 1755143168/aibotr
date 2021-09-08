<template>
  <div class='tinymce'>
    <textarea :id="id" v-model="value" :readonly="readonly"></textarea>
    <div class="pic-container">
        <el-upload :headers="header" :action="uploadUrl" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload">
          <el-button type="myPrimary" icon="el-icon-upload" size="mini">上传图片</el-button>
        </el-upload>
    </div>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'
// import Editor from '@tinymce/tinymce-vue'
import "tinymce/plugins/paste"
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import {base_url } from "@/api/http";


export default {
  data() {
    return {
      header: {
        Token:sessionStorage.getItem("Token")
      },
      flag: true,
      avatarUrl: '',
      uploadUrl: base_url + "/upload"
    }
  },
  props: {
    id: {
      type: String,
      default: "tinymce"
    },
    value: {
      type: String,
      default: ''
    },
    setting: Object,
    readonly: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.tinymceinit()
  },
  beforeDestroy() {
    tinymce.get(this.id).destroy();
  },
  watch: {
    value(newValue,oldValue) {
      if(this.flag){
        tinyMCE.activeEditor.setContent(newValue);
      }
      this.flag=true;
    }
  },
  methods: {
    tinymceinit() {
      const _this = this;
      const setting = {
        selector: "#"+_this.id,
        readonly: this.readonly,
        language: "zh_CN",//语言设置中文
        menubar: false,//去除文件栏
        branding: false,//去除右下角的'由tinymce驱动'
        elementpath: false,//左下角的当前标签路径
        height: 300,
        language_url: "../../../static/tinymce/zh_CN.js",//导入中文语言文件
        skin_url: "../../../static/tinymce/skins/lightgray",//在node_modules中tinymce文件夹中
        plugins:
        "lists paste link image contextmenu wordcount colorpicker textcolor table code imagetools",//对应上方import引入的文件，下面toolbar需要使用到
        toolbar:
         'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | image | link unlink | removeformat',
        setup: function(editor) {
          editor.on('input undo redo execCommand', function(e) {
              _this.flag=false;
              _this.$emit('input', editor.getContent());
          }) 
        }
      };
      Object.assign(setting, _this.setting);
      tinymce.init(setting);
    },
    beforeUpload(file) {
      const isJPG = ((file.type === "image/jpeg")||(file.type === 'image/png'));;
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是JPG/PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过4MB!");
      }
      return isJPG && isLt2M;
    },
    handleSuccess(res,file) {
      this.avatarUrl = res.data
      tinymce.get(this.id).insertContent(`<img width="100%" src="${this.avatarUrl}" />`)
    },
  }
}
</script>

<style scoped>
  .tinymce {
    position: relative;
  }
  .pic-container {
    position: absolute;
    left: 4px;
    bottom: 4px;
  }
</style>
