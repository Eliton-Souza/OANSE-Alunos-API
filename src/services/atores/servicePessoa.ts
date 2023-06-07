import { Response } from 'express';
import { Pessoa, PessoaInstace } from '../../models/Pessoa/Pessoa';
import { AlunoInstace } from '../../models/Pessoa/Aluno';
import { LiderInstace } from '../../models/Pessoa/Lider';
import { ResponsavelInstace, } from '../../models/Pessoa/Responsavel';
import _ from 'lodash';

const palavraPadronizado = (nome: string) => {
  const nomeFormatado = _.startCase(_.toLower(nome));

  return nomeFormatado;
}


export const criarPessoa = async (nome: string, sobrenome: string, nascimento: Date, genero: string, transaction: any) => {

  const nomePadronizado = palavraPadronizado(nome);
  const sobrenomePadronizado = palavraPadronizado(sobrenome);
  
  const pessoa = await Pessoa.create({
      nome: nomePadronizado,
      sobrenome: sobrenomePadronizado,
      nascimento,
      genero,
    }, { transaction });

  return pessoa;

}

export const atualizarPessoa = (pessoa: PessoaInstace, nome: string, sobrenome: string, genero: string, nascimento: Date) => {

  const nomePadronizado = palavraPadronizado(nome);
  const sobrenomePadronizado = palavraPadronizado(sobrenome);
  
  try {
    pessoa.nome = nome? nomePadronizado : pessoa.nome;
    pessoa.sobrenome = sobrenome? sobrenomePadronizado : pessoa.sobrenome;
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
    throw error;
  }
}

export const salvarPessoa = async (obj1: tipoPessoa, obj2: tipoPessoa, res: Response) => {
  await salvarObjeto(obj1, res);
  await salvarObjeto(obj2, res);
};