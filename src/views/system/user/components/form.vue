<template>
  <div class="app-container">
    <el-dialog title="表单页面" :visible.sync="dialogVisible" width="30%" @before-close="reset">
      <div>
        <el-form :model="form" ref="form" :rules="rules" status-icon>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" style="width: 80%" size="small"/>
          </el-form-item>
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="form.username" style="width: 80%" size="small"/>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
            <el-input v-model="form.sex"  style="width: 80%" size="small"/>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone"  style="width: 80%" size="small"/>
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="form.address"  style="width: 80%" size="small"/>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark"  style="width: 80%" size="small"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-if="status === 'create'">
        <el-button type="primary" @click="doCreate" size="small">确 定</el-button>
        <el-button @click="reset" size="small">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else-if="status === 'edit'">
        <el-button type="primary" @click="doUpdate" size="small">确 定</el-button>
        <el-button @click="reset" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { add, getByKey, update } from '@/api/system/user/index'

export default {
  name: 'form',
  props: {
    status: {
      type: String,
      default: 'view'
    }
  },
  data() {
    return {
      dialogVisible: false,
      formLabelWidth: '100px',
      form: {
        id: null,
        name: null,
        username: null,
        sex: null,
        phone: null,
        address: null,
        remark: null
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      },
      status: ''
    }
  },
  created() {
  },
  methods: {
    show(id) {
      if (id != undefined && id != null) {
        getByKey(id).then(res => {
          this.form = res.data
        })
      }
      this.dialogVisible = true
    },
    reset() {
      this.$refs.form.resetFields()
      this.form.id = null
      this.dialogVisible = false
    },
    doCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          add(this.form).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.reset()
            this.$emit('reload')
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写表单信息！',
            duration: 1000
          })
          return false
        }
      })
    },
    doUpdate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          update(this.form).then(res => {
            this.$message({
              message: '更新成功！',
              type: 'success'
            })
            this.reset()
            this.$emit('reload')
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写表单信息！',
            duration: 1000
          })
          return false
        }
      })
    }
  }
}
</script>
