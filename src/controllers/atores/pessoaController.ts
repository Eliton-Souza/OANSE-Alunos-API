import { Pessoa, } from '../../models/Pessoa';

export const criarPessoa = async (body: any, transaction: any) => {
    const pessoa = await Pessoa.create({
      genero: body.genero,
      nome: body.nome,
      sobrenome: body.sobrenome,
      nascimento: body.nascimento,
    }, { transaction });
  
    return pessoa;
}