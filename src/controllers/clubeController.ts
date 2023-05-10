import { Request, Response } from 'express';
import { Clube, Manual} from '../models/Clube';


export const clube = async (req: Request, res: Response) => {
    const clube = await Clube.findAll({
    });

    res.json({clube});
}

export const manual = async (req: Request, res: Response) => {
    const manual = await Manual.findAll({
    });

    res.json({manual});
}