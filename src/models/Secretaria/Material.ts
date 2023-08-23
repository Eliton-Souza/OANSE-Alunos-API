import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Clube } from '../Clube';

//ESTOQUE DE MATERIAIS
export interface MaterialInstace extends Model {
    id_material: number;
    nome: string;
    id_clube: number;
    quantidade: number;
    valor: number;
}

export const Material = sequelize.define<MaterialInstace>('Material', {
    id_material: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    id_clube:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Clube,
            key: 'id_clube'
        }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    valor: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'Material',
    timestamps: false
});

Clube.hasMany(Material, { foreignKey: 'id_clube' });
Material.belongsTo(Clube, { foreignKey: 'id_clube' });