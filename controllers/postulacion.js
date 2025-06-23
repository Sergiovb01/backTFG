const { response } = require("express");
const Postulacion = require("../models/Postulacion");
const Publicacion = require('../models/Publicacion'); // asegúrate de tenerla

const crearPostulacion = async (req, res) => {
  const { publicacion, mensaje } = req.body;
  const usuario = req.uid; 

  try {
    const postulacion = new Postulacion({ usuario, publicacion, mensaje });
    await postulacion.save();
    res.status(201).json({ ok: true, postulacion });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al crear postulación' });
  }
};

const obtenerPostulacionesRecibidas = async (req, res) => {
  const usuarioId = req.uid;

  try {
    // 1. Obtener IDs de publicaciones creadas por el usuario logueado
    const publicaciones = await Publicacion.find({ usuario: usuarioId }).select('_id');

    const publicacionIds = publicaciones.map(p => p._id);

    // 2. Obtener todas las postulaciones hechas a esas publicaciones
    const postulaciones = await Postulacion.find({ publicacion: { $in: publicacionIds } })
        .populate({
            path: 'usuario',
            select: 'name email',
            populate: {
              path: 'perfil',
              model: 'PerfilUsuario',
              select: 'photo'
            }
          })
          .populate('publicacion', 'titulo')
          .lean({ virtuals: true });

    res.json({ ok: true, postulaciones });
  } catch (error) {
    console.error('Error al obtener postulaciones recibidas:', error);
    res.status(500).json({ ok: false, msg: 'Error al obtener postulaciones recibidas' });
  }
};

const eliminarPostulacion = async (req, res) => {
  const postulacionId = req.params.id;
  const uid = req.uid;

  try {
    const postulacion = await Postulacion.findById(postulacionId);
    if (!postulacion) {
      return res.status(404).json({ ok: false, msg: 'Postulación no encontrada' });
    }

    // Buscar la publicación asociada
    const publicacion = await Publicacion.findById(postulacion.publicacion);
    if (!publicacion) {
      return res.status(404).json({ ok: false, msg: 'Publicación no encontrada' });
    }

    // Verificar si el usuario actual es el creador de la publicación
    if (publicacion.usuario.toString() !== uid) {
      return res.status(403).json({ ok: false, msg: 'No autorizado para eliminar esta postulación' });
    }

    await postulacion.deleteOne();

    res.json({ ok: true, msg: 'Postulación eliminada correctamente' });

  } catch (error) {
    console.error('Error al eliminar la postulación:', error);
    res.status(500).json({ ok: false, msg: 'Error en el servidor' });
  }
};

module.exports = { crearPostulacion, obtenerPostulacionesRecibidas, eliminarPostulacion };