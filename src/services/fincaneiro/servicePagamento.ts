import { sequelize } from "../../instances/mysql";
import { Pagamento } from "../../models/Secretaria/Pagamento";
import { format } from 'date-fns'
import { criarMovimentacaoCaixa } from "./serviceCaixa";
import { alterarSaldo } from "../Negociacao/serviceCarteira";
import { alterarStatusVenda, responsavelVenda } from "./serviceVendas";
import { Venda } from "../../models/Secretaria/Venda";
import { Lider } from "../../models/Pessoa/Lider";
import { Pessoa } from "../../models/Pessoa/Pessoa";

const criarPagamento = async (id_lider: number, id_venda: number, valor_pago: number, tipo: string, transaction: any ) => {
     
    try {
      const pagamento = await Pagamento.create({
        id_venda,
        valor_pago,
        id_lider,
        tipo,
        data: format(new Date, 'yyyy-MM-dd'),    
      },{ transaction });
  
      return pagamento.id_pagamento;
    } catch (error: any) {
        await transaction.rollback();
        throw error;
    }
  };

  //Soma todos os pagamentos e verifica se uma venda foi totalmente paga
  const verificarPagamentos = async (id_venda: number ) => {
     
    try {

        const venda= await Venda.findByPk(id_venda);

        if(venda){

          const pagamentos = await Pagamento.findAll({
              where: {
                id_venda
              }
          });

          const totalValorPago = pagamentos.reduce((total, pagamento) => {
              return total + pagamento.valor_pago;
          }, 0); //valor inicial 0 para soma

          if( totalValorPago >= venda.valor_total){
              await alterarStatusVenda(id_venda, 'Pago');
          }
        }

      return true;
    } catch (error: any) {
        throw error;
    }
  };



export const novoPagamento = async (id_lider: number, id_venda: number, valor_pago: number, tipo: string ) => {
    const transaction = await sequelize.transaction();  
  
    try {
        const id_carteira_caixa= '1';
        const nome= await responsavelVenda(id_venda);

        const pagamento = criarPagamento( id_lider, id_venda, valor_pago, tipo, transaction);
        const movimentacao = criarMovimentacaoCaixa(valor_pago, id_lider, 'entrada', tipo, '', `Pagamento do(a) - ${nome}`, transaction);
        const alteraSaldo= alterarSaldo(id_carteira_caixa, valor_pago, 'entrada', transaction);

        await Promise.all([pagamento, movimentacao, alteraSaldo]);
        await transaction.commit();

        await verificarPagamentos(id_venda);

        return pagamento;
    } catch (error: any) {
        await transaction.rollback();
        throw error;
    }
  };


//retorna pagagamentos feitos de uma venda
export const pagamentosFeitos = async (id_venda: string ) => {
  try {
    const pagamentos = await Pagamento.findAll({
      include: [
        {
          model: Lider,
          attributes: ['id_pessoa'],
          include: [
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome'] 
            }
          ]
        },
      ],
      where: {
        id_venda
      }
    });

    const pagamentosFormatados = pagamentos.map((pagamento: any) => {
      return {
        id_pagamento: pagamento.id_pagamento,
        nome_lider: pagamento.Lider.Pessoa.nome,
        sobrenome_lider: pagamento.Lider.Pessoa.sobrenome,
        data: pagamento.data,
        valor_pago: pagamento.valor_pago,
        tipo: pagamento.tipo
      };
    });
      
    return pagamentosFormatados;
  } catch (error: any) {
    throw error;
  }
};
