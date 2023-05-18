import { Transacao } from '../../models/Negociacao/Transacao';
import { format } from 'date-fns'

export const criarTransacao = async (id_lider:number, tipo: string, valor: number, descricao: string, id_aluno: number) => {

    try {
        const transacao = await Transacao.create({
            id_lider,
            tipo,
            valor,
            descricao,
            id_aluno,
            data: format(new Date, 'yyyy-MM-dd'),
        });
    
        console.log('Transacao adicionada no Histórico');
    
       return transacao.id_transacao;
    } catch (error: any) {
    
        console.log('Ocorreu um erro ao adicionar transacap:', error);
        
        return(error);
    }
};
