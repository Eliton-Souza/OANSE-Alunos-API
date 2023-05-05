import { Request, Response } from 'express';
import { Pessoa, Aluno, Lider } from '../models/Pessoa';

export const ping = (req: Request, res: Response) => {
    res.json({pong: true});
}




export const rotapessoa = async (req: Request, res: Response) => {

    
    const pessoa = await Pessoa.create({
        genero: 'M',
        nascimento: new Date('1985-01-01'),
        nome: 'Fulano'
      });
      

    res.json({pessoa});
}


export const consulta = async (req: Request, res: Response) => {
    const lideres = await Lider.findAll({
        include: [Pessoa]
    });

    res.json({lideres});
    
}




export const criaAluno = async (req: Request, res: Response) => {

    
    const pessoa = await Pessoa.create({
        genero: 'M',
        nascimento: new Date('2005-08-21'),
        nome: 'Fulano criança'
      });
      
      const aluno = await Aluno.create({
        id_pessoa: pessoa.id_pessoa,
        id_clube: 2,
        id_responsavel: 1,
        id_manual: 1,
        id_carteira: 1
      });
      


    res.json({aluno});
}



export const criaLider = async (req: Request, res: Response) => {

    
    const pessoa = await Pessoa.create({
        genero: 'F',
        nascimento: new Date('1999-03-25'),
        nome: 'Fulano lider'
      });
      
    
      const lider = await Lider.create({
        id_adulto: pessoa.id_pessoa,
        id_clube: 4,
        login: 'um login forte',
        senha: 'outra senha forte'
      });
      

    res.json({obj: lider});
}


export const consultaLider = async (req: Request, res: Response) => {

    const lideres = await Lider.findAll({
        include: [
            {
                include: [Pessoa]
            }
        ]
    });

    res.json({lideres});
}
























/*






export const register = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let { email, password } = req.body;

        let hasUser = await Pessoa.findOne({where: { email }});
        if(!hasUser) {
            let newUser = await Pessoa.create({ email, password });

            res.status(201);
            res.json({ id: newUser.id });
        } else {
            res.json({ error: 'E-mail já existe.' });
        }
    }

    res.json({ error: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    if(req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await Pessoa.findOne({ 
            where: { email, password }
        });

        if(user) {
            res.json({ status: true });
            return;
        }
    }

    res.json({ status: false });
}

export const list = async (req: Request, res: Response) => {
    let users = await Pessoa.findAll();
    let list: string[] = [];

    for(let i in users) {
        list.push( users[i].email );
    }

    res.json({ list });
}*/