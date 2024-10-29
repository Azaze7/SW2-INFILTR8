import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    plugins: [sveltekit(), purgeCss()],
    server: {
        fs: {
            
            allow: [path.resolve('server/data')],
        },
    },
});
