import { Response } from 'express';
import { Pessoa, PessoaInstace } from '../../models/Pessoa/Pessoa';
import { AlunoInstace } from '../../models/Pessoa/Aluno';
import { LiderInstace } from '../../models/Pessoa/Lider';
import { ResponsavelInstace, } from '../../models/Pessoa/Responsavel';

export const criarPessoa = async (nome: string, sobrenome: string, nascimento: Date, genero: string, transaction: any) => {

  const nomePadronizado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  const sobrenomePadronizado = sobrenome.charAt(0).toUpperCase() + sobrenome.slice(1).toLowerCase();
  
  const pessoa = await Pessoa.create({
      nome: nomePadronizado,
      sobrenome: sobrenomePadronizado,
      nascimento,
      genero,
    }, { transaction });

  return pessoa;

}

export const atualizarPessoa = (pessoa: PessoaInstace, dados: PessoaInstace) => {
  
  try {
    pessoa.nome = dados.nome ?? pessoa.nome;
    pessoa.sobrenome = dados.sobrenome ?? pessoa.sobrenome;
    pessoa.genero = dados.genero ?? pessoa.genero;
    pessoa.nascimento = dados.nascimento ?? pessoa.nascimento;

  } catch (error: any) {
    console.log('Ocorreu um erro ao criar pessoa:', error);
    return(error);
  }
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