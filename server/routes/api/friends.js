const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');


//accept friend request
router.get('/request/:username', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from friendrequests left join users on friendrequests.from_userid=users.userid where username=? and to_userid=?" ,[req.params.username,req.user.userid], (err, rows) => {
                if (err) {    
                    throw err;
                    
                }else {
                    
                    
                    if(rows[0]){
                        conn.query("insert into friends(user1id,user2id) value(?,?)",[rows[0].from_userid,rows[0].to_userid],(err,row)=>{
                            if(err){
                                throw err;
                            }else{
                                conn.query("delete from friendrequests where requestid=?",[rows[0].requestid],(err,row)=>{
                                    if(err){
                                        throw err;
                                    }else{

                                        res.json({friend:{username:req.params.username,nickname:rows[0].nickname},success: true});
                                    }
                                });
                            }
                        });
                    }else{
                        res.json({msg: "You don't have a request",success: false,rows:rows});
                    }
                    
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })  
 });
 //delete friend
 router.delete('/:username', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from friends left join users on friends.user1id=users.userid WHERE username =? and user2id=? UNION select * from friends left join users on friends.user2id=users.userid WHERE username =? and user1id=?" ,[req.params.username,req.user.userid,req.params.username,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from friends where friendid=?",[rows[0].friendid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        res.json({msg: "You don't have this friend",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    }) 
 });

 //sned friend requset
 router.get('/request/send/:username', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from friendrequests left join users on friendrequests.from_userid=users.userid WHERE username =? and to_userid=? UNION select * from friendrequests left join users on friendrequests.to_userid=users.userid WHERE username =? and from_userid=?" ,[req.params.username,req.user.userid,req.params.username,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(!rows[0]){
                        conn.query("insert into friendrequests(from_userid,to_userid) SELECT ?,userid FROM users WHERE username=?",[req.user.userid,req.params.username],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        res.json({msg: "You have already sent a request",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })  
 });

 //cancel friend request
 router.delete('/request/:username', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from friendrequests left join users on friendrequests.from_userid=users.userid WHERE username =? and to_userid=? UNION select * from friendrequests left join users on friendrequests.to_userid=users.userid WHERE username =? and from_userid=?" ,[req.params.username,req.user.userid,req.params.username,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from friendrequests where requestid=?",[rows[0].requestid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        res.json({msg: "You have already sent a request",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    }) 
 });

 router.get('/:username/isFriend',authToken, (req,res)=>{
    pool.query("select * from friends left join users on friends.user1id=users.userid WHERE username =? and user2id=? UNION select * from friends left join users on friends.user2id=users.userid WHERE username =? and user1id=?" ,[req.params.username,req.user.userid,req.params.username,req.user.userid], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let isFriend = false; 
            if(rows[0]){
                isFriend = true;
            }  
            res.json({isFriend:isFriend,success: true});  
        }                      
     });     
 });

 router.get('/:username/isSentRequest',authToken, (req,res)=>{
    pool.query("select * from friendrequests left join users on friendrequests.to_userid=users.userid WHERE username =? and from_userid=?" ,[req.params.username,req.user.userid], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let isSent = false; 
            if(rows[0]){
                isSent = true;
            }  
            res.json({isSent:isSent,success: true});  
        }                      
     });     
 });

 router.get('/:username/isReceivedRequest',authToken, (req,res)=>{
    pool.query("select * from friendrequests left join users on friendrequests.from_userid=users.userid WHERE username =? and to_userid=?" ,[req.params.username,req.user.userid], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let isReceived = false; 
            if(rows[0]){
                isReceived = true;
            }  
            res.json({isReceived:isReceived,success: true});  
        }                      
     });     
 });


//get all friend
 router.get('/:username', (req,res)=>{
    pool.query("SELECT users.pic,users.username, users.nickname FROM users right JOIN (select user2id AS frienduserid from friends LEFT JOIN users ON friends.user1id=users.userid where username=? UNION select user1id AS frienduserid from friends LEFT JOIN users ON friends.user2id=users.userid where username=?) ftable  ON users.userid=ftable.frienduserid ORDER BY users.nickname" ,[req.params.username,req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let friends = [];
            rows.forEach(row => {
                friends.push({                       
                    username: row.username,
                    nickname: row.nickname, 
                    pic: row.pic                     
                })
            });       
            res.json({friends,success: true});  
        }                      
     });     
 });

 //get receive request
 router.get('/request/received/:username',authToken, (req,res)=>{
    pool.query("SELECT users.pic,users.username, users.nickname,ftable.status,ftable.requestid FROM users right JOIN (select from_userid AS requestuserid ,status,requestid from friendrequests LEFT JOIN users ON friendrequests.to_userid=users.userid where username=?) ftable  ON users.userid=ftable.requestuserid ORDER BY users.nickname" ,[req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let receivedReq = [];
            rows.forEach(row => {
                receivedReq.push({                       
                    username: row.username,
                    nickname: row.nickname,  
                    status: row.status,
                    requestid:row.requestid ,
                    pic: row.pic        
                })
            });       
            res.json({receivedReq:receivedReq,success: true});  
        }                      
     });     
 });

  //get send request
  router.get('/request/sent/:username',authToken, (req,res)=>{
    pool.query("SELECT users.pic,users.username, users.nickname,ftable.status,ftable.requestid FROM users right JOIN (select to_userid AS requestuserid,status,requestid from friendrequests LEFT JOIN users ON friendrequests.from_userid=users.userid where username=?) ftable  ON users.userid=ftable.requestuserid ORDER BY users.nickname" ,[req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let sentReq = [];
            rows.forEach(row => {
                sentReq.push({                       
                    username: row.username,
                    nickname: row.nickname,
                    status: row.status,
                    requestid:row.requestid ,
                    pic: row.pic       
                })
            });       
            res.json({sentReq:sentReq,success: true});  
        }                      
     });     
 });
module.exports = router;