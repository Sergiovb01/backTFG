const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


//Funcion que se ejecutará al hacer x petición donde se llame a crearUsuario
const crearUsuario = async(req, res = response) => {

    const { email, password} = req.body;//Inofrmación que extraemos del body del request de la petición

   try{


        let usuario = await Usuario.findOne({email});

        //Si existe ya ese usuario lanzará un error
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg:'El usuario ya existe'
            });
        }

        usuario = new Usuario(req.body);
       
        //Encriptar contraseña 
        const salt = bcrypt.genSaltSync(); //Número de vuetas(por defecto 10)
        usuario.password = bcrypt.hashSync(password, salt);

        await  usuario.save(); //Guardar en la base de datos

        //Generar JWT (token)
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({ //Respuesta de éxito
            ok:true,
            udi:usuario.id,
            name:usuario.name,
            token
        })


   }catch(error){

        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
   } 
   
}

//Funcion que se ejecutará al hacer x petición donde se llame a loginUsuario
const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }


        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        
        if ( !validPassword ) {
            console.log('hola')
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT (token)
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log();
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

//Funcion que se ejecutará al hacer x petición donde se llame a revalidarToken
const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;
   
    
    // Generar JWT (token)
    const token = await generarJWT( uid, name );
    res.json({
        ok:true,
        uid,
        name,
        token,
        
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}