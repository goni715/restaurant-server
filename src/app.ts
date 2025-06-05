import express, { Application, Request, Response, NextFunction } from "express";
import cors from 'cors';
import router from "./app/routes";
import morgan from "morgan";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import path from "path";
import hpp from "hpp";
import { xssSanitizer } from "./app/middlewares/xssSanitizer";


const app: Application = express();

app.use(cors())
app.use(cookieParser())

//prvent http paramater polution
app.use(hpp({
    whitelist: ["skills"]  //Allow these duplicate parameters
}))
app.use(morgan('dev'))

app.get('/', (req:Request, res:Response) => {
    res.send('Restaurant server is running...');
});


//custom middleware implementation
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Data sanitization against XSS
app.use(xssSanitizer)


//application routes
app.use('/api/v1', router);

//serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads",)))



// Global Error-handling middleware
app.use(globalErrorHandler);



//route not found
app.use(notFound)


export default app;