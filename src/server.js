require('dotenv').config();

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(
    require('express-status-monitor')({
        title: 'api-stats',
        path: '/stats',
        healthChecks: [
            {
                protocol: 'http',
                host: '127.0.0.1',
                port: process.env.PORT || 5000,
                path: '/health',
            },
        ],
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
        },
    })
);

app.get('/health', async (req, res) => {
    res.status(200).send('OK');
});

const userRoute = require('./routes/user.route');
const postRoute = require('./routes/post.route');
const commRoute = require('./routes/comment.route');

app.use('/v1/users', userRoute);
app.use('/v1/posts', postRoute);
app.use('/v1/comments', commRoute);

const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: './misc/error.log',
            level: 'error',
        }),
        new winston.transports.File({ filename: './misc/db.log' }),
    ],
});

app.use((err, req, res, next) => {
    logger.log({
        level: 'error',
        message: err.message,
        cause: err.name,
    });
    return process.env.NODE_ENV === 'production'
        ? res.status(500).json({
              status: 'error',
              error: err.message,
          })
        : res.status(500).json({
              status: 'error',
              message: err.message,
              error: err.stack,
          });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
    console.log(`server listening on http://127.0.0.1:${PORT}`);
});

process.on('SIGTERM', () => {
    server.close();
    console.log('received signal for exiting ');
});
