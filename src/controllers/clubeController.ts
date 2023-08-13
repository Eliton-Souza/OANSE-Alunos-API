import { Request, Response } from 'express';
import { Clube } from '../models/Clube';
import { Material } from '../models/Secretaria/Material';
import { Op } from 'sequelize';


export const clube = async (req: Request, res: Response) => {
    const clube = await Clube.findAll({
    });

    return res.json({clube});
}

export const manuais = async (req: Request, res: Response) => {
  const id_clube = req.user?.id_clube;

  let whereClause: any = {}; // Cláusula where inicial vazia

  if (id_clube !== 8) {
    whereClause['$Clube.id_clube$'] = id_clube; // Filtra os manuais pelo id_clube
  }

  whereClause['id_material'] = { [Op.between]: [1, 24] }; // Filtra os manuais de id 1 até 24

  try {
    const manuais = await Material.findAll({
      include: [
        {
          model: Clube
        }
      ],
      where: whereClause, // Aplica a cláusula where dinamicamente
    });

    const manuaisFormatados = manuais.map((manual: any) => {
      return {
        id_manual: manual.id_material,
        nome: manual.nome,
        clube: manual.Clube.nome,
      };
    });

    return res.json({ manuais: manuaisFormatados });

  } catch (error) {
    return res.json({ error: 'Erro ao listar manuais' });
  }
};
