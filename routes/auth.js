
path: 'api/login'

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middelwares/validar-campos');
const { validarJWT } = require('../middelwares/validar-jwt');
const router = Router();

router.post('/new',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Ingrese un email correcto').not().isEmpty().isEmail(),
    check('password', 'La contrasena debe mayor o igual a 5 caracteres').not().isEmpty().isLength({min: 5}),
    validarCampos,
], crearUsuario);

router.post('/', [
    check('email', 'Ingrese un email correcto').not().isEmpty().isEmail(),
    check('password', 'La contrasena debe mayor o igual a 5 caracteres').not().isEmpty().isLength({min: 5}),
], login);

router.get('/renew', validarJWT, renewToken);

module.exports = router;