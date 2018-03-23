import Joi from "joi";
import md5 from "md5";
import cloudant from "../../config/db.js";
import configEnv from "../../config/env_status.js";

let db = cloudant.db.use(configEnv.db);

const Users = [
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
                newUserObj.status = "enabled";
                newUserObj.name = name;
                newUserObj.lastname = lastname;
                newUserObj.password = md5(password);

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
          password: Joi.string()
        })
      }
    }
  },
  {
    // agregar usuario al sistema
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
  }
];

export default Users;
