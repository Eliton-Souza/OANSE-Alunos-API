import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';


export const criarResponsavel = async (req: Request, res: Response) => {

  const transaction = await sequelize.transaction();

  try {
      const pessoa = await criarPessoa(req.body, transaction);
  
      const responsavel = await Responsavel.create({
          id_pessoa: pessoa.id_pessoa,
          contato: req.body.contato
      }, { transaction });
  
      console.log('Pessoa e Responsavel inseridos com sucesso');
      await transaction.commit();
  
      res.json({ Pessoa: pessoa, Responsavel: responsavel });
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



export const listarResponsaveis = async (req: Request, res: Response) => {

  const responsavel = await Responsavel.findAll({
      include: [
          {
            model: Pessoa,
            attributes: { 
              exclude: ['id_pessoa']
            }
          },
        ],
      attributes: { 
          exclude: ['id_pessoa', 'id_responsavel'] 
      },
      raw: true
  });

  res.json({responsavel});
}


export const pegarResponsavel = async (req: Request, res: Response) => {
  
  let id= req.params.id;

  const responsavel = await Responsavel.findByPk(id, {
      include: [
          {
            model: Pessoa,
            attributes: { 
              exclude: ['id_pessoa']
            }
          },
        ],
      attributes: { 
          exclude: ['id_pessoa', 'id_responsavel'] 
      },
      raw: true
  });

  if(responsavel){
    res.json({responsavel});
  }
  else{
    res.json({error: 'Responsavel nao encontrado'});
  }
}



export const atualizarResponsavel = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const { nome, sobrenome, genero, nascimento, contato } = req.body;

    // Recuperar dados do responsavel do banco
    const responsavel = await Responsavel.findByPk(id);
    if (responsavel) {
        responsavel.contato= contato ?? responsavel.contato
    }
    else{
      return res.status(404).json({ error: 'Responsavel não encontrado' });
    }

    // Recuperar dados da pessoa responsavel do banco
    const pessoaResponsavel = await Pessoa.findByPk(responsavel.id_pessoa);
    if (pessoaResponsavel) {
      atualizarPessoa(pessoaResponsavel, req.body);
    }
    else{
      return res.status(404).json({ error: 'Responsavel não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(responsavel, pessoaResponsavel, res);
    
    res.json({ responsavel: responsavel, pessoa: pessoaResponsavel });
  } catch (error:any) {
    res.status(500).json({ error: 'Erro ao atualizar o responsavel'});
  }
};


export const deletarResponsavel = async (req: Request, res: Response) => {

  const id_responsavel= req.params.id;
  const responsavel= await Responsavel.findByPk(id_responsavel)

  if(responsavel){
    const id_pessoa= responsavel.id_pessoa;
    
    await Pessoa.destroy({where:{id_pessoa}});
    res.json({});
  }
  else{
    res.json({ error: 'Responsavel não encontrado'});
  }
};