<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
            <el-form-item label="课程状态：">
              <el-select v-model="searchForm.status" placeholder="请选择课程状态" style="width:140px;" clearable @clear="clearClick('status')">
                <el-option label="正常" value="NORMAL"></el-option>
                <el-option label="停课" value="STOP"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input v-model="searchForm.value" placeholder="请输入搜索内容" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="searchButton" @click="getSearch()">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="add-button-container">
          <el-button type="primary" size="small" @click="addClick()">添加课程</el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" prop="courseName" label="课程名称" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="bookName" label="书名" min-width="80px"></el-table-column>
            <el-table-column align="center" prop="price" label="价格" min-width="60px"></el-table-column>
            <el-table-column align="center" prop="introduction" label="简介" min-width="150px">
              <template slot-scope="scope">
                <el-popover placement="bottom-start" trigger="hover" width="200" :content="scope.row.introduction">
                  <span slot="reference" class="cell-max">{{scope.row.introduction}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态" min-width="100px">
              <template slot-scope="scope">
                <span class="color-green" v-if="scope.row.status==='NORMAL'">正常</span>
                <span class="color-red" v-if="scope.row.status==='STOP'">停课</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="60px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="color-blue" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" class="color-red" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getData()" :pageIndex.sync="pageNum" :pageSize.sync="searchForm.pageSize" :total="total"></pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="900px">
          <el-form :model="form" ref="form" label-width="60px" size="small">
            <el-row :gutter="20">
              <el-col :span="14">
                <el-form-item label="课程名：">
                  <el-input v-model="form.courseName" placeholder="请输入课程名" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="状态：">
                  <el-select v-model="form.status" placeholder="请选择课程状态" class="diaInput">
                    <el-option label="正常" value="NORMAL"></el-option>
                    <el-option label="停课" value="STOP"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="14">
                <el-form-item label="书名：">
                  <el-input v-model="form.bookName" placeholder="请输入书名" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="价格：" >
                  <el-input v-model="form.price" placeholder="请输入备用手机号" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="简介：">
                  <el-input type="textarea" :rows="3" v-model="form.introduction" maxlength="300" placeholder="请输入简介信息(限300字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="展示图：">
                  <el-upload class="avatar-uploader" :before-upload="beforeAvatarUpload" :show-file-list="false"  :action="uploadUrl" :on-success="showSuccess">
                    <img v-if="form.showImg" :src="form.showImg" width="150px"/>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="预读：">
                  <a v-if="form.pdfName" target="_blank" class="color-blue" :href="form.preReadImg">{{form.pdfName}}</a>
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
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加课程' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑课程' " @click="submitEdit('form')">确定</el-button>
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
        status: null,
        value: ''
      },
      form: {
        id:"",
        courseName: '',
        bookName: "",
        pdfName: '',
        price: 0.00,
        showImg: '',
        preReadImg: '',
        introduction: '',
        remark: '',
        status: null
      },
      resetForm: {
        id:"",
        pdfName: '',
        courseName: '',
        bookName: "",
        price: 0.00,
        showImg: '',
        preReadImg: '',
        introduction: '',
        remark: '',
        status: null
      },
      hourForm: {
        recordTime: '',
        type: null,
        paymentHours: null,
        presentHours: null,
        price: null,
        detail: ''
      },
      tableData: [],
      timeData: [],
      classList: [],
      fileList: []
    };
  },
  components: {pagination},
  created() {
    this.getData()
  },
  methods: {
    showSuccess(res, file) {
      this.form.showImg = res.data
    },
    preSuccess(res, file) {
      this.form.preReadImg = res.data
      this.form.pdfName = file.name
    },
    beforeAvatarUpload(file) {
      const isJPG = ((file.type === "image/jpeg")||(file.type === 'image/png'));;
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG/PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过1MB!");
      }
      return isJPG && isLt2M;
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
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/courseInfo/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    clearClick(item) {
      this.searchForm[item] = null
    },
    addClick() {
      this.dialogTitle = '添加课程'
      this.form = {...this.resetForm}
      this.fileList = []
      this.dialogVisible = true
    },
    editClick(row) {
      this.fileList = []
      myPost("/courseInfo/detail/"+row.id)
      .then(res => {
        this.form = {...res.data.data};
        this.dialogTitle = '编辑课程'
        this.dialogVisible = true
      });  
    },
    timeClick(row) {
      this.timeForm.purchaseHours = row.purchaseHours
      this.timeForm.presentHours = row.presentHours
      this.timeVisible = true
    },
    addRecordClick() {
      this.addHourShow = true
    },
    submitAddHour() {
      myPost()
      .then(res=>{
        this.$message.success('添加成功')
        this.addHourShow = false
      })
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/courseInfo/add", this.form)
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
          myPost("/courseInfo/edit", this.form)
          .then(res => {
            this.$message.success("编辑成功")
            this.getData()
            this.dialogVisible = false
          });
        }
      })
    },
    deleteClick(row){
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonClass: "el-button--primary",
        type: "warning"
      })
      .then(() => {
        myPost("/courseInfo/delete/"+row.id)
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
    }
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