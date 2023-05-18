import { Carteira } from '../../models/Negociacao/Carteira';
import { format } from 'date-fns'

export const criarCarteira = async () => {

    try {
        const carteira = await Carteira.create({
           saldo: 0,
           data_criacao: format(new Date, 'yyyy-MM-dd'),
        });
    
        console.log('Carteira criada com sucesso');
    
       return carteira.id_carteira;
    } catch (error: any) {
    
        console.log('Ocorreu um erro ao criar a carteira:', error);
        
        return(error);
    }
};
