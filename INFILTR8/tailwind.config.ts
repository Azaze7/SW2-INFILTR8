import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
    theme: {
        extend: {
            animation: {
                grid: "grid 15s linear infinite",
                marquee: "marquee var(--duration) linear infinite",
                "marquee-vertical": "marquee-vertical var(--duration) linear infinite", // Vertical marquee animation
            },
            keyframes: {
                grid: {
                    "0%": { transform: "translateY(-50%)" },
                    "100%": { transform: "translateY(0)" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(calc(-100% - var(--gap)))" },
                },
                "marquee-vertical": {
                    from: { transform: "translateY(0)" },
                    to: { transform: "translateY(calc(-100% - var(--gap)))" },
                },
            },
        },
    },
    plugins: [
        forms,
        typography,
        skeleton({
            themes: {
                preset: [
                    {
                        name: 'wintry',
                        enhancements: true,
                    },
                    {   name: 'modern',
                        enhancements:true,
                    },
                    {
                        name: 'skeleton',
                        enhancements: true,
                    },
                ],
            },
        }),
    ],
} satisfies Config;
