module.exports = {
    apps: [
        {
            name: "express",
            script: "./app.js",
            instances: "max",
            exec_mode: "cluster",
            watch: true,
            env: {
                NODE_ENV: "production", // Use NODE_ENV instead of PRODUCTION for consistency
            },
            env_development: {
                NODE_ENV: "development",
            },
            restart_delay: 1000, // Delay between restarts (in ms)
            max_restarts: 10, // Maximum number of restarts in a given time frame
            min_uptime: "1000", // Minimum uptime before considering it a crash
        },
    ],
};
