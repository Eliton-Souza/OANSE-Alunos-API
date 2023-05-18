import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import {Lider} from '../Pessoa/Lider';
import { Aluno } from '../Pessoa/Aluno';

//TRANSACAO -- HISTORICO DE VENDAS NA FEIRINHA E ADICAO DE SALDO A CARTEIRA DO ALUNO
export interface TransacaoInstace extends Model{
    id_transacao: number;
    id_lider: number;
    tipo: string;
    valor: number;
    descricao: string;
    id_aluno: number;
    data: Date;
}

export const Transacao= sequelize.define<TransacaoInstace>('Transacao', {
    id_transacao: {
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
    decricao: {
        type: DataTypes.STRING
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
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'Transacao',
    timestamps: false
});
Lider.hasMany(Transacao, { foreignKey: 'id_lider' });
Transacao.belongsTo(Lider, { foreignKey: 'id_lider' });

Aluno.hasMany(Transacao, { foreignKey: 'id_aluno' });
Transacao.belongsTo(Aluno, { foreignKey: 'id_aluno' });
