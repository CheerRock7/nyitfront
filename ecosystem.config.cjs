// PM2 process configuration for the Next.js app.
// Usage on the server (from the project dir):
//   pm2 start ecosystem.config.cjs
//   pm2 save
module.exports = {
  apps: [
    {
      name: "nyitfront",
      cwd: "/var/www/nyitfront",
      script: "npm",
      args: "start", // runs `next start --hostname 127.0.0.1` (see package.json)
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
