const { response } = require("express");
const Perfil = require("../models/Perfil");


 const crearPerfil =  async(req, res = response) =>{
    try{
        // Crea una nueva instancia del modelo PerfilUsuario
        const perfil = new Perfil({
           ...req.body, //Copia todos los campos que vienen en el cuerpo de la petición
           user: req.uid //Añade el ID del usuario autenticado al perfil. Este uid viene del token JWT y lo pone el middleware de autenticación.

        });

        const perfilGuardado = await perfil.save(); //Guarda el objeto perfil en la base de datos

        
        res.status(201).json({
            ok: true,
            perfil: perfilGuardado
        });


    }catch(error){
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el perfil'
        });
    } 
}

const getPerfil = async (req, res = response) => {

  try {
    const perfil = await Perfil.findOne({ user: req.uid });

    if (!perfil) {
      return res.status(404).json({
        ok: false,
        msg: 'Perfil no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      perfil
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener el perfil'
    });
  }
};

const getPerfiles = async (req, res = response) => {
  try {
    const perfiles = await Perfil.find().populate('user');
    res.status(200).json({
      ok: true,
      perfiles
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener los perfiles'
    });
  }
};


module.exports = {
   crearPerfil,
   getPerfil,
   getPerfiles
}