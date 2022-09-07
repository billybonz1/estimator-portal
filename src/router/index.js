import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Jobs', auth: true
    },
    component: () => import('../views/NewClaimsList.vue')
  },
  {
    path: '/newhome',
    name: 'newhome',
    meta: {
      title: 'Jobs', auth: true
    },
    component: () => import('../views/NewClaimsList.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/scopes',
    name: 'scopes',
    meta: {
      title: 'Jobs', auth: true
    },
    component: () => import('../views/NewClaimsList.vue')
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      title: 'Scope Details', auth: true
    },
    component: () => import('../views/ScopeDetails.vue')
  },
  {
    path: '/claim_details',
    name: 'claim_details',
    meta: {
      title: 'Claim Details', auth: true
    },
    component: () => import('../views/ClaimDetails.vue')
  }
]

store.getters.getLeftMenu.forEach((page) => {
  if (Array.isArray(page.sub_steps)) {
    page.sub_steps.forEach((SubStep) => {
      if (SubStep.view !== undefined) {
        routes.push(
          {
            path: '/' + SubStep.view,
            name: SubStep.view,
            meta: {
              title: SubStep.view, auth: true, layout: 'main'
            },
            component: () => import('../views/' + SubStep.view + '.vue')
          }
        )
      }
    })
  }
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const DEFAULT_TITLE = 'Estimator'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || DEFAULT_TITLE

  const currentUser = store.getters.getCurrentUser

  if (to.meta.auth && !currentUser.authenticated) {
    next('/login')
  } else {
    store.dispatch('SetupStep', to.name)
    next()
  }
})

export default router
