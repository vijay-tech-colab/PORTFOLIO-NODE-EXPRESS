const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleWare');
require('dotenv').config({path : "./config/config.env"});
const cors = require('cors');

const userRouter = require("./routers/userRouter")
const skillRouter = require('./routers/skillRouter');
const projectRouter = require('./routers/projectRouter');
const messageRouter = require('./routers/messageRouter');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({
  origin : process.env.FRONTEND_URL,
  methods : ['GET','POST','PUT','DELETE','PATCH'],
  credentials : true
}))

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use('/api/v1/users',userRouter);
app.use('/api/v1/skill',skillRouter);
app.use('/api/v1/project',projectRouter);
app.use('/api/v1/message',messageRouter);
app.use(errorMiddleware);

module.exports = app