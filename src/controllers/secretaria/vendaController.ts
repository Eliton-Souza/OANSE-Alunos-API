import { Request, Response } from 'express';
import { Venda } from '../../models/Secretaria/Venda';
import { sequelize } from '../../instances/mysql';
import { Venda_Material_Ass } from '../../models/Secretaria/VendaMaterial';
import { format } from 'date-fns';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { pegarInfosVenda } from '../../services/fincaneiro/serviceVendas';
import { retirarEstoque } from '../../services/secretaria/serviceSecretaria';

export const registrarVenda = async (req: Request, res: Response) => {
  
  const transaction = await sequelize.transaction();
  const id_lider = req.user?.id_lider;

  const { id_pessoa, valor_total, descricao, materiais } = req.body;

  try {
    const venda = await Venda.create({
      id_pessoa,
      id_lider,
      valor_total,
      data: format(new Date, 'yyyy-MM-dd'),
      descricao,
      status_pag: 'Pendente'
    }, { transaction });

    // Iterar sobre a lista de materiais
    for (const material of materiais) {
      const { id_material, quantidade, valor_unit } = material;

      await retirarEstoque(id_material, quantidade);

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

  try {
    const vendas = await Venda.findAll({              
      include: [
        {
          model: Pessoa,
          attributes: {
            exclude: ['nascimento', 'genero']
          },
        }
      ],
      attributes: {
        exclude: ['id_pessoa', 'id_lider', 'descricao']
      },
      order: [['id_venda', 'DESC']],
      raw: true
    });

  
    const vendasFormatadas = vendas.map((venda: any) => {
      return {
        id_venda: venda.id_venda,
        nome_pessoa: venda['Pessoa.nome'],
        sobrenome_pessoa: venda['Pessoa.sobrenome'],
        valor_total: venda.valor_total,
        data: venda.data,
        status: venda.status_pag
      };
    });
  
    return res.json({ vendas: vendasFormatadas});
    
  } catch (error) {
    return res.json({error: "Erro ao encontrar vendas"})
  }
}


export const pegarVenda = async (req: Request, res: Response) => {

  const id = req.params.id;

  try {
   
    const venda = await pegarInfosVenda(id);
    return res.json({ venda });
   
  } catch (error: any) {
    return res.json({ error: error });
  }
};


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
