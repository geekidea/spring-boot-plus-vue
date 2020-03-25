import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/dashboard/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: '文档', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: 'swagger',
    component: Layout,
    children: [
      {
        path: 'http://47.105.159.10:8888/api/swagger-ui.html',
        meta: { title: 'SwaggerUI', icon: 'link' }
      }
    ]
  },
  {
    path: 'knife4j',
    component: Layout,
    children: [
      {
        path: 'http://47.105.159.10:8888/api/doc.html',
        meta: { title: 'SwaggerUI', icon: 'link' }
      }
    ]
  },
  {
    path: 'spring-boot-admin',
    component: Layout,
    children: [
      {
        path: 'http://47.105.159.10:8000/instances/58c15acdd00c/details',
        meta: { title: 'SpringBootAdmin', icon: 'link' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/system',
    component: Layout,
    redirect: '/system/list',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'user'
    },
    children: [
      {
        path: 'sys-user-list',
        component: () => import('@/views/system/sys-user/sys-user-list'),
        name: 'sysUserList',
        meta: { title: '用户管理', icon: 'edit' }
      },
      {
        path: 'sys-role-list',
        component: () => import('@/views/system/sys-role/sys-role-list'),
        name: 'sysRoleList',
        meta: { title: '角色管理', icon: 'edit' }
      },
      {
        path: 'sys-menu-list',
        component: () => import('@/views/system/sys-menu/sys-menu-list'),
        name: 'sysMenuList',
        meta: { title: '菜单管理', icon: 'edit' }
      },
      {
        path: 'sys-role-menu/:id(\\d+)',
        component: () => import('@/views/system/sys-role/sys-role-menu'),
        name: 'sysRoleMenu',
        meta: { title: '角色权限设置', noCache: true, activeMenu: '/system/sys-role-list' },
        hidden: true
      }
      // {
      //   path: 'sys-department',
      //   component: () => import('@/views/system/sys-user/sys-user-list'),
      //   name: 'sysUserList',
      //   meta: { title: '部门管理', icon: 'edit' }
      // }

    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
