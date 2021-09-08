<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
          </el-form>
        </div>
        <div class="add-button-container">
          <el-button type="primary" size="small" @click="addClick()">添加用户</el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column fixed align="center" prop="account" label="账号" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="role" label="角色" min-width="80px">
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.role == 'PARENT'">家长</span> -->
                <span v-if="scope.row.role == 'CLASS_ADVISOR'">课程顾问</span>
                <span v-if="scope.row.role == 'TEACHER'">教师</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="username" label="姓名" min-width="60px"></el-table-column>
            <el-table-column align="center" prop="available" label="状态" min-width="80px">
              <template slot-scope="scope">
                <span v-if="scope.row.available == true" style="color:green">启用</span>
                <span v-if="scope.row.available == false" style="color:red">禁用</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="60px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="color-blue" @click="editClick(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getData()" :pageIndex.sync="pageNum" :pageSize.sync="searchForm.pageSize" :total="total"></pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="600px">
          <el-form :model="form" ref="form" label-width="60px" size="small">
            <el-row>
              <el-col :span="23">
                <el-form-item label="账号：">
                  <el-input :rows="3" v-model="form.account" placeholder="请输入账号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="密码：" v-if="dialogTitle === '添加用户'">
                  <el-input type="password" v-model="form.password" maxlength="300" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="用户名：">
                  <el-input v-model="form.username" maxlength="100" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="角色：">
                  <el-select v-model="form.role" placeholder="请选择用户角色" class="diaInput">
                    <el-option label="家长" value="PARENT"></el-option>
                    <el-option label="课程顾问" value="CLASS_ADVISOR"></el-option>
                    <el-option label="教师" value="TEACHER"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="状态：">
                  <el-select v-model="form.available" placeholder="请选择状态" class="diaInput">
                    <el-option label="启用" :value="true"></el-option>
                    <el-option label="禁用" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加用户' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑用户' " @click="submitEdit('form')">确定</el-button>
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
        adminStatus: null,
        value: ''
      },
      form: {
        id:"",
        account: '',
        role: null,
        username: "",
        password: '',
        available: true,
      },
      resetForm: {
        id:"",
        account: '',
        role: null,
        username: "",
        password: '',
        available: true,
      },
      tableData: [],
      timeData: [],
      classList: [],
      studentList: [],
    };
  },
  components: {pagination},
  created() {
    this.getData()
  },
  methods: {
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    editClick(row) {
      this.dialogTitle = '编辑用户'
      this.form = {...row}
      this.dialogVisible = true
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/admin/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    addClick() {
      this.dialogTitle = '添加用户'
      this.form = {...this.resetForm}
      this.dialogVisible = true
    },
    deleteClick(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonClass: "el-button--myPrimary",
        type: "warning"
      })
      .then(() => {
        myPost("/admin/delete/" + row.id)
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
          myPost("/admin/add", this.form)
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
          myPost("/admin/edit", this.form)
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