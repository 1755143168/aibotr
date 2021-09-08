<template>
  <div class="infoboard_container">
    <div class="base-container">
      <div class="border_container">
        <div class="border_box first">
          <span class="top">学生统计</span>
          <ul class="border_list">
            <li>
              <span>{{ studentData.onSchoolNum }}</span>
              <span>在读</span>
            </li>
            <li>
              <span>{{ studentData.outSchoolNum }}</span>
              <span>休学</span>
            </li>
            <li>
              <span>{{ studentData.suspensionOfSchoolNum }}</span>
              <span>退学</span>
            </li>
            <li>
              <span>{{ studentData.totalNum }}</span>
              <span>共计</span>
            </li>
          </ul>
        </div>
        <div class="border_box">
          <span class="top">教师统计</span>
          <ul class="border_list">
            <li>
              <span>{{ teacherData.onJobNum }}</span>
              <span>在岗</span>
            </li>
            <li>
              <span>{{ teacherData.vacationNum }}</span>
              <span>休假</span>
            </li>
            <li>
              <span>{{ teacherData.outJobNum }}</span>
              <span>离职</span>
            </li>
            <li>
              <span>{{ teacherData.totalNum }}</span>
              <span>共计</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="table-container">
        <div class="top_container">
          <span class="top">课程统计</span>
          <div class="time_box">
            <span :class="{active: searchForm.dataUnit==='TODAY'}" @click="getSearch('TODAY')">今日</span>
            <span :class="{active: searchForm.dataUnit==='WEEK'}" @click="getSearch('WEEK')">本周</span>
            <span :class="{active: searchForm.dataUnit==='MONTH'}" @click="getSearch('MONTH')">本月</span>
          </div>
        </div>
        <el-table stripe :data="tableData" style="width: 100%" size="small" :header-cell-style="{backgroundColor:'#ECF6FF'}">
          <el-table-column fixed align="center" prop="startTime" label="时间" min-width="150px"></el-table-column>
          <el-table-column align="center" prop="courseName" label="课程" min-width="100px"></el-table-column>
          <el-table-column align="center" prop="className" label="班级" min-width="100px"></el-table-column>
          <el-table-column align="center" prop="teacherName" label="教师" min-width="80px"></el-table-column>
          <el-table-column align="center" prop="phone" label="手机" min-width="100px"></el-table-column>
        </el-table>
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
      total: 0,
      pageNum: 1,
      studentData:{
        onSchoolNum:"",
        outSchoolNum:"",
        suspensionOfSchoolNum:"",
        totalNum:""
      },
      teacherData:{
        onJobNum:"",
        vacationNum:"",
        outJobNum:"",
        totalNum:""
      },
      searchForm: {
        dataUnit: 'TODAY',
      },
      tableData: []
    };
  },
  components: {pagination},
  created() {
    this.getData()
    this.getStudentData()
    this.getTeacherData()
  },
  methods: {
    getStudentData(){
      myPost("/dashBoard/student")
      .then(res => {
        this.studentData = {...res.data.data};
      });
    },
    getTeacherData(){
      myPost("/dashBoard/teacher")
      .then(res => {
        this.teacherData = {...res.data.data};
      });
    },
    getSearch(value){
      this.searchForm.dataUnit = value
      this.getData()
    },
    getData() {
      myPost("/dashBoard/course", this.searchForm)
      .then(res => {
        this.tableData = [...res.data.data];
      });
    },
  }
};
</script>

<style scoped>
  span {
    display: inline-block;
  }
  .border_container {
    display: flex;
    justify-content: space-between;
  }
  .border_box {
    width: 50%;
    background-color: #fff;
    margin-bottom: 15px;
    padding: 0 20px;
  }
  .first {
    margin-right: 15px;
  }
  .top {
    font-size: 14px;
    padding: 10px 0;
  }
  .border_list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 50px 0 25px;
    border-top: 1px solid #eee;
  }
  .border_list li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .border_list li span:first-child {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .border_list li span:last-child {
    font-size: 14px;
  }
  .table-container {
    padding: 0 20px 20px;
    background-color: #fff;
  }
  .top_container {
    display: flex;
    justify-content: space-between;
  }
  .time_box {
    display: flex;
    align-items: center;
  }
  .time_box span {
    font-size: 12px;
    padding: 5px 15px;
    background-color: #d7d7d7;
    cursor: pointer;
  }
  .time_box .active {
    background-color: #0090FF;
    color: #fff;
  }
</style>