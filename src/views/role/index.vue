<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                :placeholder="$t('role.table.name')" v-model="listQuery.name">
      </el-input>
      <el-select @change='handleFilter' style="width: 140px"
                 class="filter-item"
                 :placeholder="$t('role.table.enable')"
                 clearable v-model="listQuery.enable">
        <el-option v-for="item in status" :key="item.key" :label="$t(item.label)" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">
        {{$t('table.search')}}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row
              style="width: 100%;">
      <el-table-column
        type="index"
        :label="$t('table.id')"
        width="50">
      </el-table-column>
      <el-table-column align="center"  width="220px" :label="$t('role.table.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('role.table.remarks')">
        <template slot-scope="scope">
          <span>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('role.table.createUserName')">
        <template slot-scope="scope">
          <span>{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('role.table.createDate')">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" :label="$t('role.table.enable')">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled === '1'">{{$t('role.enabled')}}</span>
          <span v-if="scope.row.enabled === '2'">{{$t('role.disabled')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button  size="mini" type="danger"
                     @click="handleDelete(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="dialogStatus === 'create' ? $t('user.create') : $t('user.update')"
               :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('role.table.name')" prop="name">
          <el-input v-model="temp.name" :placeholder="$t('role.placeholder.name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('role.table.remarks')" prop="remarks">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('role.placeholder.remarks')"
                    v-model="temp.remarks">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('user.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('user.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('user.confirm')}}</el-button>
      </div>
    </el-dialog>

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
      return {
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
      }
    }
  }
</script>
