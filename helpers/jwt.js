const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise((resolve, reject)=> {

        const payload = {uid, name};

        jwt.sign(payload, process.env.SECRET_JWT_SEED,{ //Firma del token 
            expiresIn:'2h' //Duración del token
        }, (err, token) =>{

            if(err){ //Error si no se ha podido generar el token
                console.log(err);
                reject('No se pudo generar el token')
            }

            resolve(token);
        })


    })

}

module.exports = {
    generarJWT,
}