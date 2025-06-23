const Usuario = require('../models/Usuario');
const { response } = require("express");

// Seguir usuario
const seguirUsuario = async (req, res) => {
  const miId = req.uid;
  const seguidoId = req.params.id;

  try {
    if (miId === seguidoId) {
      return res.status(400).json({ msg: "No puedes seguirte a ti mismo" });
    }

    const yo = await Usuario.findById(miId);
    const otro = await Usuario.findById(seguidoId);

    if (!otro) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Añadir solo si no lo sigue ya
    if (!yo.seguidos.includes(seguidoId)) {
      yo.seguidos.push(seguidoId);
      otro.seguidores.push(miId);
      await yo.save();
      await otro.save();
    }

    return res.json({ ok: true, msg: "Usuario seguido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al seguir usuario" });
  }
};

// Dejar de seguir
const dejarDeSeguir = async (req, res) => {
  const miId = req.uid;
  const seguidoId = req.params.id;

  try {
    const yo = await Usuario.findById(miId);
    const otro = await Usuario.findById(seguidoId);

    if (!otro) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Eliminar solo si lo sigue
    yo.seguidos = yo.seguidos.filter(id => id.toString() !== seguidoId);
    // Eliminar de seguidores del otro usuario
    otro.seguidores = otro.seguidores.filter(id => id.toString() !== miId);

    // Guardar cambios
    await yo.save();
    await otro.save();

    return res.json({ ok: true, msg: "Dejaste de seguir al usuario" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al dejar de seguir usuario" });
  }
};

const getSeguidoresYSeguidos = async (req, res = response) => {
 const usuarioId = req.uid;

  try {
    const usuario = await Usuario.findById(usuarioId)
       .populate({
        path: 'seguidores',
        select: 'name email',
        populate: {
          path: 'perfil',
          select: 'photo',
          model: 'PerfilUsuario'
        }
      })
      .populate({
        path: 'seguidos',
        select: 'name email',
        populate: {
          path: 'perfil',
          select: 'photo',
          model: 'PerfilUsuario'
        }
      }).lean({ virtuals: true });

    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    res.status(200).json({
      ok: true,
      seguidores: usuario.seguidores,
      seguidos: usuario.seguidos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener seguidores y seguidos'
    });
  }
}

const agregarFavorito = async (req, res) => {
  const userId = req.uid;
  const { idPublicacion } = req.params;
console.log(`Agregando publicación ${idPublicacion} a favoritos del usuario ${userId}`);
  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario.favoritos.includes(idPublicacion)) {
      usuario.favoritos.push(idPublicacion);
      await usuario.save();
    }
    res.json({ ok: true, msg: 'Publicación añadida a favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al añadir a favoritos' });
  }
};

const eliminarFavorito = async (req, res) => {
  const userId = req.uid;
  const { idPublicacion } = req.params;

  try {
    await Usuario.findByIdAndUpdate(userId, {
      $pull: { favoritos: idPublicacion }
    });
    res.json({ ok: true, msg: 'Publicación eliminada de favoritos' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar de favoritos' });
  }
};

const obtenerFavoritos = async (req, res) => {
  const userId = req.uid;

  try {
    const usuario = await Usuario.findById(userId)
     .populate({
        path: 'favoritos',
        populate: {
          path: 'usuario',
          select: 'name',
          populate: {
            path: 'perfil',
            model: 'PerfilUsuario',
            select: 'photo'
        }
        }
      }).lean({ virtuals: true });

    res.json({ ok: true, favoritos: usuario.favoritos });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener favoritos' });
  }
};


module.exports = {
    seguirUsuario,
    dejarDeSeguir,
    getSeguidoresYSeguidos,
    agregarFavorito,
    eliminarFavorito,
    obtenerFavoritos
};