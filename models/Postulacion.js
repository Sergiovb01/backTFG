const { Schema, model } = require('mongoose');

const PostulacionSchema = Schema({
  usuario: { 
    type: Schema.Types.ObjectId, ref: 'Usuario', required: true 
  },
  
  publicacion: { type: Schema.Types.ObjectId, ref: 'Publicacion', required: true 

  },

  mensaje: String
});

module.exports = model('Postulacion', PostulacionSchema);
