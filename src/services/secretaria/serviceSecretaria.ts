import { Material } from '../../models/Secretaria/Material';
import { Venda_Material_Ass } from '../../models/Secretaria/VendaMaterial';

export const pegarNomeMaterial = async (id: number) => {

  try {
    const materialResponse = await Material.findByPk(id, {});
    return materialResponse?.nome;
    
  } catch (error: any) {
    throw error;
  }
}



export const pegarMateriaisVenda = async (id_venda: string) => {

  const materiais = await Venda_Material_Ass.findAll({
    include: [
      {
        model: Material,
        attributes: ['nome']
      }
    ],
    where: {
      id_venda
    }
  });

  const materiaisFormatados = materiais.map((material: any) => {
    return {
      id_material: material.id_material,
      nome: material.Material.nome,
      quantidade: material.quantidade,
      valor_unit: material.valor_unit,
    };
  });
    
    return materiaisFormatados;
}