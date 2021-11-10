const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');
const bcrypt = require('bcrypt');
const fs = require('fs');
//res.send("Hello world!");
    /*
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            
            //SELECT * FROM users
            conn.query("SELECT DATE_FORMAT(birthday, '%Y-%m-%d') FROM users", (err, rows) => {
                res.send(rows);
                conn.end();                
             });  
             
          console.log("connected ! connection id is " + conn.threadId);          
        }
    })
    */
/*
//get all users
router.get('/', (req,res)=>{
   pool.query("select * from users", (err, rows) => {
        if (err) {      
            throw err;
        }else {
            res.json(rows);  
        }                        
    });    
});

*/
/*
//get one user by id
router.get('/:userid', (req,res)=>{
    pool.query("select * from users where id=?" ,[req.params.userid], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            res.send(rows);  
        }                      
     });    
 });
 */
//get one user by username
router.get('/:username', (req,res)=>{
    pool.query("select pic,username, email, nickname, gender, DATE_FORMAT(birthday, '%d %b %Y') as birthday, bio, COUNT(ftable.friendid) AS numOfFriends, publicity from users LEFT JOIN (SELECT friendid,user1id AS userid FROM friends UNION SELECT friendid,user2id AS userid FROM friends) ftable ON users.userid=ftable.userid  where username=? GROUP BY users.userid" ,[req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            if(rows[0]){
                res.json({rows, success: true});
            }else{
                res.json({msg:"no such user",success: false});
            }   
        }                      
     });    
 });

 //create a new user
 router.post('/register', (req,res)=>{     
     pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
          throw err;
        } else {
            //let error = [];
            conn.query("select username,email from users where username=? or email=?",[req.body.username,req.body.email], (err, rows) => {
                if (err) {                    
                    throw err;                    
                }else if(rows[0]){   
                     /* 
                    for(var i = 0; i < rows.length; i++){                        
                        if(rows[i].username == req.body.username && rows[i].email == req.body.email){
                            res.json({msg: "Account already exist",success: false});                            
                        }else{
                            
                            if(rows[i].username == req.body.username){
                                error.push({msg: "The username is being used"});
                                //res.json({msg: "The username is being used"});                                  
                            }
                            if(rows[i].email == req.body.email){
                                error.push({msg: "The email is being used"});
                                //res.json({msg: "The email is being used"});                                
                            }         
                            error.res = res; 
                            res.write(JSON.stringify(error));    
                                                       
                        }
                    } */
                     
                    res.json({msg: "The email or the username has been used",success: false}); 
                }else{
                    bcrypt.hash(req.body.password, 12, function(err, hash) {
                        req.body.password = hash;
                        conn.query("insert into users(username,password,email,nickname,gender,birthday) values(?,?,?,?,?,?)",
                        [req.body.username,req.body.password,req.body.email,req.body.nickname,req.body.gender,req.body.birthday],
                        (err, rows) => {
                            if (err) {                    
                                throw err;
                            }else{
                                res.json({success: true}); 
                            }
                    });
                    });
                    
                }
                conn.end();                
             });
        }
    });
});
/*
//delete one user by id
router.delete('/:userid', (req,res)=>{
    pool.query("delete from users where id=?" ,[req.params.userid], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            res.json({msg: "Account deleted"});   
        }                      
     });    
 });
 */ 
// delete 'my' account
router.delete('/delete', authToken, (req,res)=>{
    pool.query("delete from users where username=?" ,[req.user.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            res.json({success: true});   
        }                      
     });    
 });
/*
 //login
 router.post('/login', (req,res)=>{ 
    pool.query("select userid,username from users where email=? and password=?" ,[req.body.email,req.body.password], (err, rows) => {
        if (err) {      
            throw err;
        }else {           
            if(rows[0]){
                const user = {userid:rows[0].userid, username:rows[0].username};
                const accessToken = genToken(user);
                res.json({token: accessToken, username: user.username, success: true}); 
            }else{
                res.json({msg: "user not found", success: false}); 
            }              
        }                      
     });    
     
 });
 */
 //edit user info
/*
 router.put('/:username/edit',authToken, (req,res)=>{
    if(req.param.username===req.user.username){
        pool.query("update users set password=?, nickname=?, bio=? where username=?" ,[req.body.password,req.body.nickname,req.body.bio,req.user.username], (err, rows) => {
            if (err) {      
                res.json({success: false}); 
            }else {            
                res.json({success: true}); 
            }              
         });
    }    
 });
 */
 router.put('/edit/password',authToken, (req,res)=>{
    pool.query("select password from users where username=?" ,[req.user.username], (err, rows) => {
        if (err) {      
            res.json({success: false}); 
        }else { 
            bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
                if(result){
                    bcrypt.hash(req.body.newPassword, 12, function(err, hash) {
                        req.body.newPassword = hash;
                        pool.query("update users set password=? where username=?" ,[req.body.newPassword,req.user.username], (err, rows) => {
                            if (err) {      
                                res.json({success: false}); 
                            }else {   
        
                                res.json({msg: "Password updated",success: true}); 
                            }              
                         }); 
                    });                       
                }else{
                    res.json({msg: "Incorrect password", success: false}); 
                }
            });           
            
        }              
     }); 
 });

 router.put('/edit/nickname',authToken, (req,res)=>{
    pool.query("update users set nickname=? where username=?" ,[req.body.nickname,req.user.username], (err, rows) => {
        if (err) {      
            res.json({success: false}); 
        }else {            
            res.json({msg: "Nickname updated",success: true}); 
        }              
     });   
 });
 router.put('/edit/bio',authToken, (req,res)=>{
    pool.query("update users set bio=? where username=?" ,[req.body.bio,req.user.username], (err, rows) => {
        if (err) {      
            res.json({success: false}); 
        }else {            
            res.json({msg: "Bio updated",success: true}); 
        }              
     });   
 });
 router.put('/edit/publicity',authToken, (req,res)=>{
    pool.query("update users set publicity=? where username=?" ,[req.body.publicity,req.user.username], (err, rows) => {
        if (err) {      
            res.json({success: false}); 
        }else {            
            res.json({msg: "Publicity updated",success: true}); 
        }              
     });    
 });

 router.put('/edit/pic',authToken, (req,res)=>{
    pool.query("select pic from users where username=?" ,[req.user.username], (err, rows) => {
        if (err) {      
            res.json({success: false}); 
        }else {            
            pool.query("update users set pic=? where username=?" ,[req.body.pic,req.user.username], (err, row) => {
                if (err) {      
                    res.json({success: false}); 
                }else {   
                    if(rows[0].pic==="profile_pic_default.png"){
                        res.json({msg: "Profile Picture updated",success: true});
                    }else{
                        if(rows[0].pic){
                            fs.unlink(`${rootPath}/public/image/${rows[0].pic}`, (err) => {
                                if (err) {
                                    throw err;                                                              
                                }else{
                                    res.json({msg: "Profile Picture updated",success: true}); 
                                } 
                            })
                        }else{
                            res.json({msg: "Profile Picture updated",success: true});
                        }
                         
                    }
                     
                }              
             });  
        }              
     });

       
 });

 //get user publicity
router.get('/:username/publicity', (req,res)=>{
    pool.query("select publicity from users where username=?" ,[req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            if(rows[0]){
                res.json({publicity:rows[0].publicity, success: true});
            }else{
                res.json({msg:"no such user",success: false});
            }   
        }                      
     });    
 });


module.exports = router;