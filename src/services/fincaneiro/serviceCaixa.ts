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