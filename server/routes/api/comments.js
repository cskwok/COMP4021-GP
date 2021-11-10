const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');

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

// get comments by postid
 router.get('/:postid', (req,res)=>{    
    pool.query("select users.pic,users.username,users.nickname,comments.commentid, comments.postid, comments.comment, DATE_FORMAT(comments.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(comments.editTime, '%d %b %Y %H:%i') as editTime, COUNT(commentlikes.likeid_c) AS numOfLikes from users right join comments on users.userid=comments.userid left JOIN commentlikes on comments.commentid=commentlikes.commentid where comments.postid=? GROUP BY commentid ORDER BY comments.postTime asc" ,[req.params.postid], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            let comments = [];
            rows.forEach(row => {
                comments.push({
                    postid: row.postid,
                    commentid: row.commentid,
                    username: row.username,
                    nickname: row.nickname,
                    comment: row.comment,
                    postTime: row.postTime,
                    editTime: row.editTime,
                    numOfLikes: row.numOfLikes,
                    hasLike: false,
                    pic: row.pic
                })
            });
            res.json({comments,success: true});  
        }                      
     });     
 });

//add comment
 router.post('/:postid', authToken, (req,res)=>{
    pool.query(" insert into comments(postid,userid,comment,postTime) values(?,?,?,now())" ,[req.params.postid,req.user.userid,req.body.comment], (err, rows) => {
        if (err) {      
            throw err;
        }else {
            pool.query("select users.pic,users.username,users.nickname,comments.commentid, comments.postid, comments.comment, DATE_FORMAT(comments.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(comments.editTime, '%d %b %Y %H:%i') as editTime, COUNT(commentlikes.likeid_c) AS numOfLikes from users right join comments on users.userid=comments.userid left JOIN commentlikes on comments.commentid=commentlikes.commentid where comments.commentid=? GROUP BY commentid",[rows.insertId], (err, row) => {
                if (err) {      
                    throw err;
                }else {
                    let comment = {
                        postid: row[0].postid,
                        commentid: row[0].commentid,
                        username: row[0].username,
                        nickname: row[0].nickname,
                        comment: row[0].comment,
                        postTime: row[0].postTime,
                        editTime: row[0].editTime,
                        numOfLikes: row[0].numOfLikes,
                        hasLike: false,
                        pic: row[0].pic
                    }
                    res.json({comment:comment , success: true});  
                }                      
             });
        }                      
     });  
 });
 
 //delete comment
 router.delete('/delete/:commentid', authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select comments.commentid from comments LEFT JOIN posts ON comments.postid=posts.postid where comments.commentid=? AND (comments.userid=? OR posts.userid=?) " ,[req.params.commentid,req.user.userid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from comments where commentid=?",[rows[0].commentid],(err,row)=>{
                            if(err){
                                throw err;
                            }else{
                                conn.query("delete from commentlikes where commentid=?",[rows[0].commentid],(err,row)=>{
                                    if(err){
                                        throw err;
                                    }else{
                                        res.json({success: true});
                                    }
                                });
                            }
                        });
                    }else{
                        res.json({msg: "You are not allowed to delete this comment",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })    
 });

 //edit comment
 router.put('/edit/:commentid',authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select commentid from comments where commentid=? and userid=?" ,[req.params.commentid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("update comments set comment=?, editTime=now() where commentid=?",[req.body.comment,rows[0].commentid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        res.json({msg: "You are not allowed to delete this comment",success: false});
                    }
                }                      
            });
        conn.end();
        console.log("connected ! connection id is " + conn.threadId);          
        }
    })
 });

 //like or unlike a post
 router.get('/:postid/:commentid/like',authToken, (req,res)=>{
    pool.getConnection((err, conn) => {
        if (err) {
          console.log("not connected due to error: " + err);
        } else {
            conn.query("select * from commentlikes where commentid=? and userid=?" ,[req.params.commentid,req.user.userid], (err, rows) => {
                if (err) {      
                    throw err;
                }else {
                    if(rows[0]){
                        conn.query("delete from commentlikes where commentid=? and userid=?",[req.params.commentid,req.user.userid],(err,rows)=>{
                            if(err){
                                throw err;
                            }else{
                                res.json({success: true});
                            }
                        });
                    }else{
                        conn.query("insert into commentlikes(userid,commentid,postid) values(?,?,?)",[req.user.userid,req.params.commentid,req.params.postid],(err,rows)=>{
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

 //get people who like the comment
 router.get('/like/:commentid', (req,res)=>{
    pool.query("select users.pic,users.username, users.nickname from users LEFT JOIN commentlikes on users.userid=commentlikes.userid where commentid=?" ,[req.params.commentid], (err, rows) => {
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

 router.get('/:commentid/hasLike',authToken, (req,res)=>{
    pool.query("select * from commentlikes where userid=? and commentid=?" ,[req.user.userid,req.params.commentid], (err, rows) => {
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