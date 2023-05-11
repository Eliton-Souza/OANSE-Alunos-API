import { Request, Response } from 'express';
import { Pessoa, Aluno, Lider, Responsavel } from '../models/Pessoa';
import { sequelize } from '../instances/mysql';


export const criarAluno = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();

    try {
        const pessoa = await Pessoa.create({
            genero: req.body.genero,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            nascimento: req.body.nascimento,
        }, { transaction });
    
        const aluno = await Aluno.create({
            id_pessoa: pessoa.id_pessoa,
            id_clube: req.body.id_clube,
            id_manual: req.body.id_manual,
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


export const criarResponsavel = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();

    try {
        const pessoa = await Pessoa.create({
            genero: req.body.genero,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            nascimento: req.body.nascimento,
        }, { transaction });
    
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
            console.log('Já existe uma pessoa com o mesmo nome, sobrenome ou contato');
        } else {
            console.log('Ocorreu um erro ao inserir a pessoa:', error);
        }
        res.status(500).json(error.errors[0].value + " ja existe cadastrado no banco");
    }
    
};
      

