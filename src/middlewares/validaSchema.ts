import { Request, Response, NextFunction } from 'express';
import * as atorSchema from '../schemas/pessoaSchema';
import * as negociacaoSchema from '../schemas/negociacaoSchema';
import { throws } from 'assert';

export const validaSchema = (schema: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err: any) {

    const regex = /\"([^"]+)\" with value/;
    const match = err.details[0].message.match(regex);
    const campoComErro = match ? match[1] : null;

    res.status(422).json('O valor do campo ' + campoComErro + ' está incorreto');
    //throw err;
  }
};

//ALUNO
export const aluno = validaSchema(atorSchema.aluno);
export const updateAluno = validaSchema(atorSchema.updateAluno);

//RESPONSAVEL
export const responsavel = validaSchema(atorSchema.responsavel);
export const updateResponsavel = validaSchema(atorSchema.updateResponsavel);

//LIDER
export const lider = validaSchema(atorSchema.lider);
export const updateLider = validaSchema(atorSchema.updateLider);


//NEGOCIACAO
export const alteraSaldo= validaSchema(negociacaoSchema.entradaSaida);
export const editaDescricao= validaSchema(negociacaoSchema.descricaoTransacao);
