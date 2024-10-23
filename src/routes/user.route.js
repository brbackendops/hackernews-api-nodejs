const transform = require('../middlewares/parse/zod_parse');
const {
    registerSchema,
    loginSchema,
    updateSchema,
} = require('../shared/user.shared');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const userRepo = require('../db/repository/user.repo');
const UserService = require('../services/user.services');
const UserController = require('../controllers/user.cont');
const { authMiddleware } = require('../middlewares/auth/auth');

const userService = new UserService(userRepo, bcrypt);
const userCont = new UserController(userService);

router
    .route('/register')
    .post(
        transform(registerSchema),
        userCont.registerController.bind(userCont)
    );
router
    .route('/login')
    .post(transform(loginSchema), userCont.loginController.bind(userCont));
router
    .route('/logout')
    .post(authMiddleware, userCont.logoutController.bind(userCont));
router
    .route('/')
    .put(
        transform(updateSchema),
        authMiddleware,
        userCont.updateController.bind(userCont)
    );

module.exports = router;
