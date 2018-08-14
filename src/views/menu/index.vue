<template>
  <div class="app-container">
    <el-row>
      <p class="text-content">
        <el-button type="success" icon="el-icon-plus">新增</el-button>
        <el-button type="warning" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </p>
    </el-row>
    <el-row>
      <el-col :span="10" >
        <div style="border: 1px solid #0000ff">
          <el-row>asda</el-row>
          <el-row>
            <el-tree :data="data5" node-key="id" default-expand-all :expand-on-click-node="false">
              <span  class="custom-tree-node" slot-scope="{ node, data }">
                <span  @click="test(data)" @dblclick="expandedIsShow(node,data)"> <i :class="node.icon"></i>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-row>
        </div>
      </el-col>
      <el-col :span="14">asd</el-col>
    </el-row>
  </div>
</template>

<script>
  import { getRoles, addRole, updateRole, delRole } from '@/api/dataCenter'
  import waves from '@/directive/waves' // 水波纹指令
  import { status } from '@/utils/constant'

  export default {
    name: 'roles',
    directives: {
      waves
    },
    data() {
      const data = [{
        id: 1,
        icon: 'el-icon-delete',
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            icon: 'el-icon-info',
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }]
      return {
        data5: JSON.parse(JSON.stringify(data)),
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        temp: {
          id: '',
          name: '',
          remarks: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        status,
        rules: {
          name: [{ required: true, message: this.$t('role.validation.requiredName'), trigger: 'blur' }],
          remarks: [{ required: true, message: this.$t('role.validation.requiredRemarks'), trigger: 'blur' }]
        }
      }
    },
    created() {
      document.title = this.$t('route.' + this.$route.meta.title)
      this.getRoleList()
    },
    methods: {
      getRoleList() {
        this.listLoading = true
        getRoles(this.listQuery).then(response => {
          this.list = response.data.roles
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getRoleList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getRoleList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getRoleList()
      },
      resetTemp() {
        this.temp = {
          id: '',
          remarks: '',
          name: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addRole(this.temp).then(response => {
              this.dialogFormVisible = false
              this.getRoleList()
            }).catch(oError => {
              console.log('d')
            })
          } else {
            console.log('1')
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.isEditPassword = false
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateRole(tempData).then(response => {
              this.dialogFormVisible = false
              this.getRoleList()
            }).catch(oError => {
              console.log(oError)
            })
          }
        })
      },
      handleDelete(row) {
        const that = this
        this.$confirm(this.$t('warning.text'), this.$t('warning.tips'), {
          confirmButtonText: this.$t('table.confirm'),
          cancelButtonText: this.$t('table.cancel'),
          type: 'warning'
        }).then(() => {
          delRole(row.id).then(resopnse => {
            this.$message({
              type: 'success',
              message: that.$t('warning.success')
            })
            this.getRoleList()
          }).catch(oError => {
            console.log(oError)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: that.$t('warning.fault')
          })
        })
      },
      expandedIsShow(node, data) {
        node.expanded = !node.expanded
        console.log(node)
        console.log(data)
      },
      test(data) {
        debugger
        console.log(data)
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
