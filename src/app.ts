import express, { Application, Request, Response } from "express";
import cors from 'cors';
import router from "./app/routes";
import morgan from "morgan";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import path from "path";


const app: Application = express();

app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/', (req:Request, res:Response) => {
    res.send('This is Restaurant server');
});


//custom middleware implementation
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//application routes
app.use('/api/v1', router);

//serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads",)))



// Global Error-handling middleware
app.use(globalErrorHandler);



//route not found
app.use('*', notFound)


export default app;