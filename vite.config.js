// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     build: {
//         outDir: 'dist',
//     },
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [react()],
//     build: {
//         outDir: 'dist',
//     },
//     server: {
//         headers: {
//             'X-Frame-Options': 'DENY',
//             'X-Content-Type-Options': 'nosniff',
//             'X-XSS-Protection': '1; mode=block',
//             'Referrer-Policy': 'strict-origin-when-cross-origin'
//         }
//     }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
    },
    server: {
        headers: {
            // Remove CSP from server headers since it's in index.html
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    },
    preview: {
        headers: {
            // Same headers for preview mode
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    }
})