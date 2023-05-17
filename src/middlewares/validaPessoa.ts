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
export const aluno = validaSchema(alunoSchema);
export const updateAluno = validaSchema(updateAlunoSchema);

//RESPONSAVEL
export const responsavel = validaSchema(responsavelSchema);
export const updateResponsavel = validaSchema(updateResponsavelSchema);

//LIDER
export const lider = validaSchema(liderSchema);
export const updateLider = validaSchema(updateLiderSchema);

