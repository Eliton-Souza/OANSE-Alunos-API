import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
//import {Lider, Aluno} from './Pessoa';

//CLUBE
export interface ClubeInstace extends Model {
    id_clube: number;
    nome: string;
}

export const Clube = sequelize.define<ClubeInstace>('Clube', {
    id_clube: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Clube',
    timestamps: false
});


//MANUAL
export interface ManualInstace extends Model{
    id_manual: number;
    nome: string;
    id_clube: number;
}

export const Manual= sequelize.define<ManualInstace>('Manual', {
    id_manual: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING
    },
    id_clube:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clube,
            key: 'id_clube'
        }
    },
}, {
    tableName: 'Manual',
    timestamps: false
});
Clube.hasMany(Manual, { foreignKey: 'id_clube' });
Manual.belongsTo(Clube, { foreignKey: 'id_clube' });




//CAPITULO
export interface CapituloInstace extends Model{
    id_capitulo: number;
    nome: string;
    id_manual: number;
    qtd_secao: number;
}

export const Capitulo= sequelize.define<CapituloInstace>('Capitulo', {
    id_capitulo: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING
    },
    id_manual:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Manual,
            key: 'id_manual'
        }
    },
    qtd_secao: {
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'Capitulo',
    timestamps: false
});
Manual.hasMany(Capitulo, { foreignKey: 'id_manual' });
Capitulo.belongsTo(Manual, { foreignKey: 'id_manual' });


