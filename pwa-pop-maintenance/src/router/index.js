import { createRouter, createWebHistory } from 'vue-router'
import FormPMView from '../views/FormPMView.vue'
import ReportDetailView from '../views/ReportDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'FormPM',
    component: FormPMView
  },
  {
    path: '/report-detail',
    name: 'ReportDetail',
    component: ReportDetailView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router