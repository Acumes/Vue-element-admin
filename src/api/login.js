import request from '@/utils/request'

export function loginByUsername(username, password, captcha) {
  return request({
    url: '/auth/token?username=' + username + '&password=' + password + '&captchaCode=' + captcha,
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

export function getCaptcha() {
  return request({
    url: '/auth/captcha',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

