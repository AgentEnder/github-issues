//@ts-check

process.on("exit", () => {
  execSync("killall -9 node");
});

const assert = require("node:assert");
const { execSync, spawn } = require("node:child_process");

const cp = spawn("npx nx serve api", [], {
  shell: true,
  env: {
    ...process.env,
    NX_DAEMON: "false",
    NX_TUI: "true",
  },
  stdio: "inherit",
});

setTimeout(() => {
  cp.kill("SIGINT");

  setTimeout(() => {
    const processes = execSync("./ppgrep.sh node", {
      shell: "zsh",
    });

    console.log("Processes: ", processes.toString());

    const failed = processes.includes(
      "/private/tmp/testing/test-hanging-process/node_modules/nx/bin/run-executor.js"
    );
    if (failed) {
      console.log("Server not killed  correctly");
    }
  }, 1000);
}, 1000);
