import Joi from 'joi';

export const pessoaSchema = Joi.object({
    nome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(3).max(15).required(),
    sobrenome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(3).max(30).required(),
    nascimento: Joi.date().iso().max('now').optional(),
    genero: Joi.string().valid('M', 'F').required()
  }).options({ allowUnknown: true });


export const alunoSchema = Joi.object({
  id_responsavel: Joi.number().integer().min(0).optional(),
  id_manual: Joi.number().integer().min(0).optional()
}).options({ allowUnknown: true });