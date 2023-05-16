import { Request, Response } from 'express';
import { Pessoa, Aluno, Lider, Responsavel } from '../../models/Pessoa';
import { sequelize } from '../../instances/mysql';
import { Clube, Manual } from '../../models/Clube';
import { criarPessoa } from './pessoaController';


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
      

