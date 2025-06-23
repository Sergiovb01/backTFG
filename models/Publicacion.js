const {Schema, model } = require("mongoose");

//Publicación por defecto 
const PublicacionSchema = Schema({

  usuario:{
    type:Schema.Types.ObjectId, ref: 'Usuario', required: true,
  },

  titulo: {
     type: String, 
     required: true 
    },

  descripcion: { 
    type: String,
    required: true
  },

  categoria: { 
    type: [String],
    required: true
   },

  tipoArtista: { 
    type: [String],
    required: true
  },

  software: { 
    type: [String],
    required: true
  },

  imagenes: { 
    type: [String],
    required: true
  },

  fecha: { type: Date, default: Date.now },

  estado: { type: String, default: 'activa' },

})

module.exports = model('Publicacion', PublicacionSchema);