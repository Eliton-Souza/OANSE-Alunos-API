import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import {Lider} from '../Pessoa/Lider';

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


//TRANSACAO -- HISTORICO DE VENDAS NA FEIRINHA E ADICAO DE SALDO A CARTEIRA DO ALUNO
export interface TransacaoInstace extends Model{
    id_transacao: number;
    id_lider: number;
    tipo: string;
    valor: number;
    descricao: string;
    id_carteira: number;
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
        type: DataTypes.STRING
    },
    valor: {
        type: DataTypes.FLOAT
    },
    decricao: {
        type: DataTypes.STRING
    },
    id_carteira:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Carteira,
            key: 'id_carteira'
        }
    },
}, {
    tableName: 'Transacao',
    timestamps: false
});
Lider.hasMany(Transacao, { foreignKey: 'id_lider' });
Transacao.belongsTo(Lider, { foreignKey: 'id_lider' });

Carteira.hasMany(Transacao, { foreignKey: 'id_carteira' });
Transacao.belongsTo(Carteira, { foreignKey: 'id_carteira' });
