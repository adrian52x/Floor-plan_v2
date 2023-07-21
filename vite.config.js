import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// export default defineConfig({
// 	plugins: [sveltekit()]
// });

export default defineConfig({
	server: {
	  port: 80, // Change the port number to 80
	},
	plugins: [sveltekit()]
  });
