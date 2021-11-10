require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const fileUpload = require('express-fileupload');
const crypto = require('crypto');

var path = require('path'); 

var pool = require('./dbconnector');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

global.rootPath = __dirname;

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));
const options = {
    host: process.env.DB_HOST,
    port:   process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    clearExpired: true,  
    checkExpirationInterval: 24 * 60 * 60 * 1000,
    expiration: 365 * 24 * 60 * 60 * 1000,
    createDatabaseTable: true,
};
 
var sessionStore = new MySQLStore(options);

app.use(session({
    key: 'r_id',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
       expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
       maxAge: 365 * 24 * 60 * 60 * 1000
    }
}));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/feed', require('./routes/api/feed'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/friends', require('./routes/api/friends')); 
app.use('/api/search', require('./routes/api/search')); 
app.use('/api/auth', require('./routes/api/auth').router); 

app.get('/img/:filename', function (req, res) {
   res.sendFile(`${__dirname}/public/image/${req.params.filename}`);
});

app.post('/upload/image', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.json({msg:'No files were uploaded',success:false});
    }
    let image = req.files.image;
    let imageName = image.name.split(".");
    const buf = crypto.randomBytes(20);
    const hash = buf.toString('hex');
    image.mv(`${__dirname}/public/image/${hash}.${imageName[1]}`, function(err) {
        if (err)
          throw err;
        return res.json({image:`${hash}.${imageName[1]}` , success:true});
    });
    
    
  });


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
