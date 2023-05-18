import { Request, Response, NextFunction } from 'express';
import * as atorSchema from '../schemas/pessoaSchema';
import * as negociacaoSchema from '../schemas/negociacaoSchema';

export const validaSchema = (schema: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: err.details[0].message });
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
