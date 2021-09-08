<template>
  <div class="student_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
            <el-form-item label="学员状态：">
              <el-select v-model="searchForm.studentStatus" placeholder="请选择学员状态" style="width:140px;" clearable @clear="clearClick('studentStatus')">
                <el-option label="在读" value="ON_SCHOOL"></el-option>
                <el-option label="休学" value="OUT_SCHOOL"></el-option>
                <el-option label="退学" value="SUSPENSION_OF_SCHOOL"></el-option>
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
        <div class="add-button-container" v-if="role != 'PARENT'">
          <el-button type="primary" size="small" @click="addClick()">添加学员</el-button>
          <el-button type="primary" size="small" @click="exportClick()">导出信息</el-button>
          <el-button type="primary" size="small">
            <a href="https://xc-albert.obs.cn-east-2.myhuaweicloud.com:443/albert%2F2020-07-02_17-29-34_419.xlsx">下载模板</a>
          </el-button>
          <el-button type="primary" size="small">
            <el-upload :before-upload="beforeUpload" :show-file-list="false"  :action="uploadUrl" :on-success="showSuccess">
              导入信息
            </el-upload>
          </el-button>
        </div>
        <div class="table-container">
          <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机号" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="username" label="姓名" min-width="80px"></el-table-column>
            <el-table-column align="center" prop="gender" label="性别" min-width="60px">
              <template slot-scope="scope">
                <span v-if="scope.row.gender==='MALE'">男</span>
                <span v-if="scope.row.gender==='FEMALE'">女</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="age" label="年级" min-width="60px"></el-table-column>
            <el-table-column align="center" prop="className" label="班级" min-width="100px"></el-table-column>
            <el-table-column align="center" prop="type" label="难度" min-width="70px"></el-table-column>
            <el-table-column align="center" prop="courseTime" label="剩余学时" min-width="100px">
              <template slot-scope="scope">
                <span class="color-blue course_time" @click="timeClick(scope.row)">{{(scope.row.purchaseHours+scope.row.presentHours).toFixed(2)}}</span>
                <span>({{scope.row.purchaseHours.toFixed(2)}}+{{scope.row.presentHours.toFixed(2)}})</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="studentStatus" label="状态" min-width="100px">
              <template slot-scope="scope">
                <span class="color-green" v-if="scope.row.studentStatus==='ON_SCHOOL'">在读</span>
                <span class="color-blue" v-if="scope.row.studentStatus==='OUT_SCHOOL'">休学</span>
                <span class="color-red" v-if="scope.row.studentStatus==='SUSPENSION_OF_SCHOOL'">退学</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="60px">
              <template slot-scope="scope">
                <el-button type="text" size="mini" class="color-blue" v-if="role != 'PARENT'" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="text" size="mini" class="color-blue" v-if="role == 'PARENT'" @click="lookClick(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination @pagination="getData()" :pageIndex.sync="pageNum" :pageSize.sync="searchForm.pageSize" :total="total"></pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="10vh" :close-on-click-modal="false" width="1000px">
          <el-form :model="form" ref="form" label-width="75px" size="small">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="姓名：">
                  <el-input v-model="form.username" placeholder="请输入姓名" class="diaInput" :disabled="role == 'PARENT'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别：" label-width="80px">
                  <el-select v-model="form.gender" placeholder="请输入性别" class="diaInput" :disabled="role == 'PARENT'">
                    <el-option label="男" value="MALE"></el-option>
                    <el-option label="女" value="FEMALE"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="年级：">
                  <el-input v-model.number="form.age" placeholder="请输入年级" class="diaInput"  :disabled="role == 'PARENT'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="手机号：">
                  <el-input v-model="form.phone" placeholder="请输入手机号" class="diaInput"  :disabled="role == 'PARENT'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备用手机：" label-width="80px">
                  <el-input v-model="form.backupPhone" placeholder="请输入备用手机号" class="diaInput"  :disabled="role == 'PARENT'"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="学校：">
                  <el-input v-model="form.school" placeholder="请输入学校" class="diaInput"  :disabled="role == 'PARENT'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item label="住址：" label-width="80px">
                  <el-input v-model="form.address" maxlength="30" :disabled="role == 'PARENT'" placeholder="请输入住址(限30字)" class="diaInput"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="班级：">
                  <el-select v-model="form.classId" placeholder="请选择班级" filterable class="diaInput" :disabled="role == 'PARENT'">
                    <el-option v-for="item in classList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态：" label-width="80px">
                  <el-select v-model="form.studentStatus" placeholder="请选择学员状态" class="diaInput" :disabled="role == 'PARENT'">
                    <el-option label="在读" value="ON_SCHOOL"></el-option>
                    <el-option label="休学" value="OUT_SCHOOL"></el-option>
                    <el-option label="退学" value="SUSPENSION_OF_SCHOOL"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="剩余学时：" v-if="dialogTitle==='编辑学员' || dialogTitle == '查看学员'">
              <div class="time_hour">
                <span>{{(form.presentHours+form.purchaseHours).toFixed(2)}} (付费学时: {{form.purchaseHours}}, 赠送学时: {{form.presentHours}})</span>
                <el-button type="text" class="color-blue" v-if="dialogTitle==='编辑学员'" @click="addRecordClick()">添加</el-button>
              </div>
              <div class="hour_form" v-if="addHourShow">
                <el-date-picker v-model="hourForm.recordTime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" type="datetime" style="width: 163px;margin: 0 5px;"></el-date-picker>
                <el-select v-model="hourForm.type" style="width: 82px;margin: 0 5px;" placeholder="类型">
                  <el-option label="缴费" value="PAYMENT"></el-option>
                  <el-option label="退费" value="REFUND"></el-option>
                  <el-option label="红冲" value="RED_PUNCH"></el-option>
                </el-select>
                <el-input type="number" v-model="hourForm.paymentHours" placeholder="0.00" style="width: 90px;margin: 0 5px;"></el-input>
                <el-input type="number" v-model="hourForm.presentHours" placeholder="0.00" style="width: 90px;margin: 0 5px;"></el-input>
                <el-input type="number" v-model="hourForm.price" placeholder="0" style="width: 90px;margin: 0 5px;"></el-input>
                <el-input v-model="hourForm.detail" maxlength="20" placeholder="限20字" style="width: 295px;margin: 0 5px;"></el-input>
                <el-button  type="text" class="color-blue" @click="submitAddHour()">确定</el-button>
              </div>
              <el-table border stripe :data="form.classHourRecordResponseList" style="width: 865px" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
                <el-table-column fixed align="center" prop="recordTime" label="操作时间" width="170px"></el-table-column>
                <el-table-column align="center" prop="type" label="类型" width="90px">
                  <template slot-scope="scope">
                    <span class="color-green" v-if="scope.row.type==='PAYMENT'">缴费</span>
                    <span class="color-red" v-if="scope.row.type==='REFUND'">退费</span>
                    <span class="color-orange" v-if="scope.row.type==='RED_PUNCH'">红冲</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="paymentHours" label="付费学时" width="100px"></el-table-column>
                <el-table-column align="center" prop="presentHours" label="赠送学时" width="100px"></el-table-column>
                <el-table-column align="center" prop="price" label="缴费金额" width="100px"></el-table-column>
                <el-table-column align="center" prop="detail" label="明细" width="305px"></el-table-column>
              </el-table>
              
            </el-form-item>
            <el-row>
              <el-col :span="23">
                <el-form-item label="备注：">
                  <el-input type="textarea" :rows="3" :disabled="role == 'PARENT'" v-model="form.remark" maxlength="100" placeholder="请输入备注信息(限100字)"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" v-if="dialogTitle === '添加学员' " @click="submitAdd('form')">确定</el-button>
            <el-button size="small" type="primary" v-if="dialogTitle === '编辑学员' " @click="submitEdit('form')">确定</el-button>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="上课记录" :visible.sync="timeVisible" top="10vh" :close-on-click-modal="false" width="600px">
          <div class="add-button-container" v-if="role !== 'PARENT'">
            <el-button type="primary" size="small" @click="exportTimeClick()">导出信息</el-button>
          </div>
          <el-table stripe :data="timeData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#f2f2f2'}">
            <el-table-column fixed align="center" prop="createTime" label="时间" min-width="120px"></el-table-column>
            <el-table-column align="center" prop="courseName" label="课程" min-width="100px"></el-table-column>
            <el-table-column align="center" prop="teacherName" label="教师" min-width="80px"></el-table-column>
            <el-table-column align="center" prop="price" label="扣费" min-width="60px"></el-table-column>
          </el-table>
          <div class="total_box">
            <span>合计：</span>
            <span class="total">{{timeForm.total}}</span>
          </div>
          <div slot="footer" class="dialog-footer">   
            <span class="rest_time">剩余学时：{{(+timeForm.purchaseHours+timeForm.presentHours).toFixed(2)}} （付费学时：{{timeForm.purchaseHours.toFixed(2)}} 赠送学时：{{timeForm.presentHours.toFixed(2)}}）</span>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import pagination from "@/components/pagination/pagination";
import {MessageBox} from 'element-ui';
import {myPost,exportExcel,base_url} from "@/api/http";
export default {
  data() {
    return {
      uploadUrl:base_url + "/student/import",
      total: 0,
      pageNum: 1,
      timeVisible: false,
      dialogTitle: '',
      dialogVisible: false,
      addHourShow: true,
      searchForm: {
        pageNum: 0,
        pageSize: 10,
        studentStatus: null,
        value: ''
      },
      timeForm: {
        id: '',
        purchaseHours: 0,
        presentHours: 0,
        total: 0
      },
      form: {
        id:"",
        username: '',
        gender: null,
        age: null,
        phone: '',
        backupPhone: '',
        school: '',
        address: '',
        classId: '',
        studentStatus: null,
        presentHours: 0,
        purchaseHours: 0,
        remark: '',
        classHourRecordResponseList: []
      },
      resetForm: {
        id:"",
        username: '',
        gender: null,
        age: null,
        phone: '',
        backupPhone: '',
        school: '',
        address: '',
        classId: '',
        studentStatus: null,
        presentHours: 0,
        purchaseHours: 0,
        remark: '',
        classHourRecordResponseList: []
      },
      hourForm: {
        recordTime: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        type: null,
        paymentHours: null,
        presentHours: null,
        price: null,
        detail: '',
        studentId:""
      },
      tableData: [],
      timeData: [],
      classList: [],
      role:""
    };
  },
  components: {pagination},
  created() {
    this.getData()
    this.getClass()
    const accountInfo = JSON.parse(sessionStorage.getItem('accountInfo'))
    this.role = accountInfo.adminRole
  },
  methods: {
    showSuccess(res, file) {
      console.log(res);
      if(res.code != 200){
        MessageBox.alert(res.message,'警告',{
          confirmButtonClass: "el-button--myPrimary",
          type: "warning"
        })
      }else{
        this.getData()
      }
    },
    beforeUpload(file) {

    },
    exportClick(){
      exportExcel("/student/export", this.searchForm)
      .then(res => {
        if(res.data) {
          let fileName = '学员信息.xlsx'
          let blob = new Blob([res.data],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
          if(window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob,fileName)
          }
          else {        
            let URL = window.URL || window.webkitURL
            let a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = fileName   
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(a.href)
          }
        } 
      });
    },
    exportTimeClick(){
      exportExcel("/student/consume/list/export/"+this.timeForm.id)
      .then(res => {
        if(res.data) {
          let fileName = '学员上课记录.xlsx'
          let blob = new Blob([res.data],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
          if(window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob,fileName)
          }
          else {        
            let URL = window.URL || window.webkitURL
            let a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = fileName   
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(a.href)
          }
        } 
      });
    },
    getClass(){
      myPost("/classInfo/normal/list",{})
      .then(res => {
        this.classList = [...res.data.data];
      });  
    },
    getSearch(){
      this.pageNum = 1
      this.getData()
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1
      myPost("/student/page", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    clearClick(item) {
      this.searchForm[item] = null
    },
    addClick() {
      this.dialogTitle = '添加学员'
      this.form = {...this.resetForm}
      this.dialogVisible = true
    },
    lookClick(row){
      myPost("/student/detail/"+row.id)
      .then(res => {
        this.form = {...res.data.data};
        this.dialogTitle = '查看学员'
        this.dialogVisible = true
        this.hourForm.studentId = row.id
      });  
    },
    editClick(row) {
      myPost("/student/detail/"+row.id)
      .then(res => {
        this.form = {...res.data.data};
        this.dialogTitle = '编辑学员'
        this.dialogVisible = true
        this.hourForm.studentId = row.id
      });  
    },
    timeClick(row) {
      this.timeForm.id = row.id
      this.timeForm.purchaseHours = row.purchaseHours
      this.timeForm.presentHours = row.presentHours
      this.getTimeData(row.id)
      this.timeVisible = true
    },
    getTimeData(studentId){
      myPost("/student/consume/list/"+studentId)
      .then(res => {
        this.timeForm.total = 0
        this.timeData = [...res.data.data];
        for(let i=0;i<this.timeData.length;i++) {
          this.timeForm.total = +this.timeData[i].price+this.timeForm.total
        }
      });  
    },
    addRecordClick() {
      this.addHourShow = true
    },
    submitAddHour() {
      myPost("/student/classHourRecord/add",this.hourForm)
      .then(res=>{
        this.$message.success('添加成功')
        this.addHourShow = false
        this.editClick({id:this.hourForm.studentId})
      })
    },
    submitAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          myPost("/student/add", this.form)
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
          myPost("/student/edit", this.form)
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
  .total_box {
    text-align: right;
    font-size: 12px;
  }
  .total {
    display: inline-block;
    width: 93px;
    padding-top: 10px;
    text-align: center;
  }
</style>