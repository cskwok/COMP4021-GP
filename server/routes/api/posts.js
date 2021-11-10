const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');
const fs = require('fs');

/*
//get all posts
router.get('/', (req,res)=>{
    pool.query("select users.username,users.nickname,posts.content,posts.postTime,posts.editTime from users right join posts on users.userid=posts.userid ORDER BY posts.postTime desc", (err, rows) => {
         if (err) {      
             throw err;
         }else {
             res.json(rows);  
         }                        
     });    
 });
*/

// get post by userid
 router.get('/:username', (req,res)=>{    
    pool.query("select users.pic,users.username,users.nickname,posts.postPic,posts.postid, posts.content, DATE_FORMAT(posts.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(posts.editTime, '%d %b %Y %H:%i') as editTime, COUNT(postlikes.likeid) AS numOfLikes from users right join posts on users.userid=posts.userid left join postlikes on posts.postid=postlikes.postid where username=? GROUP BY postid ORDER BY posts.postTime desc" ,[req.params.username], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            let posts = [];
            rows.forEach(row => {
                posts.push({
                    postid: row.postid,
                    username: row.username,
                    nickname: row.nickname,
                    content: row.content,
                    postTime: row.postTime,
                    editTime: row.editTime,
                    numOfLikes: row.numOfLikes,
                    hasLike: false,
                    comments: [],
                    pic: row.pic,
                    postPic: row.postPic
                })
            });
            res.json({posts,success: true});  
        }                      
     });     
 });
 
//add post
 router.post('/', authToken, (req,res)=>{
    pool.query(" insert into posts(userid,content,postTime,postPic) values(?,?,now(),?)" ,[req.user.userid,req.body.content,req.body.postPic], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            pool.query("select users.pic,users.username,users.nickname,posts.postPic,posts.postid, posts.content, DATE_FORMAT(posts.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(posts.editTime, '%d %b %Y %H:%i') as editTime, COUNT(postlikes.likeid) AS numOfLikes from users right join posts on users.userid=posts.userid left join postlikes on posts.postid=postlikes.postid where posts.postid=? GROUP BY postid",[rows.insertId], (err, row) => {
                if (err) {      
                    throw err;
                }else {
                    let post = {
                        postid: row[0].postid,
                        username: row[0].username,
                        nickname: row[0].nickname,
                        content: row[0].content,
                        postTime: row[0].postTime,
                        editTime: row[0].editTime,
                        numOfLikes: row[0].numOfLikes,
                        hasLike: false,
                        comments: [],
                        pic: row[0].pic,
                        postPic: row[0].postPic
                    }
                    res.json({post:post , success: true});  
                }                      
             });
        }                      
     });  
 });
 
 //delete post
 router.delete('/delete/:postid', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select postid,postPic from posts where postid=? and userid=?" ,[req.params.postid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from posts where postid=?",[rows[0].postid],(err,row)=>{
                            if(err){
                                throw err;
                            }else{
                                conn.query("delete from postlikes where postid=?",[rows[0].postid],(err,row)=>{
                                    if(err){
                                        throw err;
                                    }else{
                                        conn.query("delete from comments where postid=?",[rows[0].postid],(err,row)=>{
                                            if(err){
                                                throw err;
                                            }else{
                                                conn.query("delete from commentlikes where postid=?",[rows[0].postid],(err,row)=>{
                                                    if(err){
                                                        throw err;
                                                    }else{
                                                        if(rows[0].postPic){
                                                            fs.unlink(`${rootPath}/public/image/${rows[0].postPic}`, (err) => {
                                                                if (err) {
                                                                    throw err;                                                              
                                                                }else{
                                                                    res.json({success: true});  
                                                                } 
                                                            })
                                                        }else{
                                                            res.json({success: true}); 
                                                        }
                                                        
                                                       
                                                                                                              
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        res.json({msg: "You are not allowed to delete this post",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })    
 });

 //edit post
 router.put('/edit/:postid',authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select postid from posts where postid=? and userid=?" ,[req.params.postid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("update posts set content=?, editTime=now() where postid=?",[req.body.content,rows[0].postid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{

                                pool.query("select users.pic,users.username,users.nickname,posts.postPic,posts.postid, posts.content, DATE_FORMAT(posts.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(posts.editTime, '%d %b %Y %H:%i') as editTime, COUNT(postlikes.likeid) AS numOfLikes from users right join posts on users.userid=posts.userid left join postlikes on posts.postid=postlikes.postid where posts.postid=? GROUP BY postid",[req.params.postid], (err, row) => {
                                    if (err) {      
                                        throw err;
                                    }else {
                                        let post = {
                                            postid: row[0].postid,
                                            username: row[0].username,
                                            nickname: row[0].nickname,
                                            content: row[0].content,
                                            postTime: row[0].postTime,
                                            editTime: row[0].editTime,
                                            numOfLikes: row[0].numOfLikes,
                                            hasLike: false,
                                            comments: [],
                                            pic: row[0].pic,
                                            postPic: row[0].postPic
                                        }
                                        res.json({post:post , success: true});  
                                    }                      
                                });
                            }
                        });
                    }else{
                        res.json({msg: "You are not allowed to delete this post",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })
 });

 //like or unlike a post
 router.get('/:postid/like',authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from postlikes where postid=? and userid=?" ,[req.params.postid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from postlikes where postid=? and userid=?",[req.params.postid,req.user.userid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        conn.query("insert into postlikes(userid,postid) values(?,?)",[req.user.userid,req.params.postid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })       
 });

 //get people who like the post
 router.get('/like/:postid', (req,res)=>{
    pool.query("select users.pic,users.username, users.nickname from users LEFT JOIN postlikes on users.userid=postlikes.userid where postid=?" ,[req.params.postid], (err, rows) => {
        if (err) {      
            throw err;
        }else {   
            let likedBy = [];
            rows.forEach(row => {
                likedBy.push({                       
                    username: row.username,
                    nickname: row.nickname,  
                    pic: row.pic                    
                })
            });       
            res.json({likedBy,success: true});  
        }                      
     });     
 });

 router.get('/:postid/hasLike',authToken, (req,res)=>{
    pool.query("select * from postlikes where userid=? and postid=?" ,[req.user.userid,req.params.postid], (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let hasLike = false; 
            if(rows[0]){
                hasLike = true;
            }  
            res.json({hasLike,success: true});  
        }                      
     });     
 });
module.exports = router;