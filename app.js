const express = require('express');
const app = express();
const userRouter = require("./routers/userRouter")
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleWare');
const cors = require('cors');
const skillRouter = require('./routers/skillRouter');
require('dotenv').config({path : "./config/config.env"});

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({
  origin : process.env.FRONTEND_URL,
  methods : ['GET','POST','PUT','DELETE'],
  credentials : true
}))

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use('/api/v1/users',userRouter);
app.use('/api/v1/skill',skillRouter);
app.use(errorMiddleware);

module.exports = app