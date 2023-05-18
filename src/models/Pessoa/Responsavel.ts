import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Pessoa } from './Pessoa';

//RESPONSAVEL
export interface ResponsavelInstace extends Model{
    id_responsavel: number;
    id_pessoa: number;
    contato: string;
}

export const Responsavel= sequelize.define<ResponsavelInstace>('Responsavel', {
    id_responsavel: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_pessoa:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Pessoa,
            key: 'id_pessoa'
        }
    },
    contato: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
}, {
    tableName: 'Responsavel',
    timestamps: false
});
Pessoa.hasOne(Responsavel, { foreignKey: 'id_pessoa' });
Responsavel.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });
