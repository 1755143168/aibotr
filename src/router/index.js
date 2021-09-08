import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main/main'
import mainContent from '@/components/layout/mainContent'
import login from '@/components/login/login'
import noPermission from '@/components/noPermission/noPermission'

Vue.use(Router)

const router =  new Router({
  // mode: "history",
  routes: [
    {
      path: '/login',
      component: login,
    },
    {
      path:'/',
      redirect: '/login',
      component: main,
    },
    //入驻园区
    {
      path:'/normal_operate',
      redirect: '/normal_operate/infoboard',
      meta: { title: '日常运营'},
      component:main,
      children: [
        {
          path:'infoboard',
          meta: { title: '信息看板',require: true},
          component:() => import('@/base/operate/infoboard')
        },
        {
          path:'student',
          meta: { title: '学员管理',require: true},
          component:() => import('@/base/operate/student')
        },
        {
          path:'class',
          meta: { title: '班级管理',require: true},
          component:() => import('@/base/operate/class')
        },
        {
          path:'course',
          meta: { title: '课程管理',require: true},
          component:() => import('@/base/operate/course')
        },
        {
          path:'teacher',
          meta: { title: '教师管理',require: true},
          component:() => import('@/base/operate/teacher')
        },
        {
          path:'courseware',
          meta: { title: '课件管理',require: true},
          component:() => import('@/base/operate/courseware')
        },
        {
          path:'fileInfo',
          meta: { title: '文件管理',require: true},
          component:() => import('@/base/operate/fileInfo')
        },
        {
          path:'rollcall',
          meta: { title: '点名统计',require: true},
          component:() => import('@/base/operate/rollcall')
        }
      ]
    },
    //走进园区
    {
      path:'/sys_config',
      redirect: '/sys_config/notice',
      meta: {title: '系统设置'},
      component:main,
      children: [
        {
          path:'notice',
          meta: { title: '通知管理',require: true},
          component:() => import('@/base/sysconfig/notice')
        },
        {
          path:'password',
          meta: { title: '修改密码',require: true},
          component:() => import('@/base/sysconfig/password')
        },
        {
          path:'admin',
          meta: { title: '用户管理',require: true},
          component:() => import('@/base/sysconfig/admin')
        }
      ]
    }
  ]
})

router.beforeEach((to,from, next) => {
  if (to.meta.require) {
    if (sessionStorage.getItem('isLogin')!=='true') {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转首页时的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  next()
})
export default router