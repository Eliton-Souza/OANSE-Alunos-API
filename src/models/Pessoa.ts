import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import { Capitulo, Clube, Manual } from './Clube';

//PESSOA GENERICA
export interface PessoaInstace extends Model {
    id_pessoa: number;
    genero: string;
    nascimento: Date;
    nome: string;
    sobrenome: string;
}

export const Pessoa = sequelize.define<PessoaInstace>('Pessoa', {
    id_pessoa: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    genero: {
        type: DataTypes.ENUM('M', 'F'),
        allowNull: false
    },
    nascimento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sobrenome: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    indexes: [{
      unique: true,
      fields: ['nome', 'sobrenome']
    }],
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



//ALUNO
export interface AlunoInstace extends Model{
    id_aluno: number;
    id_pessoa: number;
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
    id_responsavel:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Responsavel,
            key: 'id_responsavel'
        }
    },
    id_manual:{
        type: DataTypes.INTEGER,
        allowNull: true,
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
        type: DataTypes.STRING,
        allowNull: false
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



//SECOES DOS ALUNOS
export interface SecoesInstace extends Model{
    id_secao: number;
    id_aluno: number;
    data: Date;
    id_lider: number;
    num_secao: number;
    id_capitulo: number;
}

export const HistoricoSecao= sequelize.define<SecoesInstace>('HistoricoSecao', {
    id_secao: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_aluno:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Aluno,
            key: 'id_aluno'
        }
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_lider:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Lider,
            key: 'id_lider'
        }
    },
    num_secao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_capitulo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: Capitulo,
            key: 'id_capitulo'
        }
    },
}, {
    tableName: 'HistoricoSecao',
    timestamps: false
});
  


Aluno.hasMany(HistoricoSecao, { foreignKey: 'id_aluno' });
HistoricoSecao.belongsTo(Aluno, { foreignKey: 'id_aluno' });

Lider.hasMany(HistoricoSecao, { foreignKey: 'id_lider' });
HistoricoSecao.belongsTo(Lider, { foreignKey: 'id_lider' });

Capitulo.hasMany(HistoricoSecao, { foreignKey: 'id_capitulo' });
HistoricoSecao.belongsTo(Capitulo, { foreignKey: 'id_capitulo' });
