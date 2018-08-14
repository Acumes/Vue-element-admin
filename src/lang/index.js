import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import enUserLocale from './user/user_en'
import zhUserLocale from './user/user_zh'
import enRoleLocale from './role/role_en'
import zhRoleLocale from './role/role_zh'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
    ...enUserLocale,
    ...enRoleLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale,
    ...zhUserLocale,
    ...zhRoleLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en or zh
  locale: Cookies.get('language') || 'zh',
  // set locale messages
  messages
})

export default i18n
