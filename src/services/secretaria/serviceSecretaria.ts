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


export const retirarEstoque = async (id_material: string, quantidade: number) => {

  try {
    const material = await Material.findByPk(id_material);
    if (material) {
      material.quantidade -= parseInt(quantidade.toString());
      await material.save();
      
      return material;
    }else{
        throw new Error("Material não encontrado");
    }
    
  }catch (error) {
    throw error;
  }
}