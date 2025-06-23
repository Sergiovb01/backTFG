const { response } = require("express");
const Publicacion = require('../models/Publicacion');
const Perfil = require("../models/Perfil")
const mongoose = require('mongoose');


const crearPublicacion = async (req, res = response) => {
 
    try{
        //Creamos una nueva estancia del modelo publicacion
         const publicacion = new Publicacion({
            ...req.body, //Copia todos los campos que vienen en el cuerpo de la petición
            usuario: req.uid // El uid lo inyecta el middleware validar-jwt
        });


        const publicacionGuardada = await publicacion.save(); //Guarda la nueva publicación en la base de datos

         res.status(201).json({
            ok: true,
            publicacion: publicacionGuardada
        });

    }catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la publicación'
        });
  }
};

const obtenerPublicaciones = async (req, res = response) => {

   const currentUserId = req.uid;
  try {
    const publicaciones = await Publicacion.find({ usuario: { $ne: currentUserId } }) // Excluye las publicaciones del usuario actual
      .sort({ fecha: -1 })
      .populate({
        path: 'usuario',
        select: 'name email',
        populate: {
          path: 'perfil',
          model: 'PerfilUsuario',
          select: 'photo'
        }
      }).lean({ virtuals: true }); // <.lean({ virtuals: true }); // <
      

    res.status(200).json({
      ok: true,
      publicaciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las publicaciones'
    });
  }
};

const obtenerPublicacionPorId = async (req, res = response) => {
  
    const { id } = req.params;

  try {
    const publicacion = await Publicacion.findById(id)
    .populate({
        path: 'usuario',
        select: 'name email seguidores seguidos',
        populate: {
          path: 'perfil',
          model: 'PerfilUsuario',
          select: 'photo'
        }
      }).lean({ virtuals: true }); 

    console.log(publicacion);
    
      if (!publicacion) {
        return res.status(404).json({
          ok: false,
          msg: 'Publicación no encontrada'
        });
      }

      res.status(200).json({
        ok: true,
        publicacion
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener la publicación'
      });
  }
};

const obtenerMisPublicaciones = async (req, res = response) => {
  const currentUserId = req.uid;
  try {
    const publicaciones = await Publicacion.find({ usuario: currentUserId })
      .sort({ fecha: -1 })

    res.status(200).json({
      ok: true,
      publicaciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las publicaciones'
    });
  }
};

const actulizarPublicacion = async (req, res = response) => {
  const { id } = req.params;
  const { titulo, descripcion, categoria, tipoArtista, software, imagenes } = req.body;

  try {
    // Verificar si la publicación existe
    const publicacion = await Publicacion.findById(id);
    if (!publicacion) {
      return res.status(404).json({
        ok: false,
        msg: 'Publicación no encontrada'
      });
    }

    // Actualizar los campos de la publicación
    publicacion.titulo = titulo;
    publicacion.descripcion = descripcion;
    publicacion.categoria = categoria;
    publicacion.tipoArtista = tipoArtista;
    publicacion.software = software;
    publicacion.imagenes = imagenes;

    const publicacionActualizada = await publicacion.save();

    res.status(200).json({
      ok: true,
      publicacion: publicacionActualizada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar la publicación'
    });
  }
};

const getPublicacionByFilter = async (req, res = response) => {
  const { category, skill, software } = req.query;
  const currentUserId = req.uid;

  const filter = {
    usuario: { $ne: currentUserId }
  };

  if (category && category.trim() !== "") {
    filter.categoria = { $in: [category] };
  }

  if (skill && skill.trim() !== "") {
    filter.tipoArtista = { $in: [skill] };
  }

  if (software && software.trim() !== "") {
    filter.software = { $in: [software] };
  }

  try {
    const publicaciones = await Publicacion.find(filter)
      .sort({ fecha: -1 })
      .populate({
        path: 'usuario',
        select: 'name email',
        populate: {
          path: 'perfil',
          model: 'PerfilUsuario',
          select: 'photo'
        }
      }).lean({ virtuals: true });

    
    res.status(200).json({ ok: true, publicaciones });

  } catch (error) {
    console.error('❌ Error al filtrar:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener las publicaciones'
    });
  }
};

// Obtener publicaciones por usuario
const getPublicacionesPorUsuario = async (req, res) => {
  const { userId } = req.params;

  try {
    // Busca todas las publicaciones del usuario
    const publicaciones = await Publicacion.find({ usuario: userId }).sort({ createdAt: -1 });


    if (!publicaciones || publicaciones.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontraron publicaciones para este usuario.'
      });
    }

    return res.status(200).json({
      ok: true,
      publicaciones: publicaciones
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return res.status(500).json({
      ok: false,
      msg: 'Error interno al obtener publicaciones.'
    });
  }
};


module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  obtenerMisPublicaciones,
  actulizarPublicacion,
  getPublicacionByFilter,
  getPublicacionesPorUsuario
};