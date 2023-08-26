import Joi from 'joi';

export const entradaSaida = Joi.object({
  tipo: Joi.string().valid('entrada', 'saida').required(),
  valor: Joi.number().positive().required(),
  descricao: Joi.string().allow(null).max(200).optional(),
  id_aluno: Joi.number().integer().min(0).required(),
});