import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Venda } from './Venda';
import { Material } from './Material';

//ASSOCIAÇÃO ENTRE VENDAS E MATERIAIS
export interface VendaMaterialInstace extends Model {
    id_venda_material: string;
    id_venda: number;
    id_material: number;
    quantidade: number;
    valor_unit: number;
}

export const Venda_Material_Ass = sequelize.define<VendaMaterialInstace>('Venda_Material_Ass', {
    id_venda_material: {
        primaryKey: true,
        autoIncrement: false,
        type: DataTypes.STRING
    },
    id_venda:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Venda,
            key: 'id_venda'
        }
    },
    id_material:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Material,
            key: 'id_material'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    valor_unit: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'Venda_Material_Ass',
    timestamps: false
});



Venda.belongsToMany(Material, {
    through: Venda_Material_Ass,
    foreignKey: 'id_venda',
    otherKey: 'id_material'
});

Material.belongsToMany(Venda, {
    through: Venda_Material_Ass,
    foreignKey: 'id_material',
    otherKey: 'id_venda'
});