import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import {Lider, Aluno} from './Pessoa';

//CLUBE
export interface ClubeInstace extends Model {
    id_pessoa: number;
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




//SECOES
export interface SecoesInstace extends Model{
    id_secao: number;
    id_aluno: number;
    data: Date;
    id_lider: number;
    num_secao: number;
    id_capitulo: number;
}

export const Historico_de_secao= sequelize.define<SecoesInstace>('Historico_de_secao', {
    id_secao: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_aluno:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Aluno,
            key: 'id_aluno'
        }
    },
    data: {
        type: DataTypes.DATE
    },
    id_lider:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lider,
            key: 'id_lider'
        }
    },
    num_secao: {
        type: DataTypes.INTEGER
    },
    id_capitulo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Capitulo,
            key: 'id_capitulo'
        }
    },
}, {
    tableName: 'Historico_de_secao',
    timestamps: false
});
Aluno.hasMany(Historico_de_secao, { foreignKey: 'id_aluno' });
Historico_de_secao.belongsTo(Aluno, { foreignKey: 'id_aluno' });

Lider.hasMany(Historico_de_secao, { foreignKey: 'id_lider' });
Historico_de_secao.belongsTo(Lider, { foreignKey: 'id_lider' });

Capitulo.hasMany(Historico_de_secao, { foreignKey: 'id_capitulo' });
Historico_de_secao.belongsTo(Capitulo, { foreignKey: 'id_capitulo' });
