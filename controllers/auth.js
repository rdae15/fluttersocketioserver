const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;
    try {

        const existeEmail = await Usuario.findOne({email});
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
    const usuario = new Usuario(req.body);

    //  Encriptar contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();

    // Generar mi JWT
    const token = await generateJWT(usuario.id)
    
    res.json({
        ok: true,
        usuario,
        token
    });
}

const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {
			const usuarioDB = await Usuario.findOne({email});
			if(!usuarioDB) {
				return res.status(404).json({
					ok: false,
					msg: 'Email no encontrado'
				})
			}
			const validPassword = bcrypt.compareSync(password, usuarioDB.password);
			if (!validPassword) {
				return res.status(400).json({
					ok: false,
					msg: 'Contrasena no validad'
				});

			}

			const token = await generateJWT(usuarioDB.id);
			res.json({
				ok: true,
				usuario: usuarioDB,
				token
			});

        
    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

	}
const renewToken = async(req, res = response) => {

	const uid = req.uid;

	const token = await generateJWT(uid);

	const usuario = await Usuario.findById(uid);




	res.json({
			ok: true,
			usuario,
			token
	})
}

module.exports = {
    crearUsuario,
    login,
		renewToken
}