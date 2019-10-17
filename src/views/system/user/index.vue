<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div>
        <el-table ref="table" :data="tableData" style="width: 100%">
          <el-table-column type="index" label="序号" width="100%" align="center"/>
          <el-table-column prop="name" label="姓名" width="200%" align="center"/>
          <el-table-column prop="username" label="用户名" width="200%" align="center"/>
          <el-table-column prop="sex" label="性别" width="150%" align="center"/>
          <el-table-column prop="qq" label="QQ" width="200%" align="center"/>
          <el-table-column prop="phone" label="电话号码" width="200%" align="center"/>
          <el-table-column prop="address" label="地址" width="300%" align="center"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small">查看</el-button>
              <el-button type="success" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableData: [
        {
          id: '1',
          name: '张三',
          username: 'zs',
          sex: '男',
          qq: '1234567890',
          phone: '13000000000',
          address: '北京市昌平区回龙观街道'
        }
      ]
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
