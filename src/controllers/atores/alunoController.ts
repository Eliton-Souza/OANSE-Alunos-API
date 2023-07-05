import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { Clube, Manual } from '../../models/Clube';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';
import { Carteira } from '../../models/Negociacao/Carteira';
import { criarCarteira } from '../../services/Negociacao/serviceCarteira';

export const criarAluno = async (req: Request, res: Response) => {

    const transaction = await sequelize.transaction();
    const { nome, sobrenome, genero, nascimento, id_responsavel, id_manual } = req.body;  

    try {
        const pessoa = await criarPessoa(nome, sobrenome, nascimento, genero, transaction);

        const novaCarteira = await criarCarteira(transaction);
        
        const aluno = await Aluno.create({
            id_pessoa: pessoa.id_pessoa,
            id_manual,
            id_responsavel,
            id_carteira: novaCarteira
        }, { transaction });
        await transaction.commit();
    
        return res.json({ Aluno: aluno.id_aluno });
    } catch (error: any) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
          const str = error.errors[0].value;
          const novaStr = str.replace(/-/g, ' ');
        
          return res.json({error:  novaStr + ' já está cadastrado(a) no sistema'});
        } else {
            return res.json({error: error});
        }
       
    }
};


export const listarAlunos = async (req: Request, res: Response) => {
  const id_clube = req.user?.id_clube;

  let whereClause = {}; // Cláusula where inicial vazia

  if (id_clube !== 8) {
    whereClause = { '$Manual.Clube.id_clube$': id_clube }; // Filtra os alunos pelo id_clube
  }

  try {
    const alunos = await Aluno.findAll({
      include: [
        {
          model: Pessoa,
          attributes: ['nome', 'sobrenome']
        },
        {
          model: Carteira,
          attributes: ['saldo']
        },
        {
          model: Manual,
          attributes: ['nome'],
          include: [
            {
              model: Clube,
              attributes: ['nome']
            }
          ]
        }
      ],
      where: whereClause, // Aplica a cláusula where dinamicamente
      attributes: {
        exclude: ['id_pessoa', 'id_responsavel', 'id_manual', 'id_carteira']
      },
      raw: true
    });
  
    const alunosFormatados = alunos.map((aluno: any) => {
      return {
        id_aluno: aluno.id_aluno,
        nome: aluno['Pessoa.nome'],
        sobrenome: aluno['Pessoa.sobrenome'],
        clube: aluno['Manual.Clube.nome'],
        manual: aluno['Manual.nome'],
        saldo: aluno['Carteira.saldo']
      };
    });
  
    return res.json({ alunos: alunosFormatados, clube: id_clube});
    
  } catch (error) {
    return res.json({error: "Erro ao encontrar alunos"})
  }
};


export const rankingAlunos = async (req: Request, res: Response) => {
 
  try {
    const alunos = await Aluno.findAll({
      include: [
        {
          model: Pessoa,
          attributes: ['nome', 'sobrenome']
        },
        {
          model: Carteira,
          attributes: ['saldo']
        },
        {
          model: Manual,
          include: [
            {
              model: Clube,
              attributes: ['nome']
            }
          ]
        }
      ],
      attributes: {
        exclude: ['id_pessoa', 'id_responsavel', 'id_manual', 'id_carteira']
      },
      order: [[Carteira, 'saldo', 'DESC']],
      raw: true
    });
  
    const alunosFormatados = alunos.map((aluno: any) => {
      return {
        id_aluno: aluno.id_aluno,
        nome: aluno['Pessoa.nome'],
        sobrenome: aluno['Pessoa.sobrenome'],
        clube: aluno['Manual.Clube.nome'],
        saldo: aluno['Carteira.saldo']
      };
    });
  
    return res.json({ alunos: alunosFormatados});
    
  } catch (error) {
    return res.json({error: "Erro ao encontrar alunos"})
  }
};



export const pegarAluno = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const alunoResponse= await Aluno.findByPk(id, {
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
          include: [
            {
              model: Clube,
              attributes: ['nome']
            }
          ]
        },
        {
          model: Responsavel,
          attributes: ['contato'],
          include: [
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome', 'genero', 'nascimento'],
            }
          ]
        },
      ],
      attributes: {
        exclude: ['id_pessoa']
      },
      raw: true
    });

    interface AlunoFormatado {
      id_aluno: number;
      id_carteira: number;
      saldo: number;
      nome: string;
      sobrenome: string;
      genero: string;
      nascimento: string;
      id_manual: number;
      manual: string;
      clube: string;
      id_clube: number;
      id_responsavel: number;
      nome_responsavel: string;
      sobrenome_responsavel: string;
      genero_responsavel: string;
      nascimento_responsavel: string;
      contato_responsavel: string;
    }

    const aluno: any= alunoResponse;

    const alunoFormatado: AlunoFormatado = {
      id_aluno: aluno.id_aluno,
      id_carteira: aluno.id_carteira,
      saldo: aluno['Carteira.saldo'],

      nome: aluno['Pessoa.nome'],
      sobrenome: aluno['Pessoa.sobrenome'],
      genero: aluno['Pessoa.genero'],
      nascimento: aluno['Pessoa.nascimento'],

      id_manual: aluno.id_manual,
      manual: aluno['Manual.nome'],

      id_clube: aluno['Manual.Clube.id_clube'],
      clube: aluno['Manual.Clube.nome'],

      id_responsavel: aluno.id_responsavel,
      nome_responsavel: aluno['Responsavel.Pessoa.nome'],
      sobrenome_responsavel: aluno['Responsavel.Pessoa.sobrenome'],
      genero_responsavel: aluno['Responsavel.Pessoa.genero'],
      nascimento_responsavel: aluno['Responsavel.Pessoa.nascimento'],
      contato_responsavel: aluno['Responsavel.contato'],
    };
    
    return res.json({ aluno: alunoFormatado });
  } catch (error) {
    return res.json({ error: 'Aluno não encontrado'});
  }
};


export const atualizarAluno = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const { nome, sobrenome, genero, nascimento, id_responsavel, id_manual } = req.body;

    // Recuperar dados do aluno do banco
    const aluno = await Aluno.findByPk(id);
    if (aluno) {
      aluno.id_responsavel= id_responsavel,
      aluno.id_manual= id_manual ?? aluno.id_manual
    }
    else{
      return res.json({ error: 'Aluno não encontrado' });
    }

    // Recuperar dados da pessoa aluno do banco
    const pessoaAluno = await Pessoa.findByPk(aluno.id_pessoa);
    if (pessoaAluno) {
      atualizarPessoa(pessoaAluno, nome, sobrenome, genero, nascimento);
    }
    else{
      return res.json({ error: 'Aluno não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(aluno, pessoaAluno, res);
    
    return res.json({ aluno: aluno.id_aluno });
  } catch (error:any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const str = error.errors[0].value;
      const novaStr = str.replace(/-/g, ' ');
    
      return res.json({error: novaStr + ' já está cadastrado(a) no sistema'});
    }
    return res.json({ error: 'Erro ao atualizar o aluno'});
  }
};


export const deletarAluno = async (req: Request, res: Response) => {

  const id_aluno= req.params.id;

  try {
    const aluno= await Aluno.findByPk(id_aluno);

    if(aluno){
      const id_pessoa= aluno.id_pessoa;
      const id_carteira= aluno.id_carteira;
      
      await Pessoa.destroy({where:{ id_pessoa }});
      await Aluno.destroy({where:{id_aluno}});
  
      await Carteira.destroy({ where: { id_carteira }});
  
      return res.json({sucesso: "Aluno excluído com sucesso"});
    }
    else{
      return res.json({ error: 'Aluno não encontrado'});
    }
    
  } catch (error) {
    return res.json({ error: 'Erro ao excluir Aluno'});
  }
};