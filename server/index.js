const express = require('express')
const app = express()
const port = 4000
const { pageRoutes, authRoutes } = require('./routes/index');
// {
// 	<username>:{
// 		password,
// 		drawings:[{
// 				drawing,
// 				isPublic,
// 				timeSpent
// 			}]
// 	}
// }
const cors = require('cors')
const session = require('express-session')

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json());
app.use(session({
    name: 'userAuthStatus',
    secret: 'T@lkSp@c3',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

app.use('/drawings', pageRoutes)
app.use('/auth', authRoutes)



app.listen(port, () => console.log(`Listening at http://localhost:${port}`))