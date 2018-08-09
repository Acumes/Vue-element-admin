export default {
  user: {
    table: {
      name: '姓名',
      loginName: '用户名',
      email: '邮箱',
      mobile: '手机',
      createDate: '创建时间',
      enable: '状态',
      remarks: '备注',
      phone: '电话',
      password: '密码'
    },
    enabled: '可用',
    disabled: '不可用',
    confirm: '确定',
    cancel: '取消',
    create: '添加',
    update: '修改',
    validation: {
      existsLoginName: '该用户名已存在，请修改用户名',
      requiredLoginName: '用户名必填',
      requiredPassword: '密码必填',
      requiredMobile: '手机必填',
      requiredEmail: '邮箱必填',
      requiredName: '姓名必填'
    }
  }

}
