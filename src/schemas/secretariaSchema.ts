import Joi from 'joi';

function materialSchema(metodo: 'optional' | 'required') {
  const materialValidation = Joi.object({
    nome: Joi.string().regex(/^[a-zA-Z0-9\sçÇáÁàÀâÂãÃéÉèÈêÊíÍìÌîÎóÓòÒôÔõÕúÚùÙûÛ]+$/)[metodo](),
    quantidade: Joi.number().integer().min(0).optional().optional(),
    id_clube: Joi.number().integer().min(1).optional()[metodo](),
    preco: Joi.number().integer().min(0).optional().optional(),
  });

  return materialValidation;
}

//Material
export const material = materialSchema("required");          //criar
export const updateMaterial = materialSchema("optional");    //atualizar



export const venda = Joi.object({
  materiais: Joi.array().items(
    Joi.object({
      id_material: Joi.number().integer().min(0).required(),
      quantidade: Joi.number().integer().min(1).required(),
      valor_unit: Joi.number().positive().required(),
    })
  ).required(),
  valor_total: Joi.number().positive().required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  id_aluno: Joi.number().integer().min(0).required(),
});