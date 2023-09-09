import { Request, Response } from 'express';
import { Carteira } from '../../models/Negociacao/Carteira';
import { criarTransacao } from '../../services/Negociacao/serviceTransacao';
import { alterarSaldo } from '../../services/Negociacao/serviceCarteira';
import { sequelize } from '../../instances/mysql';

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


export const novoSalvo = async (req: Request, res: Response) => {

  const id_carteira = req.params.id;
  const id_lider = req.user?.id_lider as number;

  const transaction = await sequelize.transaction(); 

  try {
    const { valor, tipo, id_aluno, descricao } = req.body;

    const novoSaldo= await alterarSaldo(id_carteira, valor, tipo, transaction);
    const transacao= criarTransacao(id_lider, tipo, valor, descricao, id_aluno, novoSaldo, transaction);

    await Promise.all([novoSaldo, transacao]);
    await transaction.commit();

    return res.json({ Saldo: novoSaldo });
       
   }catch (error: any) {
    await transaction.rollback();
    return res.json({error: error});
    }
};


/*
export const deletarCarteira = async (req: Request, res: Response) => {
    
    const id_carteira= req.params.id;

    await Carteira.destroy({where:{id_carteira}});
    res.json({});
};
*/