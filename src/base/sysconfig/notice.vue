<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
          </el-form>
        </div>
        <div class="add-button-container">
          <el-button type="primary" size="small" @click="addClick()">添加通知</el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column fixed align="center" prop="createTime" label="时间" min-width="140px"></el-table-column>
            <el-table-column align="center" prop="targetName" label="目标" min-width="80px"></el-table-column>
            <el-table-column align="center" prop="subject" label="主题" min-width="100px"></el-table-column>
            <el-table-column align="center" prop="content" label="内容" min-width="150px">
              <template slot-scope="scope">
                <el-popover placement="bottom-start" trigger="hover" width="200" :content="scope.row.content">
                  <span slot="reference" class="cell-max">{{scope.row.content}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="pdf" label="pdf" min-width="150px">
              <template slot-scope="scope">
                <a v-if="scope.row.pdfName" target="_blank" class="color-blue" :href="scope.row.pdfUrl">{{scope.row.pdfName}}</a>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="60px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="color-red" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getData()" :pageIndex.sync="pageNum" :pageSize.sync="searchForm.pageSize" :total="total"></pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="900px">
          <el-form :model="form" ref="form" label-width="70px" size="small">
            <el-row>
              <el-col :span="23">
                <el-form-item label="主题：">
                  <el-input type="textarea" :rows="3" v-model="form.subject" maxlength="300" placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="内容：">
                  <el-input type="textarea" :rows="3" v-model="form.content" maxlength="300" placeholder="请输入内容(限300字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="pdf文档：">
                  <el-upload :before-upload="beforePdfUpload" :file-list="fileList" :show-file-list="true" :limit="1" :action="uploadUrl" :on-success="preSuccess">
                    <el-button type="primary" size="small">上传pdf</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row> 
            <el-row>
              <el-col :span="23">
                <el-form-item label="备注：">
                  <el-input type="textarea" :rows="3" v-model="form.remark" maxlength="100" placeholder="请输入备注信息(限100字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="状态：">
                  <el-select v-model="form.type" placeholder="请选择通知状态" class="diaInput" @change="typeChange">
                    <el-option label="学员" value="PERSON"></el-option>
                    <el-option label="班级" value="CLASS"></el-option>
                    <el-option label="全体学员" value="ALL"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="" v-if="form.type == 'CLASS'">
                  <el-select v-model="form.classId" placeholder="请选择班级" class="diaInput" filterable>
                      <el-option v-for="(item,index) in classList" :key="index" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" v-if="form.type == 'PERSON'">
                  <el-select v-model="form.studentId" placeholder="请选择学生" class="diaInput" filterable>
                    <el-option v-for="(item,index) in studentList" :key="index" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加通知' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑通知' " @click="submitEdit('form')">确定</el-button>
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
        noticeStatus: null,
        value: ''
      },
      form: {
        id:"",
        subject: '',
        content: "",
        type: "ALL",
        remark: '',
        classId: '',
        studentId: '',
        pdfName: '',
        pdfUrl: ''
      },
      resetForm: {
        id:"",
        subject: '',
        content: "",
        type: "ALL",
        remark: '',
        classId: '',
        studentId: '',
        pdfName: '',
        pdfUrl: ''
      },
      fileList: [],
      tableData: [],
      timeData: [],
      classList: [],
      studentList: [],
    };
  },
  components: {pagination},
  created() {
    this.getData()
    this.getStudentList()
    this.getClass()
  },
  methods: {
    preSuccess(res, file) {
      this.form.pdfUrl = res.data
      this.form.pdfName = file.name
    },
    beforePdfUpload(file) {
      const isPdf = (file.type === "application/pdf")
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isPdf) {
        this.$message.error("上传文件只能是PDF格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过10MB!");
      }
      return isPdf && isLt2M;
    },
    getClass(){
      myPost("/classInfo/normal/list",{})
      .then(res => {
        this.classList = [...res.data.data];
      });  
    },
    getStudentList() {
      myPost("/student/list",{})
      .then(res => {
        this.studentList = [...res.data.data];
      });
    },
    typeChange(){
        this.form.classId = ""
        this.form.studentId = ""
    },
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/notice/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    addClick() {
      this.dialogTitle = '添加通知'
      this.form = {...this.resetForm}
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonClass: "el-button--myPrimary",
        type: "warning"
      })
      .then(() => {
        myPost("/notice/delete/" + row.id)
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成功"
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
    addRecordClick() {
      this.addHourShow = true
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/notice/add", this.form)
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
          myPost("/notice/edit", this.form)
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