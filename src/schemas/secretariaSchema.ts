import Joi from 'joi';

function materialSchema(metodo: 'optional' | 'required') {
  const materialValidation = Joi.object({
    nome: Joi.string().regex(/^[a-zA-Z0-9\sçÇáÁàÀâÂãÃéÉèÈêÊíÍìÌîÎóÓòÒôÔõÕúÚùÙûÛ\-\.]+$/)[metodo](),
    quantidade: Joi.number().integer().min(0).optional(),
    id_clube: Joi.number().integer().min(1)[metodo](),
    preco: Joi.number().min(0).optional(),
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
  valor_total: Joi.number().min(0).required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  id_pessoa: Joi.number().integer().min(1).required(),
  data: Joi.date().iso().max('now').required(),
});


export const pagamento = Joi.object({
  valor_pago: Joi.number().min(0).required(),
  tipo: Joi.string().valid('Pix', 'Dinheiro').required(),
  id_venda: Joi.number().integer().min(1).required(),
  data: Joi.date().iso().max('now').required(),
});


export const movimentacao = Joi.object({
  valor: Joi.number().positive().required(),
  tipo: Joi.string().valid('entrada', 'saída').required(),
  tipo_pag: Joi.string().valid('Pix', 'Dinheiro').required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  data: Joi.date().iso().max('now').required(),
  motivo: Joi.string().max(200).required(),
});