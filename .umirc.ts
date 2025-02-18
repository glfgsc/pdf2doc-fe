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
            target: 'http://www.icoincat.cn',
            changeOrigin: true,
            secure: false,
            // 'pathRewrite': { '^/api' : '' }
        },
    },
    routes: [
        {
            path: '/',
            component: '@/layouts/GlobalLayout',
            layout: false,
            routes: [
                {
                    path: '/',
                    redirect: '/login'
                },
                {
                    path: '/document',
                    component: '@/pages/workspace',
                    wrappers: ['@/wrappers']
                },
                {
                    path: '/setting',
                    component: '@/pages/workspace',
                    wrappers: ['@/wrappers']
                },
                {
                    path: '/user',
                    component: '@/pages/workspace',
                    wrappers: ['@/wrappers']
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