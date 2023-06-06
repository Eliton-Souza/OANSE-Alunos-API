import { Response } from 'express';
import { Pessoa, PessoaInstace } from '../../models/Pessoa/Pessoa';
import { AlunoInstace } from '../../models/Pessoa/Aluno';
import { LiderInstace } from '../../models/Pessoa/Lider';
import { ResponsavelInstace, } from '../../models/Pessoa/Responsavel';

export const criarPessoa = async (nome: string, sobrenome: string, nascimento: Date, genero: string, transaction: any) => {

  const nomePadronizado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  
  const palavrasSobrenome = sobrenome.split(' ');
  const sobrenomePadronizado = palavrasSobrenome.map((palavra: string) => {
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
  }).join(' ');
  
  const pessoa = await Pessoa.create({
      nome: nomePadronizado,
      sobrenome: sobrenomePadronizado,
      nascimento,
      genero,
    }, { transaction });

  return pessoa;

}

export const atualizarPessoa = (pessoa: PessoaInstace, nome: string, sobrenome: string, genero: string, nascimento: Date) => {
  
  try {
    pessoa.nome = nome ?? pessoa.nome;
    pessoa.sobrenome = sobrenome ?? pessoa.sobrenome;
    pessoa.genero = genero ?? pessoa.genero;
    pessoa.nascimento = nascimento ?? pessoa.nascimento;

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