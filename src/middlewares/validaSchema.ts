import { Request, Response, NextFunction } from 'express';
import * as Schema from '../schemas/pessoaSchema';
import { operacao } from '../schemas/carteiraSchema';

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
export const aluno = validaSchema(Schema.aluno);
export const updateAluno = validaSchema(Schema.updateAluno);

//RESPONSAVEL
export const responsavel = validaSchema(Schema.responsavel);
export const updateResponsavel = validaSchema(Schema.updateResponsavel);

//LIDER
export const lider = validaSchema(Schema.lider);
export const updateLider = validaSchema(Schema.updateLider);


//CARTEIRA
export const transacao= validaSchema(operacao);
