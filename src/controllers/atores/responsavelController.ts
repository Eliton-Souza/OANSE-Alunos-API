import { Request, Response } from 'express';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Responsavel } from '../../models/Pessoa/Responsavel';
import { sequelize } from '../../instances/mysql';
import { atualizarPessoa, criarPessoa, salvarPessoa } from '../../services/atores/servicePessoa';


export const criarResponsavel = async (req: Request, res: Response) => {

  const transaction = await sequelize.transaction();
  const { nome, sobrenome, genero, nascimento} = req.body;

  try {
    const pessoa = await criarPessoa(nome, sobrenome, nascimento, genero, transaction);
  
      const responsavel = await Responsavel.create({
          id_pessoa: pessoa.id_pessoa,
          contato: req.body.contato
      }, { transaction });
  
      await transaction.commit();
  
      return res.json({ Responsavel: responsavel.id_responsavel });
  } catch (error: any) {
      await transaction.rollback();
      if (error.name === 'SequelizeUniqueConstraintError') {
        const str = error.errors[0].value;
        const novaStr = str.replace(/-/g, ' ');
      
        return res.json({ error:  novaStr + ' já está cadastrado(a) no sistema' });
      } else {
        return res.json({ error: error });
      }
  }
};



export const listarResponsaveis = async (req: Request, res: Response) => {
  try {
    const responsaveis = await Responsavel.findAll({
      include: [
        {
          model: Pessoa,
          attributes: {
            exclude: ['id_pessoa'],
          },
        },
      ],
      attributes: {
        exclude: ['id_pessoa'],
      },
      order: [[Pessoa, 'nome', 'ASC']],
      raw: true,
    });

    const responsaveisFormatados = responsaveis.map((responsavel: any) => {  
      return {
        id_responsavel: responsavel.id_responsavel,
        contato: responsavel.contato,
          
        nome: responsavel['Pessoa.nome'],
        sobrenome: responsavel['Pessoa.sobrenome'],
        genero: responsavel['Pessoa.genero'],
        nascimento: responsavel['Pessoa.nascimento'],      
      };
    });

    return res.json({ responsaveis: responsaveisFormatados });
  } catch (error) {
    return res.json({ error: 'Erro ao encontrar responsáveis' });
  }
};


export const pegarResponsavel = async (req: Request, res: Response) => {

  let id= req.params.id;

  try {
    const responsavelResponse = await Responsavel.findByPk(id, {
      include: [
          {
            model: Pessoa,
            attributes: { 
              exclude: ['id_pessoa']
            }
          },
        ],
      attributes: { 
          exclude: ['id_pessoa'] 
      },
      raw: true
  });

    

    interface responsavelFormatado {
      id_responsavel: number;
      contato: string;
  
      nome: string;
      sobrenome: string;
      genero: string;
      nascimento: string;
    }

    const responsavel: any= responsavelResponse;

    const responsavelFormatado: responsavelFormatado  = {

      id_responsavel: responsavel.id_responsavel,
      contato: responsavel.contato,
        
      nome: responsavel['Pessoa.nome'],
      sobrenome: responsavel['Pessoa.sobrenome'],
      genero: responsavel['Pessoa.genero'],
      nascimento: responsavel['Pessoa.nascimento'],      
    };
    
    return res.json({ responsavel: responsavelFormatado });
    
  } catch (error) {
    return res.json({ error: "Responsável não encontrado" });
  }
}



export const atualizarResponsavel = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const { nome, sobrenome, genero, nascimento, contato } = req.body;

    // Recuperar dados do responsavel do banco
    const responsavel = await Responsavel.findByPk(id);
    if (responsavel) {
        responsavel.contato= contato;
    }
    else{
      return res.json({ error: 'Responsavel não encontrado' });
    }

    // Recuperar dados da pessoa responsavel do banco
    const pessoaResponsavel = await Pessoa.findByPk(responsavel.id_pessoa);
    if (pessoaResponsavel) {
      atualizarPessoa(pessoaResponsavel, nome, sobrenome, genero, nascimento);
    }
    else{
      return res.json({ error: 'Responsavel não encontrado' });
    }

    // Salvar as alterações no banco de dados
    await salvarPessoa(responsavel, pessoaResponsavel, res);
    
    return res.json({ responsavel: responsavel, pessoa: pessoaResponsavel });
  } catch (error:any) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const str = error.errors[0].value;
      const novaStr = str.replace(/-/g, ' ');
    
      return res.json({ error:  novaStr + ' já está cadastrado(a) no sistema'});
    }
    return res.json({ error: 'Erro ao atualizar o responsavel'});
  }
};


export const deletarResponsavel = async (req: Request, res: Response) => {

  const id_responsavel= req.params.id;

  try {
    const responsavel= await Responsavel.findByPk(id_responsavel)

    if(responsavel){
      const id_pessoa= responsavel.id_pessoa;
      
      await Pessoa.destroy({where:{id_pessoa}});
      await Responsavel.destroy({where:{id_responsavel}});

      return res.json({ sucesso: "Responsavel excluído com sucesso" });
    }
    else{
      return res.json({ error: 'Responsavel não encontrado'});
    }
    
  } catch (error) {
    return res.json({ error: 'Erro ao excluir Responsavel'});
  } 
};