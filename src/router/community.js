import Main from '@/components/main/index'
export default [
  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'article',
        name: 'content_management',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '内容管理',
          notCache: true
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-trending-up',
          title: '标签管理',
          notCache: true
        },
        component: () => import('@/view/content/tags.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理',
      notCache: true // 不缓存
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '菜单管理',
          notCache: true
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限',
          notCache: true
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'logs_check',
        meta: {
          icon: 'ios-bug',
          title: '错误日志',
          notCache: true
        },
        component: () => import('@/view/logs/index.vue')
      }
    ]
  }
]
