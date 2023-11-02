import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import connectDB from './config/mongoose.config'
import { errohandle } from './middleware/errorHandler.middleware'
import MainRouter from './routes/Routes'
import path from 'path'
import http from 'http'
import { initSocketServer } from './socketServer'
import { rateLimit } from 'express-rate-limit'


const PORT: string | number  = process.env.PORT || 4000
const ORIGIN = process.env.ORIGIN


const app:Application  = express()

const server  = http.createServer(app)


app.set('view engine', 'ejs');

app.use(express.json({limit:'50mb'}))

app.use(cookieParser())

app.use(cors({
  origin:'http://localhost:3000',
  credentials: true
}))

app.use(express.static(path.join(process.cwd(), 'public')))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})


app.use(MainRouter)
app.use(limiter)
app.use(errohandle)



app.get('/', (req:Request, res:Response, next:NextFunction) => {
  res.status(200).send('api is working')
})



// app.all('*', (req:Request, res:Response, next:NextFunction) => {
//   const err = new Error(`Route ${req.originalUrl} not found`) as any;
//   err.statusCode = 404
//   next(err)
// })


initSocketServer(server)

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`) ;
  connectDB()
})