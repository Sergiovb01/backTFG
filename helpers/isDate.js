const moment = require("moment")

//Comprobar que el campo fecha es correcto
const isDate = (value ) => {

    if(!value){
        return false;
    }

    const fecha = moment(value);
    if( fecha.isValid()){
        return true;
    } else {
        return false;
    }
   
}   

module.exports = {
    isDate,
}