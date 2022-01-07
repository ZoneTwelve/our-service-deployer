const { Worker, parentPort, workerData } = require('worker_threads');
const { execSync, exec } = require("child_process");
let { username, repo, title, template_id } = workerData;

execSync(`cp -r ${__dirname}/../../containers/${template_id} ${__dirname}/../../repository/${username}/${title}/`);
let res = execSync( `git clone ${repo} ${__dirname}/../../repository/${username}/${title}/code` );
console.log( res );
// console.log( workerData );
// parentPort.postMessage({ message:"Hello world" });