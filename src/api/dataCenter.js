import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/users/getUsers',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/users/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}

export function checkUser(data) {
  return request({
    url: '/users/checkUser',
    method: 'post',
    data
  })
}

export function delUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}

export function getRoles(data) {
  return request({
    url: '/roles/getRoles',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/roles/',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/roles/',
    method: 'put',
    data
  })
}

export function delRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}

export function getMenuTree() {
  return request({
    url: '/roles/getRoles',
    method: 'post'
  })
}
