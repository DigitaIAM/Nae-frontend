
const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/admin/',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/admin/CompaniesPage.vue') },
      { path: 'users', component: () => import('src/pages/admin/UsersPage.vue') },
      { path: 'companies', component: () => import('src/pages/admin/CompaniesPage.vue') },
      { path: 'cameras', component: () => import('src/pages/admin/CamerasPage.vue') },
      { path: 'shifts', component: () => import('src/pages/admin/ShiftsPage.vue') },
      { path: 'people', component: () => import('src/pages/admin/PeoplePage.vue') },
      { path: 'events', component: () => import('src/pages/admin/EventsPage.vue') },

      { path: 'attendance', component: () => import('src/pages/admin/AttendanceReport.vue') },

      // { path: '/admin', component: () => import('pages/admin/IndexPage.vue'), meta: { requireLogin: true } }
    ]
  },
  {
    path: '/hr/',
    component: () => import('src/layouts/HRLayout.vue'),
    children: [
      { path: 'attendance/date', component: () => import('src/pages/admin/AttendanceReport.vue') },
      { path: 'attendance/month', component: () => import('src/pages/admin/AttendanceMonthlyReport.vue') },
      { path: 'people', component: () => import('src/pages/admin/PeoplePage.vue') },
      { path: 'cameras', component: () => import('src/pages/admin/CamerasPage.vue') },


      // { path: '/admin', component: () => import('pages/admin/IndexPage.vue'), meta: { requireLogin: true } }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/HumanResouces.vue'),
    children: [
      { path: '', component: () => import('pages/DashBoard.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
