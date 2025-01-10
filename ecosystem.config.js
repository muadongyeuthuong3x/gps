module.exports = {
    apps: [
      {
        name: "my-app",
        script: "src/server.ts", // Path to your .ts file
        interpreter: "ts-node",  // Use ts-node for TypeScript files
        watch: true,
      },
    ],
  };
  