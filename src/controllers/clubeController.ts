import { Request, Response } from 'express';
import { Clube, Manual} from '../models/Clube';


export const clube = async (req: Request, res: Response) => {
    const clube = await Clube.findAll({
    });

    return res.json({clube});
}

export const manuais = async (req: Request, res: Response) => {

  const id_clube = req.user?.id_clube;

  let whereClause = {}; // Cláusula where inicial vazia

  if (id_clube !== 8) {
    whereClause = { '$Manual.Clube.id_clube$': id_clube }; // Filtra os alunos pelo id_clube
  }

    try {
      const manuais = await Manual.findAll({ 
        include: [
          {
            model: Clube,
            attributes: { 
                exclude: ['id_clube'] 
          },
        }],
        where: whereClause, // Aplica a cláusula where dinamicamente   
      });
     
      const manuaisFormatados = manuais.map((manual: any) => {  
        return {
          id_manual: manual.id_manual,
          nome: manual.nome,
          clube: manual.Clube.nome,
        };
      });
        
      return res.json({ manuais: manuaisFormatados });

    } catch (error) {
      return res.json({ error: 'Erro ao listar manuais' });
    }
  };
  