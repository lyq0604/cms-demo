<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="queryForm.database" size="small" clearable placeholder="请选择数据库">
          <el-option
            v-for="(database, index) in databaseList"
            :key="index"
            :label="database"
            :value="database">
          </el-option>
        </el-select>
        <el-input v-model="queryForm.tableName" size="small" style="width: 13%" placeholder="请输入表名关键字" clearable/>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <div>
        <el-table
          :data="tableList"
          style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="100%"/>
          <el-table-column align="center" label="名称" prop="tableName" width="300%"/>
          <el-table-column align="center" label="存储引擎" prop="tableEngine" width="300%"/>
          <el-table-column align="center" label="说明" prop="tableName" width="600%"/>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="generate(scope.row)">生成代码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <column-form ref="columnForm"/>
  </div>
</template>

<script>
import { selectDatabaseList, selectTableList } from '@/api/tool/generator/index'
import ColumnForm from './components/form'

export default {
  name: 'Dict',
  components: {
    ColumnForm
  },
  data() {
    return {
      databaseList: [],
      tableList: [],
      columnList: [],
      queryForm: {
        database: '',
        tableName: ''
      }
    }
  },
  created() {
    this.getDatabaseList()
  },
  methods: {
    getDatabaseList() {
      selectDatabaseList().then(res => {
        this.databaseList = res.data
      })
    },
    search() {
      if (this.queryForm.database == null || this.queryForm.database == '') {
        this.$notify({
          type: 'warning',
          message: '请选择数据库！',
          duration: 1000
        })
      } else {
        selectTableList(this.queryForm).then(res => {
          this.tableList = res.data
        })
      }
    },
    generate(data) {
      const param = {
        database: this.queryForm.database,
        tableName: data.tableName
      }
      this.$refs.columnForm.initData(param)
    }
  }
}
</script>
