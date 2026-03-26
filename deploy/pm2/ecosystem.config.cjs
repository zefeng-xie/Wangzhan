module.exports = {
  apps: [
    {
      name: 'wangzhan-backend',
      cwd: '/var/www/wangzhan/repo/backend',
      script: 'index.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}
