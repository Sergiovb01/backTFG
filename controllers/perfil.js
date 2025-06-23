const { response } = require("express");
const Perfil = require("../models/Perfil");


 const crearPerfil =  async(req, res = response) =>{
    try{
      console.log('Creando perfil...');
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

const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.uid;

    const {
      softwares,
      skills,
      country,
      city,
      about,
      socialMedia,
      portafolio,
      photo
    } = req.body;

    const perfil = await Perfil.findOne({ user: userId });
    if (!perfil) {
      return res.status(404).json({ ok: false, msg: 'Perfil no encontrado' });
    }


     // === Actualizar campos ===
    if (softwares) perfil.softwares = Array.isArray(softwares) ? softwares : [softwares];
    if (skills) perfil.skills = Array.isArray(skills) ? skills : [skills];
    if (country) perfil.country = country;
    if (city) perfil.city = city;
    if (about) perfil.about = about;
    if (socialMedia) {
      perfil.socialMedia = Array.isArray(socialMedia) ? socialMedia : [socialMedia];
    }
    if (portafolio && Array.isArray(portafolio)) perfil.portafolio = portafolio;
    if (photo) perfil.photo = photo;



    await perfil.save();

    return res.status(200).json({ ok: true, perfil });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ ok: false, msg: 'Error interno al actualizar el perfil' });
  }
};

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

    const currentUserId = req.uid;

    const perfiles = await Perfil.find({ user: { $ne: currentUserId } })
      .populate({
      path: 'user',
      select: 'name email seguidores seguidos'}); //Recupera todos los documentos de la colección Perfil y los relaciona con el modelo Usuario para obtener los datos del usuario asociado a cada perfil, excluyendo el perfil del usuario autenticado.
    res.status(200).json({
      ok: true,
      perfiles
    });
    console.log('Perfiles obtenidos:', perfiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener los perfiles'
    });
  }
};

const getPerfilByFilter = async (req, res = response) => {
  const { location, skill, software } = req.query;
  const currentUserId = req.uid;
  let filter = {};

  if (location && location.trim() !== "") {
    filter.country = { $regex: location, $options: 'i' };
  }
  if (skill && skill.trim() !== "") {
    filter.skills = { $in: [skill] };
  }
  if (software && software.trim() !== "") {
    filter.softwares = { $in: [software] };
  }
  // Excluir el perfil del usuario autenticado
  filter.user = { $ne: currentUserId };

  try {
    const perfiles = await Perfil.find(filter).populate('user', 'name email');
    res.status(200).json({ ok: true, perfiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al filtrar perfiles' });
  }
};

const obtenerPerfilPorId = async (req, res = response) => {
  const perfilId = req.params.id;
  console.log('Obteniendo perfil por ID:', perfilId);
  try {
    const perfil = await Perfil.findById(perfilId).populate('user', 'name email seguidores seguidos');
    console.log('Perfil encontrado:', perfil);
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
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener el perfil'
    });
  }
}

const obtenerPerfilUsuarioPorId = async (req, res = response) => {
  const userId = req.params.id;
  try {
    //Coger solo el perfil del usuario por su id
    const perfil = await Perfil.findOne({ user: userId }).populate('user', 'name email seguidores seguidos');
    console.log('Perfil de usuario encontrado:', perfil);
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
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener el perfil'
    });
  }
}

module.exports = {
   crearPerfil,
   getPerfil,
   getPerfiles,
   obtenerPerfilUsuarioPorId,
   actualizarPerfil,
   getPerfilByFilter,
   obtenerPerfilPorId,
}