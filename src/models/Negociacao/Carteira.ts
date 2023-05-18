import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';

//CARTEIRA
export interface CarteiraInstace extends Model {
    id_carteira: number;
    saldo: number;
    data_criacao: Date;
}

export const Carteira = sequelize.define<CarteiraInstace>('Carteira', {
    id_carteira: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    saldo: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    data_criacao: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'Carteira',
    timestamps: false
});