import express from 'express'
import mongoose from 'mongoose'
import apiRoutes from './routes/apiRoutes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())
app.use(express.static('public'))

app.set('view engine', 'ejs')

mongoose.connect(process.env.URI)
    .then(result => app.listen(process.env.PORT, () => console.log('Server running on', process.env.PORT)))
    .catch(err => console.log(err))

app.use('/api', apiRoutes)
app.get('/', (req, res) => res.render('home'))
app.get('/addProg', (req, res) => res.render('addProg'))
app.get('/changeProg', (req, res) => res.render('changeProg'))