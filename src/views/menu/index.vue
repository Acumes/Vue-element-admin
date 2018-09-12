<template>
  <div class="app-container">
    <el-row>
      <p class="text-content">
        <el-button type="success" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="warning" icon="el-icon-edit">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete">删除</el-button>
      </p>
    </el-row>
    <el-row>
      <el-col :span="8" >
        <div>
          <el-row>
            <el-tree :data="list" node-key="id" default-expand-all :expand-on-click-node="false">
              <span  class="custom-tree-node" slot-scope="{ node, data }">
                <span  @click="menuInfo(data)" @dblclick="expandedIsShow(node,data)"> <i :class="node.icon"></i>{{ node.label }}</span>
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
  import { getMenuTree } from '@/api/dataCenter'

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
          id: ''
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
        this.form = {
          name: '',
          remarks: '',
          permission: '',
          icon: '',
          isShow: false,
          id: ''
        }
      },
      edit() {
        this.isAdd = false
      },
      menuInfo(data) {
        this.isAdd = false
        this.parentId = data.id
        this.parentName = data.name
        this.form = data
        if (data.isShow === '1') {
          this.form.isShow = true
        } else {
          this.form.isShow = false
        }
        debugger
      },
      onSubmit() {
        console.log(this.parentId)
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
