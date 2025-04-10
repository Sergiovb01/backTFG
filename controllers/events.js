const { response } = require("express");
const Evento = require("../models/Evento");



const getEventos = async(req, res = response) => {

    //Buscar los eventos 
    const eventos = await Evento.find().populate('user', 'name');
                                
    res.json({
        ok:true,
        eventos
    })
   
}


const crearEvento = async (req, res = response) => {

    const evento = new Evento(req.body);

    try{
        //Obtener el id del usuario
        evento.user = req.uid;
        
        const eventoGuardado = await evento.save();

        res.json({
            ok:true,
            evento:eventoGuardado
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

    
   
}


const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;//Coger el id del evento de la url
    const uid = req.uid; //id del usuario activo
   

    try{

        const evento = await Evento.findById(eventoId);//Buscar el evento por id
        console.log(evento.id);

        //Comporbar si existe el evento con ese id
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'No existe ningún evento con ese id'
            })
        }

        if(evento.user.toString() !== uid){//comprobar si el usuario que quiere editar el evento es la misa que lo creo
            return res.status(401).json({
                ok:false,
                msg:'No tiene permisos para editar el evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); //Para que envíe el evento actualizado

        res.json({
            ok:true,
            evento: eventoActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

   
   
}

const eliminarEvento = async (req, res = response) => {
    const eventoId = req.params.id;//Coger el id del evento de la url
    const uid = req.uid; //id del usuario
   

    try{

        const evento = await Evento.findById(eventoId);//Buscar el evento por id

        //Comporbar si existe el evento con ese id
        if(!evento){
           return res.status(404).json({
                ok:false,
                msg:'No existe ningún evento con ese id'
            })
        }

        if(evento.user.toString() !== uid){//comprobar si el usuario que quiere editar el evento es la misa que lo creo
            return res.status(401).json({
                ok:false,
                msg:'No tiene permisos para editar el evento'
            })
        }

        

        await Evento.findByIdAndDelete(eventoId); //Para que envíe el evento actualizado

        res.json({
            ok:true,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
   
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}