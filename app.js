require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const authRouter = require('./routes/user');
const postRouter = require('./routes/post');

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not_found');
const errorHandlerMiddleware = require('./middleware/error_handler');

app.use(express.static("public"));
app.use(express.json());

app.use('/api/v1/user', authRouter);
app.use('/api/v1/post', authenticateUser, postRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.get('/', (req, res) => {
    res.send("Hello world");
});

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`)
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
