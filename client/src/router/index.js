import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import api from '../api/axios'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            name: "notfound",
            component: NotFoundView
        },

        {
            path: '/',
            name: 'home',
            component: HomeView
        },

        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/AuthView.vue')
        },

        {
            path: '/create/projects',
            name: 'createProject',
            component: () => import('../views/CreateProjectView.vue'),
            meta: { requiresAuth: true } 
        },

        {
            path: '/projects',
            name: 'projects',
            component: () => import('../views/ProjectsView.vue'),
            meta: { requiresAuth: true } 
        },

        {
            path: '/projects/:id',
            name: 'project',
            component: () => import('../views/ProjectView.vue'),
            meta: { requiresAuth: true } 
        },

        {
            path: '/commits/:id',
            name: 'commit',
            component: () => import('../views/CommitView.vue'),
            meta: { requiresAuth: true }
        },

        {
            path: '/projects/:id/settings',
            name: 'coauthors',
            component: () => import('../views/SettingsView.vue'),
            meta: { requiresAuth: true } 
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            await api.get('/users')
            next()
        } catch (error) {
            next('/')
        }
    } else {
        next()
    }
});


export default router