// PM2 process file used by deploy/setup.sh
module.exports = {
  apps: [
    {
      name: "dmimo",
      cwd: "/var/www/dmimo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
    },
  ],
};
