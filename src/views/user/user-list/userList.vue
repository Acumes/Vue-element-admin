<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item"
                :placeholder="$t('table.title')" v-model="listQuery.title">
      </el-input>
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance"
                 :placeholder="$t('table.importance')">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type"
                 :placeholder="$t('table.type')">
        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'"
                   :value="item.key">
        </el-option>
      </el-select>
      <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
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
      <el-table-column width="220px" align="center" :label="$t('user.table.loginName')">
        <template slot-scope="scope">
          <span>{{scope.row.loginName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.table.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('user.table.email')">
        <template slot-scope="scope">
          <span style='width:200px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;' :title="scope.row.email">{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('user.table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" :label="$t('user.table.enable')">
        <template slot-scope="scope">
          <span v-if="scope.row.enabled === '1'">{{$t('user.enabled')}}</span>
          <span v-if="scope.row.enabled === '2'">{{$t('user.disabled')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('user.table.createDate')">
        <template slot-scope="scope">
          <span>{{$getTime(scope.row.createDate)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger"
                     @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
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
        <el-form-item :label="$t('user.table.loginName')" prop="loginName">
          <el-input v-model="temp.loginName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.table.password')" prop="password" v-if="dialogStatus === 'create'">
          <el-input v-model="temp.password"></el-input>
        </el-form-item>

        <el-form-item :label="$t('user.table.name')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.table.mobile')" prop="mobile">
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.table.phone')" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.table.email')" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.table.remarks')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input"
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
  import { getList, addUser, updateUser, checkUser } from '@/api/user'
  import waves from '@/directive/waves' // 水波纹指令

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  export default {
    name: 'userList',
    directives: {
      waves
    },
    data() {
      /* 自定义表单校验 */
      const checkUserName = (rule, value, callback) => {
        if (value !== '') {
          const params = {
            loginName: this.temp.loginName,
            edit: this.dialogStatus === 'create' ? 'false' : 'true',
            userId: this.temp.id
          }
          checkUser(params).then(response => {
            if (response.data) {
              callback(new Error())
            }
            callback()
          }).catch(oError => {
          })
        } else {
          callback()
        }
      }
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: '',
          name: '',
          remarks: '',
          email: '',
          mobile: '',
          phone: '',
          loginName: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        dialogPvVisible: false,
        pvData: [],
        rules: {
          loginName: [
            { required: true, message: this.$t('user.validation.requiredLoginName'), trigger: 'blur' }, { validator: checkUserName, message: this.$t('user.validation.existsLoginName'), trigger: 'blur' }
          ],
          password: [{ required: true, message: this.$t('user.validation.requiredPassword'), trigger: 'blur' }],
          email: [{ required: true, message: this.$t('user.validation.requiredEmail'), trigger: 'blur' }],
          mobile: [{ required: true, message: this.$t('user.validation.requiredMobile'), trigger: 'blur' }],
          name: [{ required: true, message: this.$t('user.validation.requiredName'), trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response.data.users
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getUserList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getUserList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getUserList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      resetTemp() {
        this.temp = {
          id: '',
          loginName: '',
          remarks: '',
          name: '',
          email: '',
          phone: '',
          mobile: ''
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
            addUser(this.temp).then(response => {
              this.dialogFormVisible = false
              this.getUserList()
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
            updateUser(tempData).then(response => {
              this.dialogFormVisible = false
              this.getUserList()
            }).catch(oError => {
              console.log(oError)
            })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }
    }
  }
</script>
