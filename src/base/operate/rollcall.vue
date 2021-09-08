<template>
  <div class="course_container">
    <div class="base-container">
      <div class="form-container">
        <div class="searchForm-container">
          <el-form inline ref="searchForm" :model="searchForm" size="small">
            <el-form-item label="">
              <el-date-picker
                v-model="searchForm.month"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
             
            </el-form-item>
            <el-form-item label="">
              <el-select
                v-model="searchForm.status"
                placeholder="点名状态"
                style="width: 140px"
                clearable
                @clear="clearClick('teacherStatus')"
              >
                <el-option label="已点名" value="CALLED"></el-option>
                <el-option label="未点名" value="NOT_CALLED"></el-option>
                <el-option label="漏点名" value="MISSED_CALL"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input
                v-model="searchForm.keyword"
                placeholder="课程名称、班级名称、教师"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="searchButton"
                @click="getSearch()"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="table-container">
          <el-table
            stripe
            :data="tableData"
            style="width: 100%"
            size="small"
            :header-cell-style="{ backgroundColor: '#f2f2f2' }"
          >
            <el-table-column align="center" label="课程名称" prop="courseName"></el-table-column>
            <el-table-column
              align="center"
              prop="className"
              label="班级名称"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="startTime"
              label="上课时间"
            ></el-table-column>
            <el-table-column align="center" prop="teacherName" label="教师">
            </el-table-column>
            <el-table-column align="center" prop="price" label="学时">
              
            </el-table-column>
            <el-table-column align="center" prop="status" label="点名状态">
              <template slot-scope="scope">
                <span
                  class="color-green"
                  v-if="scope.row.status === 'CALLED'"
                  >已点名</span
                >
                <span
                  class="color-red"
                  v-if="scope.row.status === 'NOT_CALLED'"
                  >未点名</span
                >
                <span
                  class="color-red"
                  v-if="scope.row.status === 'MISSED_CALL'"
                  >漏点名</span
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            @pagination="getData()"
            :pageIndex.sync="pageNum"
            :pageSize.sync="searchForm.pageSize"
            :total="total"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination/pagination";
import { myPost, base_url } from "@/api/http";
export default {
  data() {
    return {
      uploadUrl: base_url + "/upload",
      total: 0,
      pageNum: 1,
      dialogTitle: "",
      dialogVisible: false,
      addHourShow: false,
      searchForm: {
        pageNum: 0,
        pageSize: 10,
        status: null, //点名状态
        month: null, //时间
        keyword: null, //关键词
      },
      form: {
        id: "",
        username: "",
        avatar: "",
        gender: null,
        phone: "",
        teacherStatus: null,
        specialty: "",
        resume: "",
        remark: "",
      },
      resetForm: {
        id: "",
        username: "",
        avatar: "",
        gender: null,
        phone: "",
        teacherStatus: null,
        specialty: "",
        resume: "",
        remark: "",
      },
      hourForm: {
        recordTime: "",
        type: null,
        paymentHours: null,
        presentHours: null,
        price: null,
        detail: "",
      },
      tableData: [],
      timeData: [],
      classList: [],
    };
  },
  components: { pagination },
  created() {
    this.getData();
  },
  methods: {
    showSuccess(res, file) {
      this.form.avatar = res.data;
    },
    getSearch() {
      this.pageNum = 1;
      this.getData();
    },
    getData() {
      this.searchForm.pageNum = this.pageNum - 1;
      console.log(this.searchForm);
      myPost("/rollCallPv/page", this.searchForm).then((res) => {
        console.log(res)
        this.tableData = [...res.data.data.content];
        this.total = res.data.data.totalElements;
      });
    },
    clearClick(item) {
      this.searchForm[item] = null;
    },
  },
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
.rest_time,
.hour_form {
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