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


export const alunos = async (req: Request, res: Response) => {

    const alunos = await Aluno.findAll({
        include: [
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome']
            },
            {
              model: Clube,
              attributes: ['nome']
            },
            {
              model: Manual,
              attributes: ['nome']
            },
            {
              model: Responsavel,
              attributes: ['contato'],
              include: [
                {
                  model: Pessoa,
                  attributes: ['nome', 'sobrenome'],
                }
                ]
            }
          ],
        attributes: { 
            exclude: ['id_aluno', 'id_pessoa','id_clube', 'id_manual', 'id_responsavel'] 
        },
        raw: true
    });

    res.json({alunos});
}










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
      

