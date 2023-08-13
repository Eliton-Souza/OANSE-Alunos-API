import { Request, Response } from 'express';
import { criarTransacao } from '../../services/Negociacao/serviceTransacao';
import { Material } from '../../models/Secretaria/Material';
import { Clube } from '../../models/Clube';


export const criarMaterial = async (req: Request, res: Response) => {
   
    const { nome, id_clube } = req.body;

    try {        
        const material = await Material.create({
            nome,
            id_clube,
            quantidade: 0
        });
      
        return res.json({ Material: material.id_material });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          const str = error.errors[0].value;
          const novaStr = str.replace(/-/g, ' ');
        
          return res.json({error:  novaStr + ' já está cadastrado(a) no sistema'});
        } else {
            return res.json({error: error});
        }
    }
};


export const listarMateriais = async (req: Request, res: Response) => {

    const materiais = await Material.findAll({
      include: [
        {
          model: Clube,
          attributes: ['nome']
        }
      ],
    });

    const materiaisFormatados = materiais.map((material: any) => {
        return {
          id_material: material.id_material,
          nome: material.nome,
          quantidade: material.quantidade,
          clube: material.Clube.nome
        };
      });
    
      return res.json({ materiais: materiaisFormatados});
}


export const pegarMaterial = async (req: Request, res: Response) => {

    let id= req.params.id;
    const material= await Material.findByPk(id);

    if(material){
        return res.json({material});
    }
    else{
        return res.json({error: 'Material não encontrada'});
    }
}

/*
export const atualizarMaterial = async (req: Request, res: Response) => {

  const id_material = req.params.id;
  const id_lider = req.user?.id_lider as number;

  try {
    const { nome, id_clube, quantidade } = req.body;

    // Recuperar dados do material do banco
    const material = await Material.findByPk(id_material);
    if (material) {
            
        material.nome= nome?? material.nome;
        material

        await material.save();
        await criarTransacao(id_lider, tipo, valor, descricao, id_aluno, material.saldo);

        return res.json({ Material: material });
    }
    else{
        return res.json({ error: 'Material não encontrada' });
    }
   }catch (error:any) {
    return res.json({ error: 'Erro ao alterar o saldo'});
  }
};*/



export const deletarMaterial = async (req: Request, res: Response) => {
    
    const id_material= req.params.id;

    await Material.destroy({where:{id_material}});
    return res.json({});
};