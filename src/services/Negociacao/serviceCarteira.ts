import { Carteira } from '../../models/Negociacao/Carteira';
import { format } from 'date-fns'

export const criarCarteira = async (transaction: any) => {

    const carteira = await Carteira.create({
        saldo: 0,
        data_criacao: format(new Date, 'yyyy-MM-dd'),
    },{ transaction });

    return carteira.id_carteira;
};


export const alterarSaldo = async (id_carteira: number, valor: number, tipo: string, transaction: any) => {
    
    try {
    
        // Recuperar dados da carteira do banco
        const carteira = await Carteira.findByPk(id_carteira);
        if (carteira) {
                
            if (tipo === 'entrada') {
                carteira.saldo += parseFloat(valor.toString());
            } else if (carteira.saldo >= parseFloat(valor.toString())) {
                carteira.saldo -= parseFloat(valor.toString());
            }else {
                throw new Error("Saldo insuficiente");
            }
    
            await carteira.save({ transaction });
            return carteira.saldo;
        }else{
            throw new Error("Carteira não encontrada");
        }
        
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};