import Joi from 'joi';

function pessoaSchema(metodo: 'optional' | 'required') {
  const pessoaValidation = Joi.object({
    nome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(3).max(15)[metodo](),
    sobrenome: Joi.string().pattern(/^[\p{L}\s]{3,30}$/u).min(3).max(30)[metodo](),
    nascimento: Joi.date().iso().max('now').optional(),
    genero: Joi.string().valid('M', 'F')[metodo]()
  });

  return pessoaValidation;
}

const alunoBase = Joi.object({
  id_responsavel: Joi.number().integer().min(0).optional(),
  id_manual: Joi.number().integer().min(0).optional()
});

const responsavelbase = Joi.object({
  contato: Joi.string().regex(/^\d{11}$/).pattern(/^\d+$/).optional()
    .messages({
      'string.pattern.base': 'O campo de contato deve conter exatamente 11 números'
    })
});

const liderBase = Joi.object({
  id_clube: Joi.number().integer().min(0).optional(),
  login: Joi.string().min(6).max(15),
  senha: Joi.string().min(6).max(15)
});

//Aluno
export const alunoSchema = pessoaSchema("required").concat(alunoBase);          //criar
export const updateAlunoSchema = pessoaSchema("optional").concat(alunoBase);    //atualizar

//Responsavel
export const responsavelSchema = pessoaSchema("required").concat(responsavelbase);          //criar
export const updateResponsavelSchema = pessoaSchema("optional").concat(responsavelbase);    //atualizar

//Lider
export const liderSchema = pessoaSchema("required").concat(liderBase);          //criar
export const updateLiderSchema = pessoaSchema("optional").concat(liderBase);    //atualizar

