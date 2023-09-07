import { Venda } from "../../models/Secretaria/Venda";

export const alterarStatusPagamento = async (id_venda: number, status: string) => {
    
  try {
    const venda = await Venda.findByPk(id_venda);
    if (venda) {
            
      venda.status_pag = status;
      
      await venda.save();
      return true;
    }
    else{
      throw new Error("Venda não encontrada");
    }
  } catch (error){
    throw error;
  }
}