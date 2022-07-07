import Main from '@/components/main/index'
export default [
  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'article',
        name: 'content_management',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '内容管理'
        },
        component: () => import('@/view/content/index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-trending-up',
          title: '标签管理'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      }
    ]
  }
]
