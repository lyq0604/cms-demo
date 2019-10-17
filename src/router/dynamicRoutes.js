import Layout from '@/layout'
/**
 * 动态路由，需要根据用户权限动态挂载
 */
const DynamicRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'example',
      permission: 'MENU_SYSTEM'
    },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index'),
        meta: {
          title: '用户管理',
          icon: 'table',
          permission: 'MENU_SYSTEM_USER'
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index'),
        meta: {
          title: '角色管理',
          icon: 'table',
          permission: 'MENU_SYSTEM_ROLE'
        }
      },
      {
        path: 'dict',
        name: 'Dict',
        component: () => import('@/views/system/dict/index'),
        meta: {
          title: '字典管理',
          icon: 'table',
          permission: 'MENU_SYSTEM_DICT'
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index'),
        meta: {
          title: '菜单管理',
          icon: 'table',
          permission: 'MENU_SYSTEM_MENU'
        }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/index',
    name: 'Blog',
    meta: {
      title: '博客管理',
      icon: 'example',
      permission: 'MENU_BLOG'
    },
    children: [
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/blog/article/index'),
        meta: {
          title: '文章管理',
          icon: 'table',
          permission: 'MENU_BLOG_ARTICLE'
        }
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import('@/views/blog/tag/index'),
        meta: {
          title: '标签管理',
          icon: 'table',
          permission: 'MENU_BLOG_TAG'
        }
      }
    ]
  }
]

export default DynamicRoutes
