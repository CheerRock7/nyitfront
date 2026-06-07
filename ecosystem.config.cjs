// PM2 process configuration for the Next.js app.
// Usage on the server (from the project dir):
//   pm2 start ecosystem.config.cjs
//   pm2 save
//
// Runs on port 3001 (3000 is taken by the existing `nyit-app` stocking system)
// and binds to 0.0.0.0 so it's reachable at http://SERVER_IP:3001. We call the
// Next binary directly to bypass the `--hostname 127.0.0.1` in package.json's
// start script (which would otherwise make it localhost-only).
module.exports = {
  apps: [
    {
      name: "nyitfront",
      cwd: "/var/www/nyitfront",
      script: "./node_modules/next/dist/bin/next",
      args: "start --hostname 0.0.0.0 --port 3001",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
