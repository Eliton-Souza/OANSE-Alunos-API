import { Material } from '../../models/Secretaria/Material';

export const pegarNomeMaterial = async (id: number) => {

  try {
    const materialResponse = await Material.findByPk(id, {});
    return materialResponse?.nome;
    
  } catch (error: any) {
    throw error;
  }
}


