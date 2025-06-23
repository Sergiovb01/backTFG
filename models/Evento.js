const { Schema, model } = require('mongoose');

const EventoSchema = Schema({

   usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },

   nombre: String,

   descripcion: String,

   fecha: Date,

   enlace: String,
   
   tipo: String


});



module.exports = model('Evento', EventoSchema);