import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Lider } from '../../models/Pessoa/Lider';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { Clube, Manual } from '../../models/Clube';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';
import { dadosUsuario, gerarToken } from '../../config/passport';

const bcrypt = require('bcrypt');
const expiracaoToken= Math.floor(Date.now() / 1000) + (3600 * 6) // Definindo a expiração para 6 horas a partir do momento atual

export const criarLider = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();
    const { nome, sobrenome, genero, nascimento} = req.body;
  
    try {
      const pessoa = await criarPessoa(nome, sobrenome, nascimento, genero, transaction);

      const senha= await bcrypt.hash(req.body.senha, 10);
       
        const lider = await Lider.create({
            id_pessoa: pessoa.id_pessoa,
            id_clube: req.body.id_clube,
            login: req.body.login,
            senha
        }, { transaction });
    
        console.log('Pessoa e Lider inseridos com sucesso');
        await transaction.commit();
  
     
        if(!pessoa){
          res.json({error: "Erro pessoa não encontrada"});
          return;
        };

        const payload: dadosUsuario = {
          id_lider: lider.id_lider,
          nome: pessoa.nome,
          id_clube: lider.id_clube,
          exp: expiracaoToken
        }

        const token= gerarToken(payload);
    
        res.json({ Pessoa: pessoa, Lider: lider, token: token });
    } catch (error: any) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('Já existe uma pessoa ' + error.errors[0].value + ' cadastrada no banco');
        } else {
            console.log('Ocorreu um erro ao inserir a pessoa:', error);
        }
        res.status(500).json(error.errors[0].value + " ja existe cadastrado no banco");
    }
  };
  

  export const listarLideres = async (req: Request, res: Response) => {

    const lideres = await Lider.findAll({
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
            exclude: ['id_pessoa', 'id_clube'] 
        },
        raw: true
    });

    
    
  res.json({ lideres });
  
  }



  export const pegarLider = async (req: Request, res: Response) => {

    let id= req.params.id;

    const lider = await Lider.findByPk(id, {
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
            exclude: ['id_pessoa', 'id_clube'] 
        },
        raw: true
    });

    if(lider){
        res.json({lider});
    }
    else{
        res.json({error: 'Lider nao encontrado'});
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
        lider.senha= senha ?? lider.senha
      }
      else{
        return res.status(404).json({ error: 'Lider não encontrado' });
      }
  
      // Recuperar dados da pessoa lider do banco
      const pessoaLider = await Pessoa.findByPk(lider.id_pessoa);
      if (pessoaLider) {
        atualizarPessoa(pessoaLider, req.body);
      }
      else{
        return res.status(404).json({ error: 'Lider não encontrado' });
      }
  
      // Salvar as alterações no banco de dados
      await salvarPessoa(lider, pessoaLider, res);
      
      res.json({ lider: lider, pessoa: pessoaLider });
    } catch (error:any) {
      res.status(500).json({ error: 'Erro ao atualizar o lider'});
    }
  };
  

  export const deletarLider = async (req: Request, res: Response) => {

    const id_lider= req.params.id;
    const lider= await Lider.findByPk(id_lider)
  
    if(lider){
      const id_pessoa= lider.id_pessoa;
      
      await Pessoa.destroy({where:{id_pessoa}});
      res.json({});
    }
    else{
      res.json({ error: 'Lider não encontrado'});
    }
  };

  export const login= async (req: Request, res: Response) => {

    if(req.body.login && req.body.senha){
      let login: string = req.body.login;
      let senha: string = req.body.senha;

      const lider = await Lider.findOne({where: {login}})
      if(!lider){
        res.json({error: "Login e/ou senha incorretos"});
        return;
      }

      const match = await bcrypt.compare(senha, lider.senha);
      if(!match){
        res.json({error: "Login e/ou senha incorretos"});
        return;
      }

      const pessoa = await Pessoa.findByPk(lider.id_pessoa);
  
     
      if(!pessoa){
        res.json({error: "Erro pessoa não encontrada"});
        return;
      };

      const payload: dadosUsuario = {
        id_lider: lider.id_lider,
        nome: pessoa.nome,
        id_clube: lider.id_clube,
        exp: expiracaoToken
      }

      const token= gerarToken(payload);

      
      res.json({ status: true, token: token});
      return;
    }

    res.json({ status: false });
  };