import Joi from 'joi';
import cloudant from '../../config/db.js';
import configEnv from '../../config/env_status.js';

let db = cloudant.db.use(configEnv.db);

const Test = [{ // ver todos
    method: 'GET',
    path: '/api/test',
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
                        'type': 'test'
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

export default Test;