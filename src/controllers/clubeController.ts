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
      });
     
      res.json({manuais: manuais});

    } catch (error) {
      console.error('Erro ao listar manuais:', error);
      res.status(500).json({ error: 'Erro ao listar manuais' });
    }
  };
  