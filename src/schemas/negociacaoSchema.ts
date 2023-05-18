import Joi from 'joi';

export const entradaSaida = Joi.object({
  tipo: Joi.string().valid('entrada', 'saida').required(),
  valor: Joi.number().positive().required()
});

export const descricaoTransacao = Joi.object({
  descricao: Joi.string().optional()
});