import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        // Prevent Vite from clearing the output directory
        // This is critical because customer microsite folders exist in dist/
        emptyOutDir: false,

        // Output directory
        outDir: 'dist',

        // Only build the root index.html (landing page)
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    }
});
