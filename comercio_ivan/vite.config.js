import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                // Styles
                '/resources/css/tailwind.css',
                '/resources/css/bootstrap.css',
                '/resources/css/app.css',
                '/resources/css/theme.css',
                // JS Files
                '/resources/js/app.jsx',
                '/resources/js/Administrador/Admin.jsx',
                '/resources/js/views/revision/negocios.jsx',
                '/resources/js/views/revision/detallesNegociosEntidad.jsx',
                '/resources/js/views/resolutivos/ResolutivoDetailsView.jsx',
                '/resources/js/views/NegocioByQrView.jsx',
                '/resources/js/views/NegocioByQrDetailsView.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js'
        }
    },
});
