<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container">
        <!-- <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
            <el-form-item label="文件状态：">
              <el-select v-model="searchForm.fileInfoStatus" placeholder="请选择文件状态" style="width:140px;" clearable @clear="clearClick('fileInfoStatus')">
                <el-option label="在职" value="ON_JOB"></el-option>
                <el-option label="离职" value="OUT_JOB"></el-option>
                <el-option label="休假" value="VACATION"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input v-model="searchForm.value" placeholder="请输入搜索内容" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="searchButton" @click="getSearch()">查询</el-button>
            </el-form-item>
          </el-form>
        </div> -->
        <div class="add-button-container">
          <el-button type="primary" size="small" @click="addClick()">添加文件</el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column align="center" prop="fileName" label="文件名" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注" min-width="200px"></el-table-column>
            <el-table-column align="center" label="操作" min-width="100px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="color-blue" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" class="color-red" @click="deleteClick(scope.row)">删除</el-button>
                <el-button type="text" size="mini" class="color-green" @click="download(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getData()" :pageIndex.sync="pageNum" :pageSize.sync="searchForm.pageSize" :total="total"></pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="900px">
          <el-form :model="form" ref="form" label-width="60px" size="small">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="文件：">
                  <a v-if="form.fileUrl" :href="form.fileUrl">{{form.fileName}}</a>
                  <el-upload :before-upload="beforeAvatarUpload" :show-file-list="true" :limit="1" :action="uploadUrl" :on-success="showSuccess">
                    <el-button type="primary" size="small">上传文件</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="备注：">
                  <el-input type="textarea" :rows="3" v-model="form.remark" maxlength="255" placeholder="请输入备注(限255字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加文件' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑文件' " @click="submitEdit('form')">确定</el-button>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination/pagination";
import {myPost,base_url } from "@/api/http";
export default {
  data() {
    return {
      uploadUrl:base_url + "/upload",
      total: 0,
      pageNum: 1,
      dialogTitle: '',
      dialogVisible: false,
      addHourShow: false,
      searchForm: {
        pageNum: 0,
        pageSize: 10,
        fileInfoStatus: null,
        value: ''
      },
      form: {
        id:"",
        fileName:"",
        fileUrl:"",
        remark:""
      },
      resetForm: {
        id:"",
        fileName:"",
        fileUrl:"",
        remark:""
      },
      tableData: [],
      timeData: [],
      classList: []
    };
  },
  components: {pagination},
  created() {
    this.getData()
  },
  methods: {
    download(row){
        var fileUrl = row.fileUrl;
        const xhr = new XMLHttpRequest();
        xhr.open("get", fileUrl);
        xhr.responseType = "blob"; // ""|"text"-字符串 "blob"-Blob对象 "arraybuffer"-ArrayBuffer对象
        xhr.onload = function() {
          let blob = new Blob([xhr.response],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
          if(window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob,fileName)
          }
          else {        
            let URL = window.URL || window.webkitURL
            let a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = row.fileName   
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(a.href)
          }
        };
        xhr.send()
    },
    showSuccess(res, file) {
      this.form.fileUrl = res.data
      this.form.fileName = file.name
    },
    beforeAvatarUpload(file) {
    //   const isJPG = ((file.type === "image/jpeg")||(file.type === 'image/png'));;
    //   const isLt2M = file.size / 1024 / 1024 < 1;
    //   if (!isJPG) {
    //     this.$message.error("上传图片只能是JPG/PNG格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("上传图片大小不能超过1MB!");
    //   }
    //   return isJPG && isLt2M;
    return true;
    },
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/fileInfo/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    clearClick(item) {
      this.searchForm[item] = null
    },
    addClick() {
      this.dialogTitle = '添加文件'
      this.form = {...this.resetForm}
      this.dialogVisible = true
    },
    editClick(row) {
        this.form = {...row};
        this.dialogTitle = '编辑文件'
        this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonClass: "el-button--primary",
        type: "warning"
      })
      .then(() => {
        myPost("/fileInfo/delete/"+row.id)
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成员成功"
          });
          this.getData();
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/fileInfo/add", this.form)
          .then(res => {
            this.$message.success('添加成功');
            this.getData();
            this.dialogVisible = false;
          });
        }
      }) 
    },
    submitEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/fileInfo/edit", this.form)
          .then(res => {
            this.$message.success("编辑成功")
            this.getData()
            this.dialogVisible = false
          });
        }
      })
    },
  }
};
</script>

<style scoped>
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
  .avatar-uploader-icon {
    font-size: 16px;
    width: 160px;
    height: 90px;
    line-height: 100px;
  }
</style>