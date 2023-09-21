import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Lider } from '../Pessoa/Lider';
import { Pessoa } from '../Pessoa/Pessoa';

//REGISTRO DAS VENDAS
export interface VendaInstace extends Model {
    id_venda: number;
    id_aluno: number;
    id_lider: number;
    valor_total: number;
    descricao: string;
    data: Date;
    status_pag: string
}

export const Venda = sequelize.define<VendaInstace>('Venda', {
    id_venda: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_pessoa:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pessoa,
            key: 'id_pessoa'
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
    valor_total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING(200),
    },
    data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status_pag: {
        type: DataTypes.STRING(20),
    },
}, {
    tableName: 'Venda',
    timestamps: false
});

Lider.hasMany(Venda, { foreignKey: 'id_lider' });
Venda.belongsTo(Lider, { foreignKey: 'id_lider' });

Pessoa.hasMany(Venda, { foreignKey: 'id_pessoa' });
Venda.belongsTo(Pessoa, { foreignKey: 'id_pessoa' });