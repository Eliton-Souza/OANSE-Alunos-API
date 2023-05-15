import { Request, Response, NextFunction } from 'express';
import { alunoSchema, pessoaSchema, updateAlunoSchema } from '../schemas/pessoaSchema';

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

//export const validaPessoa = validaSchema(pessoaSchema);
export const validaAluno = validaSchema(alunoSchema);
export const updateValidaAluno = validaSchema(updateAlunoSchema);
