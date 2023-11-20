import { Transacao } from '../../models/Negociacao/Transacao';

export const criarTransacao = async (id_lider:number, tipo: string, valor: number, descricao: string, id_aluno: number, data: Date, novo_saldo: number, transaction: any) => {

    try {
        const transacao = await Transacao.create({
            id_lider,
            tipo,
            valor,
            descricao,
            id_aluno,
            data,
            novo_saldo,
        }, { transaction });
    
       return transacao.id_transacao; 
    } catch (error: any) {
        throw error;
    }
};
