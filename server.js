const express = require('express')
const app = express()
const connectDB = require('./config/db.js')
const path = require('path')
const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')
const expressValidator = require('express-validator')
const cors = require('cors')

// Connect To DataBase
connectDB();

//Initialize the body-parser(MiddleWare)
app.use(express.json({
    extended: false
}))

//import routes 
const authRoutes = require('./routes/auth')
const bookRoutes = require('./routes/book')

//middlewares
//pp.use(morgan('dev'))//we pass the dev flag
app.use(bodyParser.json())
app.use(cookieparser())
app.use(expressValidator())
app.use(cors())

//routes middleware
app.use("/api", authRoutes)
app.use("/api", bookRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))