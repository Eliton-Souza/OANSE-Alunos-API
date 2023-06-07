import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Clube } from '../Clube';
import { Pessoa } from './Pessoa';


//LIDER
export interface LiderInstace extends Model{
    id_lider: number;
    id_pessoa: number;
    id_clube: number;
    login: string;
    senha: string;
}

export const Lider= sequelize.define<LiderInstace>('Lider', {
    id_lider: {
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
    id_clube: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clube,
            key: 'id_clube'
        }
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Lider',
    timestamps: false
});
Pessoa.hasOne(Lider, { foreignKey: 'id_pessoa' });
Lider.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });

Clube.hasMany(Lider, { foreignKey: 'id_clube' });
Lider.belongsTo(Clube, { foreignKey: 'id_clube' });
