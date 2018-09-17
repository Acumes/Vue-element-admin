import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/dataCenter',
    component: Layout,
    redirect: '/dataCenter/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'dataCenter',
      icon: 'dataCenter',
      permission: 'sys:dashboard'
    },
    children: [{
      path: 'user',
      component: () => import('@/views/user/user-list/userList'),
      name: 'user',
      meta: {
        title: 'user',
        icon: 'user',
        permission: 'sys:user'
      }
    }, {
      path: 'role',
      component: () => import('@/views/role/'),
      name: 'role',
      meta: {
        title: 'role',
        icon: 'role',
        permission: 'sys:role'
      }
    }, {
      path: 'menu',
      component: () => import('@/views/menu/'),
      name: 'menu',
      meta: {
        title: 'menu',
        icon: 'menu',
        permission: 'sys:menu'
      }
    }]
  },
  {
    path: '/monitor',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'monitor',
      icon: 'dataCenter',
      permission: 'sys:monitor'
    },
    children: [{
      path: 'druid',
      component: () => import('@/views/druid/'),
      name: 'druid',
      meta: {
        title: 'druid',
        icon: 'druid',
        permission: 'sys:monitor:druid'
      }
    }]
  },

  {
    path: '/doc',
    component: Layout,
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'doc',
      icon: 'dataCenter',
      permission: 'sys:doc'
    },
    children: [{
      path: 'swagger',
      component: () => import('@/views/swagger/'),
      name: 'swagger',
      meta: {
        title: 'swagger',
        icon: 'dataCenter',
        permission: 'sys:doc:swagger'
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]
