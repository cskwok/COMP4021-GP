const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function authToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.json({msg:"You are required to login",success:false});    
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) return res.json({msg:"Authorization failed",success:false});
        req.user = user;
        next();
    });
}

function genToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30m'});
}

function genRefreshToken(user){
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
}

router.post('/login', (req,res)=>{ 
    pool.query("select userid,username,nickname,password from users where email=?" ,[req.body.email,req.body.password], (err, rows) => {
        if (err) {      
            throw err;
        }else {           
            if(rows[0]){
                bcrypt.compare(req.body.password, rows[0].password, function(err, result) {
                    if(result){
                        const user = {userid:rows[0].userid, username:rows[0].username, nickname:rows[0].nickname};
                        const accessToken = genToken(user);
                        req.session.r_token = genRefreshToken(user);
                        res.json({token: accessToken, username: user.username,nickname:user.nickname, success: true}); 
                    }else{
                        res.json({msg: "Incorrect password", success: false}); 
                    }
                });
                
            }else{
                res.json({msg: "User not found", success: false}); 
            }              
        }                      
     });
 });

 router.get('/logout', (req,res)=>{ 
    req.session.destroy();
    res.json({success: true}); 
 });

 router.get('/refreshToken', (req,res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    const refreshToken = req.session.r_token;   
    if(!token || !refreshToken) return res.json({msg:"You are required to login",success:false});
    var decoded = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);   
    var decoded_r = jwt.decode(refreshToken, process.env.REFRESH_TOKEN_SECRET); 
    if(decoded_r.userid !== decoded.userid) return res.json({msg:"Invalid token",success:false});
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if(err) return res.json({msg:"Refresh failed",success:false});
            req.session.r_token = genRefreshToken({userid:user.userid, username:user.username, nickname:user.nickname});
            req.session.touch();
            const accessToken = genToken({userid:user.userid, username:user.username, nickname:user.nickname});
            res.json({token: accessToken, username: user.username, nickname:user.nickname, success: true}); 
    });
 });

module.exports.authToken = authToken;
module.exports.genToken = genToken;
module.exports.router = router;