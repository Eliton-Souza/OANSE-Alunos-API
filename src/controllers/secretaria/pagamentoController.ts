import { Request, Response } from 'express';
import { Venda } from '../../models/Secretaria/Venda';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Lider } from '../../models/Pessoa/Lider';
import { Pagamento } from '../../models/Secretaria/Pagamento';

import * as pagamentoService  from '../../services/fincaneiro/servicePagamento';

export const registrarPagamento = async (req: Request, res: Response) => {

  const id_lider = req.user?.id_lider as number;
  const id_clube = req.user?.id_clube as number;
  const { id_venda, valor_pago, data, tipo } = req.body;

  try {
    if(id_clube==8){
      
      const pagamento = await pagamentoService.novoPagamento(id_lider, id_venda, valor_pago, data, tipo);
    
    return res.json({ pagamento });
    }else{
      return res.json({ error: 'Sem autorização' });
    }
  } catch (error: any) {
    return res.json({ error: error });
  }
};


export const listarPagamentos = async (req: Request, res: Response) => {

  try {
    const pagamentos = await Pagamento.findAll({
      include: [
        {
          model: Venda,
          attributes: [],
          include: [ 
            {
              model: Aluno,
              attributes: [],
              include: [ 
                {
                  model: Pessoa,
                  attributes: ['nome', 'sobrenome']
                },
              ],
            },
          ]
        },
      ],
     
      attributes: {
        exclude: ['id_lider', 'tipo', 'id_pagador']
      },
      raw: true
    });

    const pagamentosFormatados = pagamentos.map((pagamento: any) => {
      return {
        id_pagamento: pagamento.id_pagamento,
        id_venda: pagamento.id_venda,
        nome_aluno: pagamento['Venda.Aluno.Pessoa.nome'],
        sobrenome_aluno: pagamento['Venda.Aluno.Pessoa.sobrenome'],
        valor_pago: pagamento.valor_pago,
        data: pagamento.data,
      };
    });
  
    return res.json({ pagamentos: pagamentosFormatados});
    
  } catch (error) {
    return res.json({error: "Erro ao encontrar pagamentos"})
  }
}



export const pegarPagamento = async (req: Request, res: Response) => {

  try {
    const id = req.params.id;

    const pagamentoResponse = await Pagamento.findByPk(id, {
      include: [
        {
          model: Venda,
          attributes: [],
          include: [ 
            {
              model: Aluno,
              attributes: [],
              include: [ 
                {
                  model: Pessoa,
                  attributes: ['nome', 'sobrenome']
                },
              ],
            },
          ]
        },
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
      attributes: ['id_pagamento', 'tipo'],
      raw: true
    });

    interface VendaFormatada {
      id_pagamento: number;
      id_venda: number;
      nome_lider: string;
      sobrenome_lider: string
      nome_aluno: string;
      sobrenome_aluno: string;
      tipo: string;
    }

    const pagamento: any= pagamentoResponse;
    
    const pagamentoFormatado: VendaFormatada = {
      id_pagamento: pagamento.id_pagamento,
      id_venda: pagamento.id_venda,
      nome_lider: pagamento['Lider.Pessoa.nome'],
      sobrenome_lider: pagamento['Lider.Pessoa.sobrenome'],
      nome_aluno: pagamento['Venda.Aluno.Pessoa.nome'],
      sobrenome_aluno: pagamento['Venda.Aluno.Pessoa.sobrenome'],
      tipo: pagamento.tipo,
    };
    
    return res.json({ pagamento: pagamentoFormatado });
  } catch (error) {
    return res.json({ error});
  }
}