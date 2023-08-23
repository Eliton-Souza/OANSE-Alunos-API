import Joi from 'joi';

function materialSchema(metodo: 'optional' | 'required') {
  const materialValidation = Joi.object({
    nome: Joi.string().regex(/^[a-zA-Z0-9\sçÇáÁàÀâÂãÃéÉèÈêÊíÍìÌîÎóÓòÒôÔõÕúÚùÙûÛ]+$/)[metodo](),
    quantidade: Joi.number().integer().min(0).optional().optional(),
    id_clube: Joi.number().integer().min(1).optional()[metodo](),
    valor: Joi.number().integer().min(0).optional().optional(),
  });

  return materialValidation;
}

//Material
export const material = materialSchema("required");          //criar
export const updateMaterial = materialSchema("optional");    //atualizar

