import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import {Lider} from '../Pessoa/Lider';

//CAIXA -- HISTORICO DE ENTRADAS E SAIDAS NO CAIXA
export interface CaixaInstace extends Model{
    id_movimentacao: number;
    id_lider: number;
    tipo: string;
    valor: number;
    descricao: string;
    data: Date;
    tipo_pag: string;
}

export const Caixa= sequelize.define<CaixaInstace>('Caixa', {
    id_movimentacao: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_lider:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lider,
            key: 'id_lider'
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(200),
        allowNull: true
    },      
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo_pag: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Caixa',
    timestamps: false
});
Lider.hasMany(Caixa, { foreignKey: 'id_lider' });
Caixa.belongsTo(Lider, { foreignKey: 'id_lider' });