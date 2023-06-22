import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Lider } from '../../models/Pessoa/Lider';
import { sequelize } from '../../instances/mysql';
import { Clube } from '../../models/Clube';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';
import { dadosUsuario, gerarPayload, gerarToken } from '../../config/passport';

declare global {
  namespace Express {
    interface User extends dadosUsuario {}
  }
}

const bcrypt = require('bcrypt');

export const criarLider = async (req: Request, res: Response) => {

  const transaction = await sequelize.transaction();
  const { nome, sobrenome, genero, nascimento, senha} = req.body;

  const senhaHash= await bcrypt.hash(senha, 10);
  

  try {
    const pessoa = await criarPessoa(nome, sobrenome, nascimento, genero, transaction);

    const lider = await Lider.create({
        id_pessoa: pessoa.id_pessoa,
        id_clube: req.body.id_clube,
        login: req.body.login,
        senha: senhaHash
    }, { transaction });

    await transaction.commit();

    const payload= gerarPayload(lider.id_lider, (pessoa.nome +' '+ pessoa.sobrenome), lider.id_clube);
    const token= gerarToken(payload);

    res.json({ Pessoa: pessoa, Lider: lider, token: token });
  }catch (error: any) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      const str = error.errors[0].value;
      const novaStr = str.replace(/-/g, ' ');
    
      return res.json('Alguma pessoa já usa ' + novaStr + ' no sistema');
    }
    return res.json(error);
  }
};
  

export const listarLideres = async (req: Request, res: Response) => {

  try {
    const lideres = await Lider.findAll({
      include: [
          {
            model: Pessoa,
            attributes: ['nome', 'sobrenome']
          },
          {
            model: Clube,
            attributes: ['nome']
          }
        ],
      attributes: { 
          exclude: ['id_pessoa', 'id_clube', 'login', 'senha'] 
      },
      raw: true
    });
  
    const lideresFormatados = lideres.map((lider: any) => {
      return {
        id_lider: lider.id_lider,
        nome: lider['Pessoa.nome'],
        sobrenome: lider['Pessoa.sobrenome'],
        clube: lider['Clube.nome'],
      };
    });
    
    return res.json({ lideres: lideresFormatados });
  } catch (error) {
    return res.json(error);
  }
}



export const pegarLider = async (req: Request, res: Response) => {

  let id= req.params.id;

  try {
    const liderResponse = await Lider.findByPk(id, {
      include: [
        {
          model: Pessoa,
          attributes: { 
            exclude: ['id_pessoa']
          }
        },
        {
          model: Clube
        }
      ],
      attributes: { 
          exclude: ['id_pessoa', 'senha'] 
      },
      raw: true
    });

    interface liderFormatado {
      id_lider: number;
      login: string;

      nome: string;
      sobrenome: string;
      genero: string;
      nascimento: string;

      clube: string;
      id_clube: number;
    }

    const lider: any= liderResponse;

    const liderFormatado: liderFormatado  = {
      id_lider: lider.id_lider,
      login: lider.login,
     
      nome: lider['Pessoa.nome'],
      sobrenome: lider['Pessoa.sobrenome'],
      genero: lider['Pessoa.genero'],
      nascimento: lider['Pessoa.nascimento'],

      id_clube: lider.id_clube,
      clube: lider['Clube.nome'],
    };
    
    return res.json({ lider: liderFormatado });
    
  } catch (error) {
    res.json({error: "Aluno não encontrado"});
  }
}



export const atualizarLider = async (req: Request, res: Response) => {
  const id = req.params.id;
  
  try {
    const { nome, sobrenome, genero, nascimento, id_clube, login, senha } = req.body;

    // Recuperar dados do lider do banco
    const lider = await Lider.findByPk(id);
    if (lider) {
      lider.id_clube= id_clube ?? lider.id_clube,
      lider.login= login ?? lider.login,
      lider.senha= senha? await bcrypt.hash(senha, 10) : lider.senha
    }
    else{
      return res.json({ error: 'Lider não encontrado' });
    }

    // Recuperar dados da pessoa lider do banco
    const pessoaLider = await Pessoa.findByPk(lider.id_pessoa);
    if (pessoaLider) {
      atualizarPessoa(pessoaLider, nome, sobrenome, genero, nascimento);
    }
    else{
      return res.json({ error: 'Lider não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(lider, pessoaLider, res);
    
    res.json({ lider: lider, pessoa: pessoaLider });
  } catch (error:any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const str = error.errors[0].value;
      const novaStr = str.replace(/-/g, ' ');
    
      return res.json({error: 'Alguma pessoa já usa ' + novaStr + ' no sistema'});
    }
    return res.json({ error: 'Erro ao atualizar o lider'});
  }
};
  

export const deletarLider = async (req: Request, res: Response) => {

  const id_lider= req.params.id;
  const lider= await Lider.findByPk(id_lider)

  if(lider){
    const id_pessoa= lider.id_pessoa;
    
    await Pessoa.destroy({where:{id_pessoa}});
    await Lider.destroy({where:{id_lider}});
    return res.json({sucesso: "Lider excluído com sucesso"});
  }
  else{
    res.json({ error: 'Lider não encontrado'});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { login, senha } = req.body;

    const lider = await Lider.findOne({ where: { login } });
    if (!lider) {
      return res.json({ error: "Login ou senha incorretos" });
    }

    const match = await bcrypt.compare(senha, lider.senha);
    if (!match) {
      return res.json({ error: "Login ou senha incorretos" });
    }

    const pessoa = await Pessoa.findByPk(lider.id_pessoa);
    if (!pessoa) {
      return res.json({ error: "Pessoa não encontrada" });
    }

    const payload = gerarPayload(
      lider.id_lider,
      pessoa.nome + " " + pessoa.sobrenome,
      lider.id_clube
    );
    const token = gerarToken(payload);

    return res.json({ token });
  } catch (error: any) {
    return res.json({ error: "Erro ao fazer o login" });
  }
};