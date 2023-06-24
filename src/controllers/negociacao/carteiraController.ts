import { Request, Response } from 'express';
import { Carteira } from '../../models/Negociacao/Carteira';
import { criarTransacao } from '../../services/Negociacao/serviceTransacao';

export const listarCarteiras = async (req: Request, res: Response) => {

    const carteiras = await Carteira.findAll();
    res.json({carteiras});
}


export const pegarCarteira = async (req: Request, res: Response) => {

    let id= req.params.id;
    const carteira= await Carteira.findByPk(id);

    if(carteira){
        res.json({carteira});
    }
    else{
        res.json({error: 'Carteria não encontrada'});
    }
}


export const alterarSaldo = async (req: Request, res: Response) => {

  const id_carteira = req.params.id;
  const id_lider = req.user?.id_lider as number;

  try {
    const { valor, tipo, id_aluno, descricao } = req.body;

    // Recuperar dados da carteira do banco
    const carteira = await Carteira.findByPk(id_carteira);
    if (carteira) {
            
        if (tipo === 'entrada') {
            carteira.saldo += parseFloat(valor);
        } else if (carteira.saldo >= valor){
            carteira.saldo -= parseFloat(valor);
        }
        else {
            return res.json({error: "Saldo insuficiente"});
        }

        await carteira.save();
        await criarTransacao(id_lider, tipo, valor, descricao, id_aluno, carteira.saldo);

        return res.json({ Carteira: carteira });
    }
    else{
        return res.json({ error: 'Carteira não encontrada' });
    }
   }catch (error:any) {
    return res.json({ error: 'Erro ao alterar o saldo'});
  }
};


/*
export const deletarCarteira = async (req: Request, res: Response) => {
    
    const id_carteira= req.params.id;

    await Carteira.destroy({where:{id_carteira}});
    res.json({});
};
*/