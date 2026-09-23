#!/usr/bin/env node
// Paste an LLM response on stdin (or as an argument); get something to paste back.
//
//   pbpaste | node src/cli.js
//   node src/cli.js --level 3 "You're absolutely right!"
"use strict";

const { respond } = require("./sycophant");

function parseArgs(argv) {
  const args = { level: 0, json: false, text: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--level" || arg === "-l") args.level = Number(argv[++i]);
    else if (arg === "--json") args.json = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else args.text.push(arg);
  }
  return args;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("usage: node src/cli.js [--level N] [--json] [text]   (reads stdin when no text given)");
    return;
  }
  const text = args.text.length ? args.text.join(" ") : await readStdin();
  if (!text.trim()) {
    console.error("Paste an LLM response. It deserves to be praised.");
    process.exitCode = 1;
    return;
  }
  const result = respond(text, args.level);
  console.log(args.json ? JSON.stringify(result, null, 2) : result.reply);
}

main();
