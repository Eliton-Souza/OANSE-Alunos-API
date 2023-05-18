import Joi from 'joi';

export const operacao = Joi.object({
  tipo: Joi.string().valid('adicionar', 'retirar').required(),
  valor: Joi.number().positive().required()
});