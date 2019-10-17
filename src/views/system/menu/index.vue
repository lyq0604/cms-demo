<template>
  <div class="app-container">
    <el-container style="height: 50em">
      <el-aside width="20%">
        <el-card>
          <div slot="header" class="clearfix">
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              style="width: 90%">
            </el-input>
          </div>
          <div>
            <el-tree
              style="height: 40em;overflow: auto;line-height: 36px"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              highlight-current="true"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              v-loading="treeLoading"
              ref="tree">
            </el-tree>
          </div>
        </el-card>
      </el-aside>
      <el-main style="margin-left: 2%">
        <el-card style="height: 28em">
          <div slot="header">
            <el-button-group v-if="state === 'view'">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addMenu">新增</el-button>
              <el-button type="success" icon="el-icon-edit" size="small" @click="editMenu">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="doDelete">删除</el-button>
            </el-button-group>
            <el-button-group v-else-if="state === 'add'">
              <el-button type="success" size="small" @click="doAdd">保存</el-button>
              <el-button type="danger" size="small" @click="cancel">取消</el-button>
            </el-button-group>
            <el-button-group v-else>
              <el-button type="success" size="small" @click="doUpdate">保存</el-button>
              <el-button type="danger" size="small" @click="cancel">取消</el-button>
            </el-button-group>
          </div>
          <div>
            <el-form ref="form" :model="menuForm" label-width="100px" style="width: 90%;margin-left: 5%" :rules="rules">
              <el-row style="padding-top: 0.5em">
                <el-col :span="10">
                  <el-form-item label="菜单名称：" prop="menuName">
                    <el-input size="small" v-model="menuForm.menuName" :disabled="state === 'view'"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-left: 5%">
                  <el-form-item label="权限编码：" prop="permissionCode">
                    <el-input size="small" v-model="menuForm.permissionCode" :disabled="state === 'view'"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="父级菜单：" prop="parentId">
                    <el-select size="small" v-model="menuForm.parentId" :disabled="state === 'view'" filterable placeholder="请选择">
                      <el-option label="无" value="-1"/>
                      <el-option v-for="menu in menuList" :key="menu.id" :label="menu.menuName" :value="menu.id"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-left: 5%">
                  <el-form-item label="菜单路径：" prop="menuPath">
                    <el-input size="small" v-model="menuForm.menuPath" :disabled="state === 'view'"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="菜单图标：" prop="menuIcon">
                    <el-input size="small" v-model="menuForm.menuIcon" :disabled="state === 'view'"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-left: 5%">
                  <el-form-item label="前端组件：" prop="menuComponent">
                    <el-input size="small" v-model="menuForm.menuComponent" :disabled="state === 'view'"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="菜单状态：" prop="state">
                    <el-select size="small" v-model="menuForm.state" :disabled="state === 'view'">
                      <el-option label="启用" value="1"/>
                      <el-option label="禁用" value="0"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" style="margin-left: 5%">
                  <el-form-item label="是否隐藏：" prop="hidden">
                    <el-switch size="small" v-model="menuForm.hidden" :disabled="state === 'view'" active-text="是" inactive-text="否"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="菜单描述：" prop="menuDescription">
                    <el-input type="textarea" size="small" v-model="menuForm.menuDescription" :disabled="state === 'view'" style="width: 87%"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
        <el-card style="height: 18em;margin-top: 1em">
          <div slot="header">
            <el-button-group>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="openForAddOperation">新增</el-button>
              <el-button type="success" icon="el-icon-edit" size="small" @click="openForUpdateOperation">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteMenuOperation">删除</el-button>
            </el-button-group>
          </div>
          <div>
            <el-table
              ref="operationTable"
              height="12em"
              :data="operationList"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              highlight-current-row="true"
              style="width: 100%">
              <el-table-column
                type="selection"
                align="center"
                width="100%">
              </el-table-column>
              <el-table-column
                label="操作名称"
                width="600%"
                align="center"
                prop="operationName">
              </el-table-column>
              <el-table-column
                prop="permissionCode"
                align="center"
                label="权限编码">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-main>
    </el-container>
    <el-dialog title="操作权限" :visible.sync="dialogVisible" @before-close="resetOperationForm" width="30%">
      <el-form :model="operationForm" ref="operationForm" :rules="operationRules" style="width: 80%;margin-left: 10%">
        <el-form-item label="操作名称" label-width="60" prop="operationName">
          <el-input v-model="operationForm.operationName" size="small" style="width: 80%"/>
        </el-form-item>
        <el-form-item label="权限编码" label-width="60" prop="permissionCode">
          <el-input v-model="operationForm.permissionCode" size="small" style="width: 80%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="opeState === 'add'">
        <el-button type="primary" @click="saveOperation">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="updateOperation">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree, getMenuVo, getMenuList, createMenu, deleteMenu, modifyMenu } from '@/api/system/menu/index'
import { createOperation, updateOperation, selectByMenuId, deleteByIds } from '@/api/system/operation/index'

export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuForm: {
        id: null,
        menuName: '',
        menuPath: '',
        permissionCode: '',
        menuDescription: '',
        parentId: '',
        menuIcon: '',
        menuComponent: '',
        state: '1',
        hidden: false,
        children: []
      },
      operationForm: {
        id: null,
        operationName: '',
        menuId: '',
        permissionCode: ''
      },
      menuList: [],
      operationList: [],
      // 表单状态
      state: 'view',
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        permissionCode: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择父级菜单', trigger: 'blur' }
        ],
        menuPath: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        menuComponent: [
          { required: true, message: '请输入组件名称', trigger: 'blur' }
        ]
      },
      operationRules: {
        operationName: [
          { required: true, message: '请输入操作名称', trigger: 'blur' }
        ],
        permissionCode: [
          { required: true, message: '请输入权限编码', trigger: 'blur' }
        ]
      },
      treeLoading: false,
      dialogVisible: false,
      opeState: ''
    }
  },
  created() {
    this.initMenuTree()
    this.initMenuList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.menuName.indexOf(value) !== -1
    },
    initMenuTree() {
      this.treeLoading = true
      getMenuTree().then(response => {
        this.treeData = response.data
        this.treeLoading = false
      })
    },
    initMenuList() {
      getMenuList().then(response => {
        this.menuList = response.data
      })
    },
    nodeClick(nodeData, node, item) {
      getMenuVo(nodeData.id).then(response => {
        const { data } = response
        this.menuForm = data
        this.menuForm.children = nodeData.children
        this.operationList = data.operationList
      })
    },
    addMenu() {
      this.state = 'add'
      this.$refs.form.resetFields()
      this.menuForm.id = null
      this.operationList = []
    },
    editMenu() {
      this.state = 'edit'
    },
    doAdd() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          createMenu(this.menuForm).then(response => {
            this.state = 'view'
            this.initMenuTree()
            this.initMenuList()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写菜单信息',
            duration: 1000
          })
          return false
        }
      });
    },
    doUpdate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          modifyMenu(this.menuForm).then(response => {
            this.state = 'view'
            this.initMenuTree()
            this.initMenuList()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写菜单信息',
            duration: 1000
          })
          return false;
        }
      })
    },
    doDelete() {
      if (this.menuForm.children !== null && this.menuForm.children !== undefined && this.menuForm.children.length > 0) {
        this.$notify({
          type: 'warning',
          message: '当前菜单下含有子菜单，无法删除！',
          duration: 1000
        })
      } else {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMenu(this.menuForm.id).then(response => {
            this.initMenuTree()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    cancel() {
      this.state = 'view'
      if (this.state === 'add') {
        this.$refs.form.resetFields()
      } else {
      }
    },
    resetOperationForm() {
      this.$refs.operationForm.resetFields()
      this.opeState = ''
    },
    openForAddOperation() {
      if (this.menuForm.id === null) {
        this.$notify({
          type: 'error',
          message: '请选择菜单！',
          duration: 1000
        })
      } else {
        this.dialogVisible = true
        this.opeState = 'add'
        this.operationForm.menuId = this.menuForm.id
      }
    },
    saveOperation() {
      this.$refs['operationForm'].validate((valid) => {
        if (valid) {
          createOperation(this.operationForm).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.dialogVisible = false
            this.operationList.push(response.data)
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写操作信息',
            duration: 1000
          })
          return false
        }
      })
    },
    openForUpdateOperation() {
      if (this.$refs.operationTable.selection.length != 1) {
        this.$notify({
          type: 'warning',
          message: '请选择一条记录进行操作！',
          duration: 1000
        })
      } else {
        this.operationForm = this.$refs.operationTable.selection[0]
        this.dialogVisible = true
        this.opeState = 'edit'
      }
    },
    updateOperation() {
      this.$refs['operationForm'].validate((valid) => {
        if (valid) {
          updateOperation(this.operationForm).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            this.dialogVisible = false
          })
        } else {
          this.$notify({
            type: 'warning',
            message: '请正确填写操作信息',
            duration: 1000
          })
          return false
        }
      })
    },
    deleteMenuOperation() {
      if (this.$refs.operationTable.selection.length === 0) {
        this.$noyify({
          type: 'warning',
          message: '请选择要删除的记录！',
          duration: 1000
        })
      } else {
        let selection = []
        this.$refs.operationTable.selection.forEach(item => {
          selection.push(item.id)
        })
        deleteByIds(selection).then(response => {
          // selectByMenuId(this.menuForm.id).then(res => {
          //   this.operationList = res.data
          // })
        })
      }
    }
  }
}
</script>

<style>

  .el-aside {
    color: #333;
    text-align: center;
    margin-left: 1%;
    margin-top: 1em;
  }

  .el-main {
    color: #333;
  }

</style>
