import { Request, Response } from 'express';
import { Pessoa, Aluno, Lider, Responsavel } from '../models/Pessoa';
import { sequelize } from '../instances/mysql';
import { Clube, Manual } from '../models/Clube';


const criarPessoa = async (body: any, transaction: any) => {
    const pessoa = await Pessoa.create({
      genero: body.genero,
      nome: body.nome,
      sobrenome: body.sobrenome,
      nascimento: body.nascimento,
    }, { transaction });
  
    return pessoa;
}


export const criarAluno = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();

    try {
        const pessoa = await criarPessoa(req.body, transaction);
    
        const aluno = await Aluno.create({
            id_pessoa: pessoa.id_pessoa,
            id_clube: req.body.id_clube,
            id_manual: req.body.id_manual,
            id_responsavel: req.body.id_responsavel,
        }, { transaction });
    
        console.log('Pessoa e Aluno inseridos com sucesso');
        await transaction.commit();
    
        res.json({ Pessoa: pessoa, Aluno: aluno });
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


export const listarAlunos = async (req: Request, res: Response) => {

    const alunos = await Aluno.findAll({
        include: [
            {
              model: Pessoa,
              attributes: { 
                exclude: ['id_pessoa']
              }
            },
            {
              model: Manual,
              attributes: ['nome'],
              include: [{
                    model: Clube,
                    attributes: { 
                        exclude: ['id_clube', 'id_manual'] 
                    },
                }]
            },
            {
              model: Responsavel,
              attributes: ['contato'],
              include: [{
                    model: Pessoa,
                    attributes: { 
                      exclude: ['id_pessoa']
                    }
                }]
            },
          ],
        attributes: { 
            exclude: ['id_pessoa','id_clube', 'id_manual', 'id_responsavel'] 
        },
        raw: true
    });

    res.json({alunos});
}


export const pegarAluno = async (req: Request, res: Response) => {

    let id= req.params.id;

    const aluno= await Aluno.findByPk(id,{
        include: [
            {
              model: Pessoa,
              attributes: { 
                exclude: ['id_pessoa']
              }
            },
            {
              model: Manual,
              attributes: ['nome'],
              include: [{
                    model: Clube,
                    attributes: { 
                        exclude: ['id_clube', 'id_manual'] 
                    },
                }]
            },
            {
              model: Responsavel,
              attributes: ['contato'],
              include: [{
                    model: Pessoa,
                    attributes: { 
                      exclude: ['id_pessoa']
                    }
                }]
            },
          ],
        attributes: { 
            exclude: ['id_pessoa', 'id_manual', 'id_responsavel'] 
        },
        raw: true
    });

    if(aluno){
        res.json({aluno});
    }
    else{
        res.json({error: 'Aluno nao encontrado'});
    }
}

export const atualizarAluno = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const { nome, sobrenome, genero, nascimento, id_responsavel, id_manual } = req.body;

    // Recuperar dados do aluno do banco
    const aluno = await Aluno.findByPk(id);
    if (aluno) {
      aluno.id_responsavel= id_responsavel ?? aluno.id_responsavel,
      aluno.id_manual= id_manual ?? aluno.id_manual
    }
    else{
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Recuperar dados da pessoa aluno do banco
    const pessoaAluno = await Pessoa.findByPk(aluno.id_pessoa);
    if (pessoaAluno) {
      pessoaAluno.nome = nome ?? pessoaAluno.nome 
      pessoaAluno.sobrenome= sobrenome ?? pessoaAluno.sobrenome,
      pessoaAluno.genero= genero ?? pessoaAluno.genero,
      pessoaAluno.nascimento= nascimento ?? pessoaAluno.nascimento
    }
    else{
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Salvar as alterações no banco de dados
    try {
      await aluno.save();
      await pessoaAluno.save();
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Já existe uma pessoa ' + error.errors[0].value + ' cadastrada no banco' });
      }
      throw error;
    }
    
    res.json({ aluno: aluno, pessoa: pessoaAluno });
  } catch (error:any) {
    res.status(500).json({ error: 'Erro ao atualizar o aluno'});
  }
};


export const deletarAluno = async (req: Request, res: Response) => {

  const id_aluno= req.params.id;
  const aluno= await Aluno.findByPk(id_aluno)

  if(aluno){
    const id_pessoa= aluno.id_pessoa;
    
    await Pessoa.destroy({where:{id_pessoa}});
    res.json({});
  }
  else{
    res.json({ error: 'Aluno não encontrado'});
  }
};

  
  






export const criarResponsavel = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();

    try {
        const pessoa = await criarPessoa(req.body, transaction);
    
        const responsavel = await Responsavel.create({
            id_pessoa: pessoa.id_pessoa,
            contato: req.body.contato,
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


export const criarLider = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();

    try {
        const pessoa = await criarPessoa(req.body, transaction);
    
        const lider = await Lider.create({
            id_pessoa: pessoa.id_pessoa,
            id_clube: req.body.id_clube,
            login: req.body.login,
            senha: req.body.senha,
        }, { transaction });
    
        console.log('Pessoa e Lider inseridos com sucesso');
        await transaction.commit();
    
        res.json({ Pessoa: pessoa, Lider: lider });
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
      

