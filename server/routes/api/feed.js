const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');

router.get('/',authToken, (req,res)=>{    
    pool.query("select users.pic,users.username,users.nickname,posts.postPic,posts.postid, posts.content, DATE_FORMAT(posts.postTime, '%d %b %Y %H:%i') as postTime, DATE_FORMAT(posts.editTime, '%d %b %Y %H:%i') as editTime, COUNT(postlikes.likeid) AS numOfLikes from users right join(select user2id AS userid from friends where user1id=? UNION select user1id AS userid from friends where user2id=? union select ?) ftable on users.userid=ftable.userid inner join posts on users.userid=posts.userid left join postlikes on posts.postid=postlikes.postid GROUP BY postid ORDER BY posts.postTime desc" ,[req.user.userid,req.user.userid,req.user.userid], (err, rows) => {
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
                    postPic:row.postPic
                })
            });
            res.json({posts,success: true});  
        }                      
     });     
 });
 module.exports = router;