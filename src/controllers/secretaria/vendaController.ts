import { Request, Response } from 'express';
import { Material } from '../../models/Secretaria/Material';
import { Venda } from '../../models/Secretaria/Venda';
import { sequelize } from '../../instances/mysql';
import { Venda_Material_Ass } from '../../models/Secretaria/VendaMaterial';
import { format } from 'date-fns';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Lider } from '../../models/Pessoa/Lider';
import { pegarNomeMaterial } from '../../services/secretaria/serviceSecretaria';

export const registrarVenda = async (req: Request, res: Response) => {
  
  const transaction = await sequelize.transaction();
  const id_lider = req.user?.id_lider;

  const { id_aluno, valor_total, descricao, materiais } = req.body;

  try {
    const venda = await Venda.create({
      id_aluno,
      id_lider,
      valor_total,
      data: format(new Date, 'yyyy-MM-dd'),
      descricao,
      status_pag: 'Pendente'
    }, { transaction });

    // Iterar sobre a lista de materiais
    for (const material of materiais) {
      const { id_material, quantidade, valor_unit } = material;

      let novoID = venda.id_venda + '-' + id_material;

      await Venda_Material_Ass.create({
        id_venda_material: novoID,
        id_venda: venda.id_venda,
        id_material,
        quantidade,
        valor_unit,
      }, { transaction });
    }

    // Commit da transação após todas as operações bem-sucedidas
    await transaction.commit();

    return res.json({ Venda: venda.id_venda });
  } catch (error: any) {
    // Rollback da transação em caso de erro
    await transaction.rollback();
    return res.json({ error: error });
  }
};



export const listarVendas = async (req: Request, res: Response) => {

  const tipo = req.params.tipo;

  let whereClause = {}; // Cláusula where inicial vazia

  if (tipo !== 'todas') {
    whereClause = { '$Venda.status_pag$': tipo }; // Filtra as vendas
  }

  try {
    const vendas = await Venda.findAll({
      include: [
        {
          model: Lider,
          attributes: {
            exclude: ['login', 'senha', 'id_lider', 'id_pessoa', 'id_clube']
          },
          include: [ 
            {
              model: Pessoa,
              attributes: {
                exclude: ['nascimento', 'genero']
              },
            }
          ]
        },
        {
          model: Aluno,
          attributes: {
            exclude: ['id_aluno', 'id_pessoa', 'id_responsavel', 'id_manual', 'id_carteira']
          },
          include: [
            {
              model: Pessoa,
              attributes: {
                exclude: ['nascimento', 'genero']
              },
            }
          ]
        }
      ],
      where: whereClause, // Aplica a cláusula where dinamicamente
      attributes: {
        exclude: ['id_aluno', 'id_lider']
      },
      order: [['id_venda', 'DESC']],
      raw: true
    });

  
    const vendasFormatadas = vendas.map((venda: any) => {
      return {
        id_venda: venda.id_venda,
        nome_lider: venda['Lider.Pessoa.nome'],
        sobrenome_lider: venda['Lider.Pessoa.sobrenome'],
        nome_aluno: venda['Aluno.Pessoa.nome'],
        sobrenome_aluno: venda['Aluno.Pessoa.sobrenome'],
        valor_total: venda.valor_total,
        data: venda.data,
        descricao: venda.descricao,
        status: venda.status_pag
      };
    });
  
    return res.json({ vendas: vendasFormatadas});
    
  } catch (error) {
    return res.json({error: "Erro ao encontrar vendas"})
  }
}


export const pegarVenda = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;

    const vendaResponse = await Venda.findByPk(id, {
      include: [
        {
          model: Lider,
          attributes: {
            exclude: ['login', 'senha', 'id_lider', 'id_pessoa', 'id_clube']
          },
          include: [ 
            {
              model: Pessoa,
              attributes: {
                exclude: ['nascimento', 'genero']
              },
            }
          ]
        },
        {
          model: Aluno,
          attributes: {
            exclude: ['id_aluno', 'id_pessoa', 'id_responsavel', 'id_manual', 'id_carteira']
          },
          include: [
            {
              model: Pessoa,
              attributes: {
                exclude: ['nascimento', 'genero']
              },
            }
          ]
        }
      ],
        attributes: {
        exclude: ['id_aluno', 'id_lider']
      },
      raw: true
    });

    interface VendaFormatada {
      id_venda: number;
      nome_lider: string;
      sobrenome_lider: string
      nome_aluno: string;
      sobrenome_aluno: string;
      valor_total: number;
      data: Date;
      descricao: string;
      status: string;
    }

    const venda: any= vendaResponse;
    
    const vendaFormatada: VendaFormatada = {
      id_venda: venda.id_venda,
      nome_lider: venda['Lider.Pessoa.nome'],
      sobrenome_lider: venda['Lider.Pessoa.sobrenome'],
      nome_aluno: venda['Aluno.Pessoa.nome'],
      sobrenome_aluno: venda['Aluno.Pessoa.sobrenome'],
      valor_total: venda.valor_total,
      data: venda.data,
      descricao: venda.descricao,
      status: venda.status_pag,
    };

    const materiaisVendidos = await Venda_Material_Ass.findAll({
     where: { id_venda: id },
      attributes: {
        exclude: ['id_venda_material', 'id_venda']
      },
    });

    const materiaisFormatadas = await Promise.all(materiaisVendidos.map(async (material: any) => {
      const nome_material = await pegarNomeMaterial(material.id_material);
      return {
        nome_material,
        quantidade: material.quantidade,
        valor_unit: material.valor_unit,
      };
    }));
    
    return res.json({ venda: vendaFormatada, materiais: materiaisFormatadas });
  } catch (error) {
    return res.json({ error});
  }
}


export const editarVenda = async (req: Request, res: Response) => {

  const id_venda = req.params.id;

  try {
    const { descricao } = req.body;

    // Recupera venda do banco
    const venda = await Venda.findByPk(id_venda);
    if (venda) { 
        venda.descricao= descricao;                         //pode editar apenas a descricao
        await venda.save();
        return res.json({ Venda: venda});
    }
    else{
        return res.json({ error: 'Venda não encontrada' });
    }
   }catch (error:any) {
    res.json({ error: 'Erro ao editar Venda'});
  }
};


export const deletarVenda = async (req: Request, res: Response) => {
    
    const id_venda= req.params.id;

    try {
      const venda= await Venda.findByPk(id_venda);
  
      if(venda){
        await Venda_Material_Ass.destroy({where: {id_venda}});
        await Venda.destroy({ where: { id_venda }});
        return res.json({sucesso: "Venda excluído com sucesso"});
      }
      else{
        return res.json({ error: 'Venda não encontrada'});
      }
      
    } catch (error) {
      return res.json({ error: 'Erro ao excluir Venda'});
    }
};
