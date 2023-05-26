import { Carteira } from '../../models/Negociacao/Carteira';
import { format } from 'date-fns'

export const criarCarteira = async (transaction: any) => {

    const carteira = await Carteira.create({
        saldo: 0,
        data_criacao: format(new Date, 'yyyy-MM-dd'),
    },{ transaction });

    return carteira.id_carteira;
};
