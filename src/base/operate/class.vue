<template>
  <div class="class_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
            <el-form-item label="班级状态：">
              <el-select v-model="searchForm.available" placeholder="请选择班级状态" style="width:140px;" clearable @clear="clearClick('available')">
                <el-option label="正常" :value="true"></el-option>
                <el-option label="禁用" :value="false"></el-option>
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
          <el-button type="primary" size="small" @click="addClick()">添加班级</el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" prop="className" label="班级名称" min-width="100px"></el-table-column>
            <el-table-column align="center" prop="type" label="难度" min-width="70px">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 'HUIBEN'">绘本</span>
                <span v-else>{{scope.row.type}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="classTeacher" label="班主任" min-width="80px"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="studentNum" label="学生数量" min-width="80px"></el-table-column>
            <!-- <el-table-column align="center" prop="courseAndHourNum" label="课程/课时" min-width="90px"></el-table-column> -->
            <el-table-column align="center" prop="introduction" label="简介" min-width="150px">
              <template slot-scope="scope">
                <el-popover placement="bottom-start" trigger="hover" width="200" :content="scope.row.introduction">
                  <span slot="reference" class="cell-max">{{scope.row.introduction}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="available" label="状态" min-width="100px">
              <template slot-scope="scope">
                <span class="color-green" v-if="scope.row.available===true">正常</span>
                <span class="color-red" v-if="scope.row.available===false">禁用</span>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="900px">
          <el-form :model="form" ref="form" label-width="75px" size="small">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="班级：">
                  <el-input v-model="form.className" placeholder="请输入班级名称" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="难度：">
                  <el-select v-model="form.type" placeholder="请选择难度" class="diaInput">
                    <el-option label="BC" value="BC"></el-option>
                    <el-option label="RA" value="RA"></el-option>
                    <el-option label="RB" value="RB"></el-option>
                    <el-option label="RC" value="RC"></el-option>
                    <el-option label="RD" value="RD"></el-option>
                    <el-option label="绘本" value="HUIBEN"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="状态：">
                  <el-select v-model="form.available" placeholder="请选择学员状态" class="diaInput">
                    <el-option label="正常" :value="true"></el-option>
                    <el-option label="禁用" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="班主任：">
                  <el-input v-model="form.classTeacher" placeholder="请输入班主任" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号：">
                  <el-input v-model="form.phone" placeholder="请输入班主任手机号" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>  
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="开班时间：">
                  <el-datePicker type="date" v-model="form.beginTime" value-format="yyyy-MM-dd" class="diaInput" placeholder="开班时间"></el-datePicker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="闭班时间：">
                  <el-datePicker type="date" v-model="form.endTime" value-format="yyyy-MM-dd" class="diaInput" placeholder="闭班时间"></el-datePicker>
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
            <el-row>
              <el-col :span="23">
                <el-form-item label="备注：">
                  <el-input type="textarea" :rows="3" v-model="form.remark" maxlength="100" placeholder="请输入备注信息(限100字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>       
            <el-form-item v-if="dialogTitle==='编辑班级'">
              <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="课程管理" name="course">   
                  <div class="time_hour">
                    <!-- <span>共计 {{form.courseNum}} 节, {{form.classHoursNum}} 课时</span> -->
                    <span></span>
                    <el-button type="text" class="color-blue" @click="addCourseClick()">添加</el-button>
                  </div>
                  <el-table border stripe :data="courseData" style="width: 100%;" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
                    <el-table-column fixed align="center" prop="startTime" label="开课时间" min-width="150px"></el-table-column>
                    <el-table-column align="center" prop="courseName" label="课程" min-width="150px"></el-table-column>
                    <el-table-column align="center" prop="teacherName" label="教师" min-width="100px"></el-table-column>
                    <el-table-column align="center" prop="remark" label="备注" min-width="200px"></el-table-column>
                    <el-table-column align="center" label="操作" min-width="60px">
                      <template slot-scope="scope">
                        <el-button type="text" size="mini" class="color-blue" @click="deleteCourseClick(scope.row)">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>  
                  <div class="hour_form" v-if="addCourseShow">
                    <el-datePicker type="datetime" v-model="courseForm.startTime" value-format="yyyy-MM-dd HH:mm" style="width: 173px;margin: 0 5px;" placeholder="开课时间"></el-datePicker>
                    <el-select v-model="courseForm.courseId" placeholder="请选择课程" style="width: 171px;margin: 0 5px;" filterable>
                      <el-option v-for="item in courseList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                    <el-select v-model="courseForm.teacherId" placeholder="请选择教师" style="width: 110px;margin: 0 5px;" filterable>
                      <el-option v-for="item in teacherList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                    <el-input v-model="courseForm.remark" maxlength="20" placeholder="限20字" style="width: 231px;margin: 0 5px;"></el-input>
                    <el-button  type="text" class="color-blue" @click="submitAddCourse()" style="margin-left:25px;">确定</el-button>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="学员管理" name="student">
                  <div class="time_hour">
                    <span>共 {{form.studentNum}} 名</span>
                    <el-button type="text" class="color-blue" @click="addStuClick()">添加</el-button>
                  </div>  
                  <el-table border stripe :data="studentData" style="width: 96%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
                    <el-table-column fixed align="center" prop="phone" label="手机号" min-width="120px"></el-table-column>
                    <el-table-column align="center" prop="username" label="姓名" min-width="80px"></el-table-column>
                    <el-table-column align="center" prop="gender" label="性别" min-width="80px">
                      <template slot-scope="scope">
                        <span v-if="scope.row.gender==='MALE'">男</span>
                        <span v-if="scope.row.gender==='FEMALE'">女</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="age" label="年龄" min-width="80px"></el-table-column>
                    <el-table-column align="center" prop="remark" label="备注" min-width="200px"></el-table-column>
                    <el-table-column align="center" label="操作" min-width="60px">
                      <template slot-scope="scope">
                        <el-button type="text" size="mini" class="color-blue" @click="deleteStuClick(scope.row)">移除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>  
                  <span class="tips">*仅可添加未分班学生，已分班学生需要先从原班级移出</span>
                  <div class="stu_form" v-if="addStuShow">
                    <el-select v-model="studentForm.studentId" placeholder="请选择学员" style="width: 250px;margin: 0 5px;" filterable>
                      <el-option v-for="item in studentList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                    <el-button  type="text" class="color-blue" @click="submitAddStu()" style="margin-left:25px;">确定</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加班级' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑班级' " @click="submitEdit('form')">确定</el-button>
            <el-button size="small"  @click="dialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination/pagination";
import {myPost } from "@/api/http";
export default {
  data() {
    return {
      activeName: 'course',
      total: 0,
      pageNum: 1,
      dialogTitle: '',
      dialogVisible: false,
      addCourseShow: false,
      addStuShow: false,
      searchForm: {
        pageNum: 0,
        pageSize: 10,
        available: null,
        value: ''
      },
      form: {
        className: '',
        type: null,
        available: '',
        classTeacher: '',
        phone: '',
        introduction: '',
        remark: '',
        courseNum: 0,
        classHoursNum: 0,
        studentNum: 0,
        beginTime: '',
        endTime: ''
      },
      resetForm: {
        className: '',
        type: null,
        available: '',
        classTeacher: '',
        phone: '',
        introduction: '',
        remark: '',
        courseNum: 0,
        classHoursNum: 0,
        studentNum: 0,
        beginTime: '',
        endTime: ''
      },
      courseForm: {
        startTime: '',
        courseId: '',
        classId: '',
        teacherId: '',
        remark: ''
      },
      studentForm: {
        classId: '',
        studentId: '',
      },
      tableData: [],
      courseData: [],
      studentData: [],
      courseList: [],
      teacherList: [],
      studentList: []
    };
  },
  components: {pagination},
  created() {
    this.getData()
    this.getCourseList()
    this.getTeacherList()
    this.getStudentList()
  },
  methods: {
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/classInfo/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    getCourseData() {
      myPost("/classInfo/course/list/"+this.form.id)
      .then(res => {
        this.courseData = [...res.data.data];
      });
    },
    getStudentData() {
      myPost("/classInfo/student/list/"+this.form.id)
      .then(res => {
        this.studentData = [...res.data.data];
      });
    },
    getCourseList() {
      myPost("/courseInfo/normal/list")
      .then(res => {
        this.courseList = [...res.data.data];
      });
    },
    getTeacherList() {
      myPost("/teacher/onJob/list")
      .then(res => {
        this.teacherList = [...res.data.data];
      });
    },
    getStudentList() {
      myPost("/student/noClass/list",{})
      .then(res => {
        this.studentList = [...res.data.data];
      });
    },
    tabClick(e) {
      if(e.name==='course') {
        this.getCourseData()
      }
      if(e.name==='student') {
        this.getStudentData()
      }
    },
    clearClick(item) {
      this.searchForm[item] = null
    },
    addClick() {
      this.dialogTitle = '添加班级'
      this.form = {...this.resetForm}
      this.dialogVisible = true
    },
    editClick(row) {
      myPost("/classInfo/detail/"+row.id)
      .then(res => {
        this.form = {...res.data.data};
        this.courseForm.classId = this.form.id
        this.studentForm.classId = this.form.id
        this.dialogTitle = '编辑班级'
        this.getCourseData()
        this.getStudentData()
        this.dialogVisible = true
      });  
    },
    addCourseClick() {
      this.addCourseShow = true
    },
    addStuClick() {
      this.addStuShow = true
    },
    submitAddCourse() {
      myPost('/classInfo/course/add',this.courseForm)
      .then(res=>{
        this.$message.success('添加课程成功')
        this.addCourseShow = false
        myPost("/classInfo/detail/"+this.form.id)
        .then(res => {
          this.form.courseNum = res.data.data.courseNum
          this.form.classHoursNum = res.data.data.classHoursNum
        }); 
        this.getCourseData()
      })
    },
    submitAddStu() {
      myPost('/classInfo/student/add',this.studentForm)
      .then(res=>{
        this.$message.success('添加学员成功')
        this.addStuShow = false
        myPost("/classInfo/detail/"+this.form.id)
        .then(res => {
          this.form.studentNum = res.data.data.studentNum
        });   
        this.getStudentData() 
      })
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/classInfo/add", this.form)
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
          myPost("/classInfo/edit", this.form)
          .then(res => {
            this.$message.success("编辑成功")
            this.getData()
            this.dialogVisible = false
          });
        }
      })
    },
    deleteCourseClick(row) {
      this.$confirm("你确定要移除该课程吗？", "提示", {
        confirmButtonClass: "el-button--myPrimary",
        type: "warning"
      })
      .then(() => {
        myPost("/classInfo/course/del",{classCourseId:row.id})
        .then(res => {
          this.$message({
            type: "success",
            message: "移除成功"
          });
          this.getCourseData();
          myPost("/classInfo/detail/"+this.form.id)
          .then(res => {
            this.form.courseNum = res.data.data.courseNum
            this.form.classHoursNum = res.data.data.classHoursNum
          }); 
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消移除"
        });
      });
    },
    deleteStuClick(row) {
      this.$confirm("你确定要移除该学生吗？", "提示", {
        confirmButtonClass: "el-button--myPrimary",
        type: "warning"
      })
      .then(() => {
        myPost("/classInfo/student/del",{studentId:row.id})
        .then(res => {
          this.$message({
            type: "success",
            message: "移除成功"
          });
          this.getStudentData();
          this.getStudentList()
          myPost("/classInfo/detail/"+this.form.id)
          .then(res => {
            this.form.studentNum = res.data.data.studentNum
          });  
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消移除"
        });
      });
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
  .stu_form {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
  .tips {
    display: inline-block;
    padding: 5px 0;
    color: #d9001b;
    font-size: 12px;
  }
</style>