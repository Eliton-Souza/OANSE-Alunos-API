import Joi from 'joi';

const objAluno={
  id_responsavel: Joi.number().integer().min(0).optional(),
  id_manual: Joi.number().integer().min(0).optional()
}

export const pessoaSchema = Joi.object({
  nome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(3).max(15).required(),
  sobrenome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(3).max(30).required(),
  nascimento: Joi.date().iso().max('now').optional(),
  genero: Joi.string().valid('M', 'F').required()
}).options({ allowUnknown: true });

export const alunoSchema = pessoaSchema.concat(
  Joi.object({
    objAluno
  }).options({ allowUnknown: true })
);


export const updatePessoaSchema = pessoaSchema.optional();
export const updateAlunoSchema = updatePessoaSchema.concat(
  Joi.object({
    objAluno
  }).options({ allowUnknown: true })
);