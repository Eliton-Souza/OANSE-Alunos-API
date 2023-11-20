import Joi from 'joi';

export const entradaSaida = Joi.object({
  tipo: Joi.string().valid('entrada', 'saída').required(),
  valor: Joi.number().positive().required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  data: Joi.date().iso().max('now').required(),
  id_aluno: Joi.number().integer().min(0).required(),
});