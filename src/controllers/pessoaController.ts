import { Request, Response } from 'express';
import { Pessoa, Aluno, Lider, PessoaInstace, AlunoInstace, ResponsavelInstace } from '../models/Pessoa';

export const criaAluno = async (req: Request, res: Response) => {

 
    if (req.body.nome && req.body.sobrenome && req.body.genero) {
        try {
        const pessoa = await Pessoa.create({
            genero: req.body.genero,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            // nascimento: new Date(req.body.nascimento),
        })
    
        const aluno = await Aluno.create({
            id_pessoa: pessoa.id_pessoa,
            id_clube: req.body.id_clube,
            //  id_clube: req.body.id_clube,
            //  id_manual: req.body.id_manual,
        });
    
        console.log('Pessoa inserida com sucesso');
        res.json({ Pessoa: pessoa, Aluno: aluno });
        } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('Já existe uma pessoa com o mesmo nome e data de nascimento');
        } else {
            console.log('Ocorreu um erro ao inserir a pessoa:', error);
        }
        res.status(500).json({ error });
        }
    } else {
        res.status(400).json({ error: 'Dados inválidos' });
    }
};
      

