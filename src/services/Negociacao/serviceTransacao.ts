import { Transacao } from '../../models/Negociacao/Transacao';
import { format } from 'date-fns'

export const criarTransacao = async (id_lider:number, tipo: string, valor: number, descricao: string, id_aluno: number, novo_saldo: number, transaction: any) => {

    try {
        const transacao = await Transacao.create({
            id_lider,
            tipo,
            valor,
            descricao,
            id_aluno,
            data: format(new Date, 'yyyy-MM-dd'),
            novo_saldo,
        }, { transaction });
    
       return transacao.id_transacao; 
    } catch (error: any) {
        throw error;
    }
};
