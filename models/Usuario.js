const {  Schema, model } = require("mongoose");

//Usuario por defecto 
const UsuarioSchema = Schema({

    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true 
    },
    
    seguidores: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],

    seguidos: [{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }],
    favoritos: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Publicacion' 
    }]

})

    //  RELACIÓN VIRTUAL CON PERFIL
    UsuarioSchema.virtual('perfil', {
    ref: 'PerfilUsuario',    
    localField: '_id',
    foreignField: 'user',    
    justOne: true
    });

    
    UsuarioSchema.set('toObject', { virtuals: true });
    UsuarioSchema.set('toJSON', { virtuals: true });

module.exports = model('Usuario', UsuarioSchema);