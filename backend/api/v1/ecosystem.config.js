module.exports = {
    apps: [
      {
        name: "ukhupi-api",
        script: "dist/index.js", // Compiled JavaScript output
        instances: "max", // Utilize all available CPU cores
        exec_mode: "cluster", // Cluster mode for load balancing
        env: {
          NODE_ENV: "staging", // Staging environment
          DATABASE_URL: process.env.DATABASE_URL, // Staging database URL
        },
        env_production: {
          NODE_ENV: "production", // Production environment
          DATABASE_URL: process.env.DATABASE_URL_PRODUCTION, // Production database URL
        },
      },
    ],
  };
  