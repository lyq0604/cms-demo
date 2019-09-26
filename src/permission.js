import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout/index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

export function geneMenu(menus, routers) {
  menus.forEach((item) => {
    let menu = {
      path: item.menuPath,
      component: !item.menuPath ? Layout : () => import(`@/views${item.menuPath}`),
      hidden: false,
      children: [],
      name: item.menuName,
      meta: {
        title: item.menuName,
        icon: item.menuIcon,
        id: item.id
      }
    }
    if (item.children) {
      geneMenu(item.children, menu.children)
    }
    routers.push(menu)
  })
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          store.dispatch('getInfo').then((data) => {
            const routers = []
            geneMenu(data.menus, routers)
            // 动态挂载路由
            // const constRouters = router.options.routes
            // routers.concat(constRouters)
            console.log(router.options.routes)
            router.addRoutes(routers)
            next()
          })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
