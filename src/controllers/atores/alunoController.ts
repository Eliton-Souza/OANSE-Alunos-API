import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { Clube, Manual } from '../../models/Clube';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';
import { Carteira } from '../../models/Negociacao/Carteira';
import { criarCarteira } from '../../services/Negociacao/serviceCarteira';
import { aluno } from '../../schemas/pessoaSchema';


export const criarAluno = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();
    const { nome, sobrenome, genero, nascimento, id_responsavel, id_manual } = req.body;  

    try {
        const pessoa = await criarPessoa(nome, sobrenome, nascimento, genero, transaction);

        let novaCarteira;
        if (req.body.carteira) {
          novaCarteira = await criarCarteira(transaction);
        }
    
        const aluno = await Aluno.create({
            id_pessoa: pessoa.id_pessoa,
            id_manual,
            id_responsavel,
            id_carteira: novaCarteira
        }, { transaction });
        await transaction.commit();
    
        return res.status(201).json({ Pessoa: pessoa, Aluno: aluno });
    } catch (error: any) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
          const str = error.errors[0].value;
          const novaStr = str.replace(/-/g, ' ');
        
          return res.status(409).json('O aluno(a) ' + novaStr + ' já está cadastrada no sistema');
        } else {
            return res.status(500).json(error);
        }
       
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
            model: Carteira,
            attributes: { 
              exclude: ['id_carteira', 'data_criacao']
            }
          },
          {
            model: Manual,
            attributes: ['nome'],
            include: [{
                  model: Clube,
                  attributes: { 
                      exclude: ['id_clube'] 
                  },
              }]
          },
          {
            model: Responsavel,
            attributes: ['contato'],
            include: [{
                  model: Pessoa,
                  attributes: { 
                    exclude: ['id_pessoa', 'id_responsavel']
                  }
              }]
          },
        ],
      attributes: { 
          exclude: ['id_pessoa'] 
      },
      raw: true
  });

  const alunosFormatados = alunos.map((aluno: any) => {  
    return {
      id_aluno: aluno.id_aluno,
      id_carteira: aluno.id_carteira,

      saldo: aluno['Carteira.saldo'],
      
      nome: aluno['Pessoa.nome'],
      sobrenome: aluno['Pessoa.sobrenome'],
      genero: aluno['Pessoa.genero'],
      nascimento: aluno['Pessoa.nascimento'],

      id_manual: aluno.id_manual,
      manual: aluno['Manual.nome'],
      clube: aluno['Manual.Clube.nome'],
      id_clube: aluno['Manual.Clube.id_clube'],
  
      id_responsavel: aluno.id_responsavel,
      nome_responsavel: aluno['Responsavel.Pessoa.nome'],
      sobrenome_responsavel: aluno['Responsavel.Pessoa.sobrenome'],
      genero_responsavel: aluno['Responsavel.Pessoa.genero'],
      contato_responsavel: aluno['Responsavel.contato'],
      nascimento_responsavel: aluno['Responsavel.Pessoa.nascimento'],
    };
  });

  return res.json({ alunos: alunosFormatados });
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
      atualizarPessoa(pessoaAluno, nome, sobrenome, genero, nascimento);
    }
    else{
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(aluno, pessoaAluno, res);
    
    res.json({ aluno: aluno, pessoa: pessoaAluno });
  } catch (error:any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Já existe uma pessoa ' + error.errors[0].value + ' cadastrada no sistema' });
    }
    return res.status(500).json({ error: 'Erro ao atualizar o aluno'});
  }
};


export const deletarAluno = async (req: Request, res: Response) => {

  const id_aluno= req.params.id;
  const aluno= await Aluno.findByPk(id_aluno);

  if(aluno){
    const id_pessoa= aluno.id_pessoa;
    const id_carteira= aluno.id_carteira;
    
    await Pessoa.destroy({where:{ id_pessoa }});
    await Carteira.destroy({ where: { id_carteira }});
    res.json({});
  }
  else{
    res.json({ error: 'Aluno não encontrado'});
  }
};