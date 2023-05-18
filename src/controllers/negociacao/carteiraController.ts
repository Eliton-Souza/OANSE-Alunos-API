import { Request, Response } from 'express';
import { Carteira } from '../../models/Negociacao/Carteira';
import { format } from 'date-fns'

export const criarCarteira = async () => {

    try {
        const carteira = await Carteira.create({
           saldo: 0,
           data_criacao: format(new Date, 'yyyy-MM-dd'),
        });
    
        console.log('Carteira criada com sucesso na data' + carteira.data_criacao);
    
       return carteira.id_carteira;
    } catch (error: any) {
    
        console.log('Ocorreu um erro ao criar a carteira:', error);
        
        return(error);
    }
};



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


export const atualizarSaldo = async (req: Request, res: Response) => {

  const id_carteira = req.params.id;

  try {
    const { valor, tipo } = req.body;

    // Recuperar dados da carteira do banco
    const carteira = await Carteira.findByPk(id_carteira);
    if (carteira) {

        if (tipo === 'adicionar') {
            carteira.saldo+= parseFloat(valor);
            await carteira.save();
            res.json({ Carteira: carteira});
        } else if (tipo === 'retirar' && carteira.saldo>= valor) {
            carteira.saldo-= parseFloat(valor);
            await carteira.save();
            res.json({ Carteira: carteira});
        }else{
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



export const deletarCarteira = async (req: Request, res: Response) => {
    
    const id_carteira= req.params.id;

    await Carteira.destroy({where:{id_carteira}});
    res.json({});
};