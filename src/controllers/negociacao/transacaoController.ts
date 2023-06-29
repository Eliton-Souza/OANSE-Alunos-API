import { Request, Response } from 'express';
import { Transacao } from '../../models/Negociacao/Transacao';
import { Aluno } from '../../models/Pessoa/Aluno';
import { Pessoa } from '../../models/Pessoa/Pessoa';
import { Lider } from '../../models/Pessoa/Lider';


export const listarTransacoes = async (req: Request, res: Response) => {

    try {
        const transacoes = await Transacao.findAll({
            include: [
                {
                model: Aluno,
                attributes: [],
                include: [{
                    model: Pessoa,
                    attributes: ['nome'] 
                    }]
                },
                {
                model: Lider,
                attributes: [],
                include: [{
                        model: Pessoa,
                        attributes: ['nome'] 
                    }]
                },
            ],
            attributes: ['tipo','valor', 'id_transacao'],
            raw: true
        });

        const transacaoFormatada = transacoes.map((transacao: any) => {
            return {
            id_transacao: transacao.id_transacao,
            tipo: transacao.tipo,
            valor: transacao.valor,
            nome_lider: transacao['Lider.Pessoa.nome'],
            nome_aluno: transacao['Aluno.Pessoa.nome'],
            };
        });
        return res.json({ transacoes: transacaoFormatada });
      
    } catch (error) {
      return res.json({error: "Erro ao encontrar transacoes"});
    }
  };


export const pegarTransacao = async (req: Request, res: Response) => {

    let id= req.params.id;
    try {
        const transacaoResponse = await Transacao.findByPk(id, {
            include: [
                {
                model: Aluno,
                attributes: [],
                include: [{
                    model: Pessoa,
                    attributes: ['nome', 'sobrenome'] 
                    }]
                },
                {
                model: Lider,
                attributes: [],
                include: [{
                        model: Pessoa,
                        attributes: ['nome', 'sobrenome'] 
                    }]
                },
            ],
            attributes: ['tipo','valor', 'data', 'novo_saldo', 'id_transacao'],
            raw: true
        });
        interface transacaoFormatada {
            id_transacao: number,
            tipo: string,
            valor: number,
            descricao: string,
            data: Date,
            novo_saldo: number,

            nome_lider: string,
            sobrenome_lider: string,

            nome_aluno: string,
            sobrenome_aluno: string
        }
    
        const transacao: any= transacaoResponse;
  
      const transacaoFormatada: transacaoFormatada = {
        
        id_transacao: transacao.id_transacao,
        tipo: transacao.tipo,
        valor: transacao.valor,
        descricao: transacao.descricao,
        data: transacao.data,
        novo_saldo: transacao.novo_saldo,

        nome_lider: transacao['Lider.Pessoa.nome'],
        sobrenome_lider: transacao['Lider.Pessoa.sobrenome'],

        nome_aluno: transacao['Aluno.Pessoa.nome'],
        sobrenome_aluno: transacao['Aluno.Pessoa.sobrenome'],
    };
      
      return res.json({ transacao: transacaoFormatada });
    } catch (error){
      return res.json({ error: 'Transação não encontrado'});
    }
  };
  


export const editarTransacao = async (req: Request, res: Response) => {

  const id_transacao = req.params.id;

  try {
    const { descricao } = req.body;

    // Recuperar transacoes do banco
    const transacoes = await Transacao.findByPk(id_transacao);
    if (transacoes) { 
        transacoes.descricao= descricao;                         //pode editar apenas a descricao
        await transacoes.save();
        return res.json({ Transacao: transacoes});
    }
    else{
        return res.json({ error: 'Transacao não encontrada' });
    }
   }catch (error:any) {
    res.json({ error: 'Erro ao editar Transacao'});
  }
};


export const deletarTransacao = async (req: Request, res: Response) => {
    
    const id_transacao = req.params.id;

    await Transacao.destroy({where:{id_transacao}});
    return res.json({});
};