import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import { Clube, Manual } from './Clube';

//PESSOA GENERICA
export interface PessoaInstace extends Model {
    id_pessoa: number;
    genero: string;
    nascimento: Date;
    nome: string;
}

export const Pessoa = sequelize.define<PessoaInstace>('Pessoa', {
    id_pessoa: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    genero: {
        type: DataTypes.STRING
    },
    nascimento: {
        type: DataTypes.DATE
    },
    nome: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Pessoa',
    timestamps: false
});

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
        type: DataTypes.STRING
    },
}, {
    tableName: 'Responsavel',
    timestamps: false
});
Pessoa.hasOne(Responsavel, { foreignKey: 'id_pessoa' });
Responsavel.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });



//ALUNO
export interface AlunoInstace extends Model{
    id_aluno: number;
    id_pessoa: number;
    id_clube: number;
    id_responsavel: number;
    id_manual: number;
}

export const Aluno= sequelize.define<AlunoInstace>('Aluno', {
    id_aluno: {
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
    id_responsavel:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Responsavel,
            key: 'id_responsavel'
        }
    },
    id_manual:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Manual,
            key: 'id_manual'
        }
    },
}, {
    tableName: 'Aluno',
    timestamps: false
});
Pessoa.hasOne(Aluno, { foreignKey: 'id_pessoa' });
Aluno.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });

Clube.hasMany(Aluno, { foreignKey: 'id_clube' });
Aluno.belongsTo(Clube, { foreignKey: 'id_clube' });

Responsavel.hasMany(Aluno, { foreignKey: 'id_responsavel' });
Aluno.belongsTo(Responsavel, { foreignKey: 'id_responsavel' });

Manual.hasMany(Aluno, { foreignKey: 'id_manual' });
Aluno.belongsTo(Manual, { foreignKey: 'id_manual' });



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
        type: DataTypes.STRING
    },
    senha: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Lider',
    timestamps: false
});
Pessoa.hasOne(Lider, { foreignKey: 'id_pessoa' });
Lider.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });

Clube.hasMany(Lider, { foreignKey: 'id_clube' });
Lider.belongsTo(Clube, { foreignKey: 'id_clube' });