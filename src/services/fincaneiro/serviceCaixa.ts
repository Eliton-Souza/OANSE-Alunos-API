import { Lider } from "../../models/Pessoa/Lider";
import { Pessoa } from "../../models/Pessoa/Pessoa";
import { Caixa } from "../../models/Secretaria/Caixa";
import { format } from 'date-fns'

export const criarMovimentacaoCaixa = async (valor: number, id_lider: number, tipo: string,  tipo_pag: string, descricao: string, transaction: any) => {

  try {
    const movimentacao = await Caixa.create({
      valor,
      id_lider,
      tipo,
      tipo_pag,
      data: format(new Date, 'yyyy-MM-dd'), 
      descricao,
    }, { transaction });

    return movimentacao;
    
  } catch (error: any) {
    await transaction.rollback();
    throw error;
  }
}




export const listarMovimentacoesCaixa = async (tipo: string) => {

  let whereClause = {}; // Cláusula where inicial vazia

  if (tipo !== 'todas') {
    whereClause = { '$Caixa.tipo$': tipo }; // Filtra as vendas
  }

  try {
    const movimentacoes = await Caixa.findAll({
      where: whereClause, // Aplica a cláusula where dinamicamente
      attributes: {
        exclude: ['tipo_pag', 'id_lider', 'data']
      },
      order: [['id_movimentacao', 'DESC']],
      raw: true
    });

    return movimentacoes;
    
  } catch (error: any) {
    throw error;
  }
}



export const pegarMovimentacaoCaixa = async (id: string) => {

  try {
    
    const movimentacaoResponse = await Caixa.findByPk(id, {
      include: [
        {
          model: Lider,
          attributes: [],
          include: [ 
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome']
            }
          ]
        },
      ],
      raw: true
    });

    interface MovimentacaoFormatada {
      id_movimentacao: number;
      descricao: string;
      nome_lider: string;
      sobrenome_lider: string
      tipo: string;
      valor: number;
      data: Date;
      tipo_pag: string;
    }

    const movimentacao: any= movimentacaoResponse;
    
    const movimentacaoFormatada: MovimentacaoFormatada = {
      id_movimentacao: movimentacao.id_movimentacao,
      descricao: movimentacao.descricao,
      nome_lider: movimentacao['Lider.Pessoa.nome'],
      sobrenome_lider: movimentacao['Lider.Pessoa.sobrenome'],
      tipo: movimentacao.tipo,
      valor: movimentacao.valor,
      data: movimentacao.data,
      tipo_pag: movimentacao.tipo_pag
      
    };
    
    return movimentacaoFormatada;
    
  } catch (error: any) {
    throw error;
  }
}


export const editarMovimentacaoCaixa = async (id: string, descricao: string) => {

  try {
    const movimentacao = await Caixa.findByPk(id);
    if (movimentacao) { 
      movimentacao.descricao= descricao;    //pode editar apenas a descricao
      await movimentacao.save();

      return movimentacao.descricao;
    }
    else{
        throw new Error('Movimentação não encontrada');
    }
  } catch (error: any) {
    throw error;
  }
}