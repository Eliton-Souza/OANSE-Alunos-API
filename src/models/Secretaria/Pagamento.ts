import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Lider } from '../Pessoa/Lider';
import { Venda } from './Venda';

//REGISTRO DOS PAGAMENTOS
export interface PagamentoInstace extends Model {
    id_pagamento: number;
    id_venda: number;
    id_lider: number;
    valor_pago: number;
    data: Date;
    tipo: string;

}

export const Pagamento = sequelize.define<PagamentoInstace>('Pagamento', {
    id_pagamento: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_venda:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Venda,
            key: 'id_venda'
        }
    },
    id_lider:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lider,
            key: 'id_lider'
        }
    },
    valor_pago: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    tableName: 'Pagamento',
    timestamps: false
});

Lider.hasMany(Pagamento, { foreignKey: 'id_lider' });
Pagamento.belongsTo(Lider, { foreignKey: 'id_lider' });

Venda.hasMany(Pagamento, { foreignKey: 'id_venda' });
Pagamento.belongsTo(Venda, { foreignKey: 'id_venda' });