import Joi from 'joi';

function materialSchema(metodo: 'optional' | 'required') {
  const materialValidation = Joi.object({
    nome: Joi.string().regex(/^[a-zA-Z0-9\sçÇáÁàÀâÂãÃéÉèÈêÊíÍìÌîÎóÓòÒôÔõÕúÚùÙûÛ\-\.]+$/)[metodo](),
    quantidade: Joi.number().integer().min(0).optional(),
    id_clube: Joi.number().integer().min(1)[metodo](),
    preco: Joi.number().min(0)[metodo](),
  });

  return materialValidation;
}

//Material
export const material = materialSchema("required");          //criar
export const updateMaterial = materialSchema("optional");    //atualizar



export const venda = Joi.object({
  materiais: Joi.array().items(
    Joi.object({
      id_material: Joi.number().integer().min(1).required(),
      quantidade: Joi.number().integer().min(1).required(),
      valor_unit: Joi.number().min(0).required(),
    })
  ).required(),
  valor_total: Joi.number().positive().min(0).required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  id_aluno: Joi.number().integer().min(0).required(),
});