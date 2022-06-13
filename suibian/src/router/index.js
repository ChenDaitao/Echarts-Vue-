import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/views/Home')
  },
  {
    path: '/seller',
    component: () => import('@/views/SellerPage')
  },
  {
    path: '/trend',
    component: () => import('@/views/TrendPage')
  },
  {
    path: '/mappage',
    component: () => import('@/views/MapPage')
  },
  {
    path: '/rank',
    component: () => import('@/views/RankPage')
  },
  {
    path: '/hot',
    component: () => import('@/views/HotPage')
  },
  {
    path: '/stock',
    component: () => import('@/views/StockPage')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
