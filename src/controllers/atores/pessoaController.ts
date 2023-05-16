import { Response } from 'express';
import { AlunoInstace, LiderInstace, Pessoa, PessoaInstace, ResponsavelInstace, } from '../../models/Pessoa';

export const criarPessoa = async (body: any, transaction: any) => {
    const pessoa = await Pessoa.create({
      genero: body.genero,
      nome: body.nome,
      sobrenome: body.sobrenome,
      nascimento: body.nascimento,
    }, { transaction });
  
    return pessoa;
}

export const atualizarPessoa = (pessoa: PessoaInstace, dados: PessoaInstace) => {
  pessoa.nome = dados.nome ?? pessoa.nome;
  pessoa.sobrenome = dados.sobrenome ?? pessoa.sobrenome;
  pessoa.genero = dados.genero ?? pessoa.genero;
  pessoa.nascimento = dados.nascimento ?? pessoa.nascimento;
};



//ALTERAÇÕES DE UPDATE NO BANCO
type tipoPessoa= AlunoInstace | ResponsavelInstace | LiderInstace | PessoaInstace;
async function salvarObjeto(objeto: tipoPessoa, res: Response) {
  try {
    await objeto.save();
  } catch (error: any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Já existe uma pessoa ' + error.errors[0].value + ' cadastrada no banco' });
    }
    throw error;
  }
}

export const salvarPessoa = async (obj1: tipoPessoa, obj2: tipoPessoa, res: Response) => {
  await salvarObjeto(obj1, res);
  await salvarObjeto(obj2, res);
};