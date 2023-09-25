import { Request, Response, NextFunction } from 'express';
import * as atorSchema from '../schemas/pessoaSchema';
import * as negociacaoSchema from '../schemas/negociacaoSchema';
import * as descricaoSchema from '../schemas/descricaoSchema';
import * as secretariaSchema from '../schemas/secretariaSchema';

export const validaSchema = (schema: any) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error: any) {
    console.log(error);

    const errorMessage = error.details[0].message;
    const regex = /"([^"]+)"/;
    const match = regex.exec(errorMessage);
   
    if (match && match.length > 1) {
      return res.json({ error: 'O valor do campo ' + match[1] + ' está incorreto' });
    }
    else{
      return res.json(error);
    }
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


//SECRETARIA
export const material= validaSchema(secretariaSchema.material);
export const editarMaterial= validaSchema(secretariaSchema.updateMaterial);


//Venda
export const venda= validaSchema(secretariaSchema.venda);


//Pagamento
export const pagamento= validaSchema(secretariaSchema.pagamento);


//Caixa
export const caixa= validaSchema(secretariaSchema.movimentacao);


//DESCRIÇÕES
export const editaDescricao= validaSchema(descricaoSchema.descricao);