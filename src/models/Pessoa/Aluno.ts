import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Carteira } from '../Negociacao/Carteira';
import { Pessoa } from './Pessoa';
import { Responsavel } from './Responsavel';
import { Material } from '../Secretaria/Material';

//ALUNO
export interface AlunoInstace extends Model{
    id_aluno: number;
    id_pessoa: number;
    id_responsavel: number;
    id_manual: number;
    id_carteira: number;
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
            model: Material,
            key: 'id_material'
        }
    },
    id_carteira:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Carteira,
            key: 'id_carteira'
        }
    },
}, {
    tableName: 'Aluno',
    timestamps: false
});
Pessoa.hasOne(Aluno, { foreignKey: 'id_pessoa' });
Aluno.belongsTo(Pessoa, { foreignKey: 'id_pessoa',  onDelete: 'CASCADE' });

Responsavel.hasMany(Aluno, { foreignKey: 'id_responsavel' });
Aluno.belongsTo(Responsavel, { foreignKey: 'id_responsavel' });

Material.hasMany(Aluno, { foreignKey: 'id_manual' });
Aluno.belongsTo(Material, { foreignKey: 'id_manual' });

Carteira.hasOne(Aluno, { foreignKey: 'id_carteira' });
Aluno.belongsTo(Carteira, { foreignKey: 'id_carteira',  onDelete: 'CASCADE' });


/*
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
*/