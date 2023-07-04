import Joi from 'joi';

function pessoaSchema(metodo: 'optional' | 'required') {
  const pessoaValidation = Joi.object({
    nome: Joi.string().pattern(/^[a-zA-ZÀ-ú]+$/).min(2).max(15)[metodo](),
    sobrenome: Joi.string().pattern(/^[a-zA-ZÀ-ú\s]+$/).min(2).max(30)[metodo](),
    nascimento: Joi.date().iso().max('now').allow(null).optional(),
    genero: Joi.string().valid('M', 'F')[metodo]()
  });

  return pessoaValidation;
}

const alunoBase = Joi.object({
  id_responsavel: Joi.number().integer().min(0).optional(),
  id_manual: Joi.number().integer().min(0).optional(),
  carteira: Joi.boolean().optional()
});

const responsavelbase = Joi.object({
  contato: Joi.string().regex(/^\d{11}$/).pattern(/^\d+$/).allow(null).optional(),
});

const liderBase = Joi.object({
  id_clube: Joi.number().integer().min(0).optional(),
  login: Joi.string().pattern(/^\d{11}$/),
  senha: Joi.string().min(6).max(30).regex(/^(?=.*[a-zA-Z])(?=.*\d)/)
});

//Aluno
export const aluno = pessoaSchema("required").concat(alunoBase);          //criar
export const updateAluno = pessoaSchema("optional").concat(alunoBase);    //atualizar

//Responsavel
export const responsavel = pessoaSchema("required").concat(responsavelbase);          //criar
export const updateResponsavel = pessoaSchema("optional").concat(responsavelbase);    //atualizar

//Lider
export const lider = pessoaSchema("required").concat(liderBase);          //criar
export const updateLider = pessoaSchema("optional").concat(liderBase);    //atualizar

