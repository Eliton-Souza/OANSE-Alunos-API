import { Request, Response } from 'express';
import { Clube, Manual} from '../models/Clube';


export const clube = async (req: Request, res: Response) => {
    const clube = await Clube.findAll({
    });

    res.json({clube});
}

export const manuais = async (req: Request, res: Response) => {

    try {
      const manuais = await Manual.findAll({ 
        include: [
          {
            model: Clube,
            attributes: { 
                exclude: ['id_clube'] 
          },
        }]   
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
      console.error('Erro ao listar manuais:', error);
      res.status(500).json({ error: 'Erro ao listar manuais' });
    }
  };
  