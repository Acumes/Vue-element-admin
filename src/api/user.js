import request from '@/utils/request'

export function getList(data) {
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

