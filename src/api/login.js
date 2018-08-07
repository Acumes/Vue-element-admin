import request from '@/utils/request'

export function loginByUsername(username, password) {
  return request({
    url: '/auth/token?username=' + username + '&password=' + password,
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/auth/token',
    method: 'delete'
  })
}

export function getUserInfo() {
  return request({
    url: '/users/getCurrentUser',
    method: 'get'
  })
}

