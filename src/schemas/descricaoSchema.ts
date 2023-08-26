import Joi from 'joi';

export const descricao = Joi.object({
  descricao: Joi.string().allow(null).max(200).optional(),
});