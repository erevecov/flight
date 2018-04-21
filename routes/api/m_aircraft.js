import Joi from 'joi';
import cloudant from '../../config/db.js';
import configEnv from '../../config/env_status.js';

let db = cloudant.db.use(configEnv.db);

const TestAircraft = [
{ // ver los tipos de aeronave
    method: 'GET',
    path: '/api/aircraftType',
    options: {
        description: 'GET test array',
        notes: 'Retorna un arreglo de documentos de tipo test',
        tags: ['api'], // Hay que añadir esta linea para que se agregue a la documentación 
        handler: async (request, h) => {
            return new Promise(resolve=>{
                db.find({
                    'selector': {
                        '_id': {
                            '$gte': null
                        },
                        'type': 'aircrafts'
                    }
                }, (err, result) => {
                    if (err) throw err;
                    
                    if(result.docs[0]) {
                        resolve(result.docs);   
                    } else {
                        resolve({err: 'no existen documentos de tipo test'});
                    }
                });
            })
        }
    }
},
{// add aircraft
    
    method: "POST",
    path: "/api/createAircraft",
    options: {
      description: 'POST new user',
      notes: 'Crea un nuevo avion en el sistema',
      tags: ['api'], // Hay que añadir esta linea para que se agregue a la documentación 
      handler: (request, h) => {
    
        let enrollment=request.payload.enrollment ;
        let typeAircraft=request.payload.typeAircraft ;
        let aircraftCertificate=request.payload.aircraftCertificate ;
        let maxTakeoff=request.payload.maxTakeoff ;
        let serialNumber=request.payload.serialNumber ;
        let standardCertificate=request.payload.standardCertificate ;
        let dateExpireCAircraft=request.payload.dateExpireCAircraft ;
        let estelaTurbolenta=request.payload.estelaTurbolenta ;
        let TelemergencyEquipment=request.payload.TelemergencyEquipment ;
        let UserOwner=request.payload.UserOwner;
        let newAirplane = {};


        return new Promise(resolve => {
          db.find(
            {
              selector: {
                _id: enrollment,
                type: "aircraft"
              },
              limit: 1
            },
            (err, result) => {
              if (err) throw err;
              console.log(err);

              if (result.docs[0]) {
                resolve({
                  error:
                    "ya existe."
                });
              } else {

                newAirplane._id = enrollment;
                newAirplane.type = "aircraft";
                newAirplane.status = "enabled";
                newAirplane.enrollment = enrollment;
                newAirplane.typeAircraft = typeAircraft;
                newAirplane.aircraftCertificate = aircraftCertificate;
                newAirplane.maxTakeoff = maxTakeoff;
                newAirplane.serialNumber = serialNumber; 
                newAirplane.standardCertificate = standardCertificate;
                newAirplane.dateExpireCAircraft = dateExpireCAircraft;
                newAirplane.estelaTurbolenta = estelaTurbolenta;
                newAirplane.TelemergencyEquipment = TelemergencyEquipment;
                newAirplane.UserOwner = UserOwner;
  
         
                     
                db.insert(newAirplane, function(errUpdate, body) {
                  if (errUpdate) throw errUpdate;

                  resolve({
                   // ok: "Cliente " + newUserObj._id + " agregado correctamente!"
                   body
                  });
                });
              }
            }
          );
        });
      },
      validate: {
        payload: Joi.object().keys({
          
                enrollment: Joi.string(),
                typeAircraft: Joi.string(),
                aircraftCertificate: Joi.string(),
                maxTakeoff: Joi.string(),
                serialNumber: Joi.string(),
                standardCertificate: Joi.string(),
                dateExpireCAircraft: Joi.date(),
                estelaTurbolenta: Joi.string(),
                TelemergencyEquipment: Joi.string(),
                UserOwner: Joi.string()

        })
      }
    }
  },
{ // ver los tipos de Certificados
    method: 'GET',
    path: '/api/aircraftCertificate',
    options: {
        description: 'GET test array',
        notes: 'Retorna un arreglo de documentos de tipo test',
        tags: ['api'], // Hay que añadir esta linea para que se agregue a la documentación 
        handler: async (request, h) => {
            return new Promise(resolve=>{
                db.find({
                    'selector': {
                        '_id': {
                            '$gte': null
                        },
                        'type': 'aircraftCertificate'
                    }
                }, (err, result) => {
                    if (err) throw err;
                    
                    if(result.docs[0]) {
                        resolve(result.docs);   
                    } else {
                        resolve({err: 'no existen documentos de tipo test'});
                    }
                });
            })
        }
    }
},
{ // ver los tele-equipos de emergencia
    method: 'GET',
    path: '/api/TelemergencyEquipment',
    options: {
        description: 'GET test array',
        notes: 'Retorna un arreglo de documentos de tipo test',
        tags: ['api'], // Hay que añadir esta linea para que se agregue a la documentación 
        handler: async (request, h) => {
            return new Promise(resolve=>{
                db.find({
                    'selector': {
                        '_id': {
                            '$gte': null
                        },
                        'type': 'telemergencyEquipment'
                    }
                }, (err, result) => {
                    if (err) throw err;
                    
                    if(result.docs[0]) {
                        resolve(result.docs);   
                    } else {
                        resolve({err: 'no existen documentos de tipo test'});
                    }
                });
            })
        }
    }
}];

export default TestAircraft;