import { Request, Response, NextFunction } from 'express';
import { alunoSchema, liderSchema, responsavelSchema, updateAlunoSchema, updateLiderSchema, updateResponsavelSchema } from '../schemas/pessoaSchema';

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
export const validaAluno = validaSchema(alunoSchema);
export const updateValidaAluno = validaSchema(updateAlunoSchema);

//RESPONSAVEL
export const validaResponsavel = validaSchema(responsavelSchema);
export const updateValidaResponsavel = validaSchema(updateResponsavelSchema);

//LIDER
export const validaLider = validaSchema(liderSchema);
export const updateValidaLider = validaSchema(updateLiderSchema);

