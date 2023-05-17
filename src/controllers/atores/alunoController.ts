import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { Clube, Manual } from '../../models/Clube';
import { atualizarPessoa, criarPessoa, salvarPessoa } from './pessoaController';


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
      atualizarPessoa(pessoaAluno, req.body);
    }
    else{
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(aluno, pessoaAluno, res);
    
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