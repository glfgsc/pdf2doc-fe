import { defineConfig } from "umi";

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {
        title: '@umijs/max',
    },
    proxy: {
        '/api': {
            target: 'http://localhost:8081',
            changeOrigin: true,
            secure: false,
            'pathRewrite': { '^/api' : '' }
        },
    },
    routes: [
        {
            path: '/',
            component: '@/layouts/GlobalLayout',
            layout: false,
            routes: [
                {
                path: '/pdf',
                component: 'workspace'
                },
                {
                path: '/setting',
                component: 'workspace'
                },
                {
                path: '/user',
                component: 'workspace'
                },
                {
                path: '/login',
                component: 'login'
                }
            ]
        }
    ],
    npmClient: 'npm',
});