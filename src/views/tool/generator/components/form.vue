<template>
  <div class="app-container">
    <el-dialog title="代码生成配置" :visible.sync="dialogVisible" width="50%" @before-close="reset">
        <div>
          <el-form :model="form" ref="form" style="width: 80%;margin-left: 10%" :rules="rules">
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属包名" :label-width="formLabelWidth" prop="packageName">
                  <el-input v-model="form.packageName" style="width: 70%" size="small"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属模块" :label-width="formLabelWidth" prop="moduleName">
                  <el-input v-model="form.moduleName" style="width: 70%" size="small"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="生成作者" :label-width="formLabelWidth" prop="author">
                  <el-input v-model="form.author"  style="width: 70%" size="small"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示类型" :label-width="formLabelWidth" prop="viewType">
                  <el-input v-model="form.viewType"  style="width: 70%" size="small"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-table :data="form.tableInfo.columnList" v-loading="loading" style="width: 100%" height="25em">
            <el-table-column align="center" label="序号" type="index" width="50"/>
            <el-table-column align="center" label="字段名称" prop="columnName" width="100"/>
            <el-table-column align="center" label="字段类型" prop="columnType" width="100"/>
            <el-table-column align="center" label="字段说明" prop="columnComment" width="100" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="查询方式" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.searchType" placeholder="请选择检索方式" size="small">
                  <el-option label="模糊查询" value="like"/>
                  <el-option label="精确查询" value="equals"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否列表显示" width="150">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enableListView" inactive-text="否" active-text="是" active-color="#13ce66" inactive-color="#ff4949"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否列表检索条件" width="150">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enableListQuery" inactive-text="否" active-text="是" active-color="#13ce66" inactive-color="#ff4949"/>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否表单显示">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enableFormView" inactive-text="否" active-text="是" active-color="#13ce66" inactive-color="#ff4949"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generate">确 定</el-button>
        <el-button @click="reset">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectColumnList, generateCode } from '@/api/tool/generator/index'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'form',
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: '80',
      form: {
        packageName: '',
        moduleName: '',
        author: '',
        viewType: '',
        enableForm: true,
        tableInfo: {
          database: '',
          tableName: '',
          columnList: []
        }
      },
      loading: false,
      rules: {
        packageName: [
          { required: true, message: '请输入包名称', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '请输入模块名称', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者名称', trigger: 'blur' }
        ],
        viewType: [
          { required: true, message: '请选择前端组件类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    initData(query) {
      this.dialogVisible = true
      this.loading = true
      this.form.tableInfo.tableName = query.tableName
      this.form.tableInfo.database = query.database
      selectColumnList(query).then(res => {
        this.form.tableInfo.columnList = res.data
        this.loading = false
      })
    },
    generate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const token = getToken()
          axios({
            url: '/api/system/generator/generate',
            method: 'post',
            data: this.form,
            responseType: 'blob',
            headers: { 'Authorization': token }
          }).then(res => {
            if (!res) {
              return
            }
            let binaryData = [];
            binaryData.push(res.data);
            const url = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            const tables = 'test'
            link.setAttribute('download', this.form.author + '_' + tables + '.zip')
            document.body.appendChild(link)
            link.click()
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请填写必要信息',
            duration: 1000
          })
          return false
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
