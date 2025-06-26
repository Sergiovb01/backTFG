const { Schema, model } = require("mongoose");

const PerfilSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  softwares: {
    type: [String],
    required: true
  },

  skills: {
    type: [String],
    required: true
  },

  country: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  about: {
    type: String,
    required: true
  },

  socialMedia: {
    type: [{
      platform: { type: String, required: true },
      account: { type: String, required: true }
    }],
    required: true
  },

 portafolio: [
  {
    url: { type: String, required: true },
    tipo: { type: String, required: true }
  }
],

  photo: {
    type: String,
  },

});

module.exports = model('PerfilUsuario', PerfilSchema);
