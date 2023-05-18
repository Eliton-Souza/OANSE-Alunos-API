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

  try {
    const { valor, tipo, id_lider, descricao, id_aluno } = req.body;

    // Recuperar dados da carteira do banco
    const carteira = await Carteira.findByPk(id_carteira);
    if (carteira) {

        if (tipo === 'entrada' || (tipo === 'saida' && carteira.saldo >= valor)) {
            
            if (tipo === 'entrada') {
                carteira.saldo += parseFloat(valor);
            } else {
                carteira.saldo -= parseFloat(valor);
            }

            await carteira.save();
            await criarTransacao(id_lider, tipo, valor, descricao, id_aluno);
            res.json({ Carteira: carteira });

        } else {
            res.json("Saldo insuficiente");
        }
        
    }
    else{
        return res.status(404).json({ error: 'Carteira não encontrada' });
    }
   }catch (error:any) {
    res.status(500).json({ error: 'Erro ao atualizar a carteira'});
  }
};


/*
export const deletarCarteira = async (req: Request, res: Response) => {
    
    const id_carteira= req.params.id;

    await Carteira.destroy({where:{id_carteira}});
    res.json({});
};
*/