<template>
  <div class="app-container">
    <el-row>
      <p class="text-content">
        <el-button v-if="$store.getters.permissions.includes('sys:menu:add')" type="success" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="$store.getters.permissions.includes('sys:menu:edit')" type="warning" icon="el-icon-edit" @click="edit">编辑</el-button>
        <el-button v-if="$store.getters.permissions.includes('sys:menu:delete')" type="danger" icon="el-icon-delete" @click="deleteMenu">删除</el-button>
      </p>
    </el-row>
    <el-row>
      <el-col :span="8" >
        <div>
          <el-row>
            <el-tree :data="list" node-key="id" default-expand-all :expand-on-click-node="false">
              <span  class="custom-tree-node" slot-scope="{ node, data }">
                <span  @click="menuInfo(data)" @dblclick="expandedIsShow(node,data)"> <i :class="node.icon"></i><span style="padding-left: 5px;">{{ node.label }}</span></span>
              </span>
            </el-tree>
          </el-row>
        </div>
      </el-col>
      <el-col :span="16" >
        <div>
          <el-row>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="父级节点" v-if="isAdd">
                <span>{{parentName}}</span>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="form.name"  :disabled="isDisabled" style="width: 60%;"></el-input>
              </el-form-item>
              <el-form-item label="是否显示">
                <el-switch v-model="form.isShow" :disabled="isDisabled"></el-switch>
              </el-form-item>
              <el-form-item label="icon">
                <el-input v-model="form.icon" style="width: 60%;" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="权限">
                <el-input v-model="form.permission" style="width: 60%;" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="说明">
                <el-input type="textarea" v-model="form.remarks" style="width: 60%;" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item v-if="!isDisabled">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getMenuTree, addMenu, updateMenu, delMenu, getCountChild } from '@/api/dataCenter'

  export default {
    name: 'roles',
    data() {
      return {
        list: null,
        listLoading: true,
        form: {
          name: '',
          remarks: '',
          permission: '',
          icon: '',
          isShow: false,
          id: '',
          parentId: ''
        },
        parentId: '',
        parentName: '',
        isAdd: false,
        isDisabled: true,
        rules: {
          name: [{ required: true, message: this.$t('role.validation.requiredName'), trigger: 'blur' }],
          remarks: [{ required: true, message: this.$t('role.validation.requiredRemarks'), trigger: 'blur' }]
        }
      }
    },
    created() {
      document.title = this.$t('route.' + this.$route.meta.title)
      this.getTree()
    },
    methods: {
      getTree() {
        const that = this
        this.listLoading = true
        getMenuTree().then(response => {
          this.list = response.data
          that.recursion(this.list)
        }).catch(oError => {
        })
      },
      recursion(data) {
        data.forEach(item => {
          item.label = item.name
          if (item.children) {
            this.recursion(item.children)
          }
        })
      },
      add() {
        this.isDisabled = false
        this.isAdd = true
        this.resetData()
      },
      edit() {
        if (this.parentId === '') {
          this.$alert('请选择要修改的菜单', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        this.isAdd = false
        this.isDisabled = false
      },
      menuInfo(data) {
        this.isAdd = false
        this.parentId = data.id
        this.parentName = data.name
        this.form = this.$cloneObj(data)
        if (data.isShow === '1') {
          this.form.isShow = true
        } else {
          this.form.isShow = false
        }
      },
      onSubmit() {
        console.log(this.parentId)
        if (this.isAdd) {
          this.form.parentId = this.parentId
          addMenu(this.form).then(res => {
            this.form.id = res.data
            this.menuInfo(this.form)
            this.isDisabled = true
            this.getTree()
          }).catch(oError => {
            console.log(oError)
          })
        } else {
          updateMenu(this.form).then(res => {
            if (this.form.isShow) {
              this.form.isShow = '1'
            } else {
              this.form.isShow = '0'
            }
            this.menuInfo(this.form)
            this.isDisabled = true
            this.getTree()
          }).catch(oError => {
            console.log(oError)
          })
        }
      },
      deleteMenu() {
        if (this.parentId === '') {
          this.$alert('请选择要删除的菜单', '提示', {
            confirmButtonText: '确定'
          })
          return
        }
        this.$confirm('确定要删除（' + this.parentName + '）菜单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 检查是否有子菜单。
          getCountChild(this.parentId).then(res => {
            if (res.data > 0) {
              this.$confirm('（' + this.parentName + '）还有子菜单，该删除操作会级联删除子菜单，确定删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.delMenuMethod()
              }).catch(oError => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              })
            } else {
              this.delMenuMethod()
            }
          }).catch(oError => {})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      expandedIsShow(data) {
        data.expanded = !data.expanded
      },
      resetData() {
        this.form = {
          name: '',
          remarks: '',
          permission: '',
          icon: '',
          isShow: false,
          id: '',
          parentId: ''
        }
      },
      delMenuMethod() {
        delMenu(this.parentId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.isDisabled = true
          this.isAdd = false
          this.resetData()
          this.parentId = ''
          this.parentName = ''
          this.getTree()
        }).catch(oError => {})
      }
    }
  }
</script>
<style scoped>
  .text-content{
    background: rgba(66, 185, 131, 0.2);
    border-radius: 2px;
    padding: 16px;
    padding: 1rem;
    line-height: 1.6rem;
    word-spacing: .05rem;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
