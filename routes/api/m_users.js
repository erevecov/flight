import Joi from "joi";
import md5 from "md5";
import cloudant from "../../config/db.js";
import configEnv from "../../config/env_status.js";

let db = cloudant.db.use(configEnv.db);

const Users = [
  { // listar usuarios del sistema
    method: 'GET',
    path: '/api/listUsers',
    options: {
        description: 'GET test array',
        notes: 'Retorna listado de usuarios del sistema',
        tags: ['api'], // Hay que añadir esta linea para que se agregue a la documentación 
        handler: async (request, h) => {
            return new Promise(resolve=>{
                db.find({
                    'selector': {
                        '_id': {
                            '$gte': null
                        },
                        'type': 'user'
                    },
                    "fields": ["_id","_rev",'DNI','status', "name", "lastname", "email","userType", "password", "phone"]
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
  {
    // agregar usuario al sistema
    method: "POST",
    path: "/api/createUser",
    options: {
      handler: (request, h) => {
        let dni = request.payload.dni;
        let name = request.payload.name;
        let email = request.payload.email;
        let lastname = request.payload.lastname;
        let password = request.payload.password;
        let userType = request.payload.userType;
        let Mphone = request.payload.phone
        let newUserObj = {};

        return new Promise(resolve => {
          db.find(
            {
              selector: {
                _id: email,
                type: "user"
              },
              limit: 1
            },
            (err, result) => {
              if (err) throw err;

              if (result.docs[0]) {
                resolve({
                  error:
                    "el usuario de email " +
                    email +
                    " ya existe. Por favor ingrese otro."
                });
              } else {
                newUserObj._id = email;
                newUserObj.type = "user";
                newUserObj.DNI = dni;
                newUserObj.status = "enabled";
                newUserObj.name = name;
                newUserObj.lastname = lastname;
                newUserObj.password = md5(password);
                newUserObj.userType = userType;
                newUserObj.phone = Mphone;

                db.insert(newUserObj, function(errUpdate, body) {
                  if (errUpdate) throw errUpdate;

                  resolve({
                    ok: "Cliente " + newUserObj._id + " agregado correctamente!"
                  });
                });
              }
            }
          );
        });
      },
      validate: {
        payload: Joi.object().keys({
          name: Joi.string(),
          lastname: Joi.string(),
          dni: Joi.string(),
          email: Joi.string(),
          password: Joi.string(),
          userType: Joi.string(),
          phone: Joi.string()

        })
      }
    }
  },
  {
    // eliminar usuario al sistema
    method: "DELETE",
    path: "/api/disableUser",
    options: {
      handler: (request, h) => {
        let email = request.payload.email;

        return new Promise(resolve => {
          db.find(
            {
              selector: {
                _id: email,
                type: "user",
                status: "enabled"
              },
              limit: 1
            },
            (err, result) => {
              if (err) throw err;

              if (!result.docs[0]) {
                resolve({
                  error: `El usuario ${email} no existe o ya está deshabilitado.`
                });
              } else {
                let client = result.docs[0];

                client.status = "disabled";
                db.insert(client, function(errUpdate, body) {
                  if (errUpdate) throw errUpdate;

                  resolve({
                    ok: `El Cliente ${client._id} deshabilitado correctamente!`
                  });
                });
              }
            }
          );
        });
      },
      validate: {
        payload: Joi.object().keys({
          email: Joi.string()
        })
      }
    }
  },
  { 

  //elimina de un usuario ////////////////////////
      method: 'DELETE',
      path: '/api/deleteUser',
      config: {
          handler: (request, reply) => {
              let id = request.payload.id;
              let rev = request.payload.rev;
              db.destroy(id, rev, function(err, result, header) {
                  if (!err) {
                     // return reply(result);
                      console.log("Successfully deleted doc", id);
                  }
              });

          },
          validate: {
              payload: Joi.object().keys({
                  id: Joi.string(),
                  rev: Joi.string()
              })

          }
      }
  }
];

export default Users;
