/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import fs from "fs";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     https: {
//       key: fs.readFileSync("./localhost-key.pem"),
//       cert: fs.readFileSync("./localhost-cert.pem")
//     }
//   }
// });
