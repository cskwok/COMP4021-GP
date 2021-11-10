const express = require('express');
const router = express.Router();
var pool = require('../../dbconnector');
var { authToken, genToken }= require('./auth');

router.post('/',authToken, (req,res)=>{
    if(!req.body.query || req.body.query.trim().length === 0) return res.json({results:[],success: true}); 
    let sql = "SELECT username,nickname,pic FROM users where";
    let str_s = req.body.query.split(" ");
    for (let index = 0; index < str_s.length; index++) {
        if(index!=0) sql+= " and";
        sql += ` (username like '%${str_s[index]}%' or nickname like '%${str_s[index]}%')`;
        
    }    
    pool.query(sql , (err, rows) => {
        if (err) {      
            throw err;
        }else {        
            let results = [];
            rows.forEach(row => {
                results.push({                       
                    username: row.username,
                    nickname: row.nickname,   
                    pic: row.pic                   
                })
            });       
            res.json({results,success: true});  
        }                      
     });   
      
 });

 module.exports = router;