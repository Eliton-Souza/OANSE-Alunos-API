import { Request, Response } from 'express';
import { Venda } from '../../models/Secretaria/Venda';
import { Venda_Material_Ass } from '../../models/Secretaria/VendaMaterial';
import { format } from 'date-fns';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Lider } from '../../models/Pessoa/Lider';
import { Pagamento } from '../../models/Secretaria/Pagamento';

export const registrarPagamento = async (req: Request, res: Response) => {

  const id_lider = req.user?.id_lider;
  const { id_pagador, id_venda, valor_pago, tipo } = req.body;

  try {
    const pagamento = await Pagamento.create({
      id_pagador,
      id_venda,
      valor_pago,
      id_lider,
      tipo,
      data: format(new Date, 'yyyy-MM-dd')      
    });

    /*
    adicionar valor pago no caixa
    verificar se a conta foi totalmente paga e alterar estado da venda(pendente ou pago)
    */

    return res.json({ Pagamento: pagamento.id_pagamento });
  } catch (error: any) {
    return res.json({ error: error });
  }
};


export const listarPagamentos = async (req: Request, res: Response) => {

  try {
    const pagamentos = await Pagamento.findAll({
      include: [
        {             
          model: Pessoa,
          attributes: {
            exclude: ['nascimento', 'genero', 'id_pessoa']
          }, 
        },
      ],
     
      attributes: {
        exclude: ['id_venda', 'id_lider', 'tipo', 'id_pagador']
      },
      raw: true
    });

    const pagamentosFormatados = pagamentos.map((pagamento: any) => {
      return {
        id_pagamento: pagamento.id_pagamento,
        nome_pagador: pagamento['Pessoa.nome'],
        sobrenome_pagador: pagamento['Pessoa.sobrenome'],
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
      nome_lider: string;
      sobrenome_lider: string
      nome_aluno: string;
      sobrenome_aluno: string;
      tipo: string;
    }

    const pagamento: any= pagamentoResponse;
    
    const pagamentoFormatado: VendaFormatada = {
      id_pagamento: pagamento.id_pagamento,
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