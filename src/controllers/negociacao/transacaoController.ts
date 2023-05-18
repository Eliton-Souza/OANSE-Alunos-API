import { Request, Response } from 'express';
import { Transacao } from '../../models/Negociacao/Transacao';


export const listarTransacoes = async (req: Request, res: Response) => {

    const transacoes = await Transacao.findAll();
    res.json({transacoes});
}


export const pegarTransacao = async (req: Request, res: Response) => {

    let id= req.params.id;
    const transacao= await Transacao.findByPk(id);

    if(transacao){
        res.json({transacao});
    }
    else{
        res.json({error: 'Transacao não encontrada'});
    }
}


export const editarTransacao = async (req: Request, res: Response) => {

  const id_transacao = req.params.id;

  try {
    const { descricao } = req.body;

    // Recuperar transacao do banco
    const transacao = await Transacao.findByPk(id_transacao);
    if (transacao) { 
        transacao.descricao= descricao;                         //pode editar apenas a descricao
        await transacao.save();
        res.json({ Transacao: transacao});
    }
    else{
        return res.status(404).json({ error: 'Transacao não encontrada' });
    }
   }catch (error:any) {
    res.status(500).json({ error: 'Erro ao editar Transacao'});
  }
};


export const deletarTransacao = async (req: Request, res: Response) => {
    
    const id_transacao = req.params.id;

    await Transacao.destroy({where:{id_transacao}});
    res.json({});
};