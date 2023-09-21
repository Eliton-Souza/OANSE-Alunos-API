import { Request, Response } from 'express';
import { sequelize } from '../../instances/mysql';
import { criarMovimentacaoCaixa, editarMovimentacaoCaixa, listarMovimentacoesCaixa, pegarMovimentacaoCaixa } from '../../services/fincaneiro/serviceCaixa';
import { alterarSaldo } from '../../services/Negociacao/serviceCarteira';

export const criarMovimentacao = async (req: Request, res: Response) => {
  
  const transaction = await sequelize.transaction();
  const id_lider = req.user?.id_lider as number;

  const { tipo, valor, descricao, tipo_pag, motivo } = req.body;

  try {
    const movimentacao = await criarMovimentacaoCaixa(valor, id_lider, tipo, tipo_pag, descricao, motivo, transaction);
    const alteraSaldo = await alterarSaldo('1', valor, tipo, transaction);
    
    await transaction.commit();

    return res.json({ Movimentacao: movimentacao.id_movimentacao, Saldo: alteraSaldo });
  }catch (error: any) {
    await transaction.rollback();
    return res.json({ error: error });
  }
};



export const listarMovimentacoes = async (req: Request, res: Response) => {

  const id_clube = req.user?.id_clube as number;

  try {
    if(id_clube==8){
      
      const movimentacoes = await listarMovimentacoesCaixa();
    
      return res.json({ movimentacoes });
    }else{
      return res.json({ error: 'Sem autorização' });
    }
  } catch (error: any) {
    return res.json({ error: error });
  }
}


export const pegarMovimentacao = async (req: Request, res: Response) => {

  const id = req.params.id;
  const id_clube = req.user?.id_clube as number;

  try {
    if(id_clube==8){
      
      const movimentacao = await pegarMovimentacaoCaixa(id);
    
      return res.json({ movimentacao });
    }else{
      return res.json({ error: 'Sem autorização' });
    }
  } catch (error: any) {
    return res.json({ error: error });
  }
}


export const editarMovimentacao = async (req: Request, res: Response) => {

  const id = req.params.id;
  const id_clube = req.user?.id_clube as number;

  const { descricao } = req.body;

  try {
    if(id_clube==8){
      
      const movimentacao = await editarMovimentacaoCaixa(id, descricao);
    
      return res.json({ movimentacao });
    }else{
      return res.json({ error: 'Sem autorização' });
    }
  } catch (error: any) {
    return res.json({ error: error });
  }
};
