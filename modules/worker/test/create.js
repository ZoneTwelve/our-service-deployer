const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const worker = new Worker('../create.js', {workerData: {
  title:"URL Shortenter".toLowerCase().replace(/\s/g, '_'),
  username:'ZoneTwelve'.toLowerCase(),
  repo:"http://localhost:3001/ZoneTwelve/url-shortenter",
  template_id: 1
}});
worker.on('message', (msg) => {
  console.log('msg', msg);
})
worker.on('error', console.error);
worker.on('exit', (code) => {
if(code != 0)
      console.error(new Error(`Worker stopped with exit code ${code}`))
});