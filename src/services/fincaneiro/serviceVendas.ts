import { Aluno } from "../../models/Pessoa/Aluno";
import { Lider } from "../../models/Pessoa/Lider";
import { Pessoa } from "../../models/Pessoa/Pessoa";
import { Venda } from "../../models/Secretaria/Venda";
import { pegarMateriaisVenda } from "../secretaria/serviceSecretaria";
import { pagamentosFeitos } from "./servicePagamento";


export const alterarStatusVenda = async (id_venda: number, status: string) => {
    
  try {
    const venda = await Venda.findByPk(id_venda);
    if (venda) {
            
      venda.status_pag = status;
      
      await venda.save();
      return true;
    }
    else{
      throw new Error("Venda não encontrada");
    }
  } catch (error){
    throw error;
  }
}


const infosVenda = async (id_venda: string) => {

  try {
    const vendaResponse = await Venda.findByPk(id_venda, {
      include: [
        {
          model: Lider,
          attributes: [],
          include: [ 
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome'],
            }
          ]
        },
        {
          model: Aluno,
          attributes: [],
          include: [
            {
              model: Pessoa,
              attributes: ['nome', 'sobrenome'],
            }
          ]
        },
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
    
    return  vendaFormatada ;
  } catch (error){
    throw error;
  }
}


export const pegarInfosVenda = async (id_venda: string) => {

  try {
    const dados = {
      info: await infosVenda(id_venda),
      materiais: await pegarMateriaisVenda(id_venda),
      pagamentos: await pagamentosFeitos(id_venda),
    };
    
    return dados;
  } catch (error){
    throw error;
  }
}
