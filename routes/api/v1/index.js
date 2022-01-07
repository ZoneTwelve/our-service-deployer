var express = require('express');
const router = express.Router();
const { exec } = require("child_process");

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

router.post('/user/session', (req, res) => {
  if( req.session.user.login )
    return { message:"You're already signin" };
  let { username, password } = req.body;
  req.sql.query(`SELECT id, username, email, true as login FROM user WHERE (username=? OR email=?) AND password=?;`, 
  [username, username, password], (err, result, fileds)=>{
    if( result.length == 1 ){
      for(let key of ['id', 'username', 'email', 'login'])
        req.session.user[ key ] = result[ 0 ][ key ];
      console.log( req.session.user )
      return res.send(`<body style="color:white;background:#2c3338;"><h1>Login success</h1><meta http-equiv="refresh" content="3; url=/"></body>`);      
    }
    return res.send({error:"Login failed"}).status(401);
  })
});

// require authorization
router.all('*', (req, res, next)=>{
  if( req.sql.error ){
    return res.send({error:"SQL Connection error"}).status(500);
  }
  if( !req.session.user.login ){
    return res.send({error:"Authorization failed"}).status(403);
  }
  next( );
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/user', (req, res)=>{
  let { email, username, password } = req.body;
  
  req.sql.query("SELECT * FROM user WHERE username=? OR email=?", [username, email], (err, result, fields) => {
    if( result.length == 0 ){
      req.sql.query("INSERT INTO user (id, username, password, email) VALUE (NULL, ?, ?, ?);", 
        [username, password, email], (err, r, fields) => {
          if( err ){
            return res.send({error:"Register failed!"}).status(500);
          }
          return res.send(`<body style="color:white;background:#2c3338;"><h1>Register successful</h1><meta http-equiv="refresh" content="3; url=/"></body>`);
        });
    }else{
      return res.send({message:"User or Email address is already been registered"}).status(409);
    }
  });
});

router.get("/app", (req, res)=>{
  let { id } = req.session.user;
  console.log( id );
});

router.post("/app", (req, res)=>{
  let { title, template_id, repo } = req.body;
  let user_id = req.session.user.id;
  console.log( __dirname )
  req.sql.query("INSERT INTO service ( title, user_id, template_id, repo ) VALUE ( ?, ?, ?, ? )", 
    [title, parseInt(template_id), user_id, repo],( error, result, fileds ) => {
      const worker = new Worker(`${__dirname}/../../../modules/worker/create.js`, {workerData: null});
      worker.on('message', (msg) => {
        console.log( msg );
      })
      worker.on('error', console.error);
      worker.on('exit', (code) => {
      if(code != 0)
        console.error(new Error(`Worker stopped with exit code ${code}`))
      });    
  });

});

router.get("/debug", (req, res)=>{
  console.log( req.session.user );
  res.send(req.session.user).status(200);
})

module.exports = router;