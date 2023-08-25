import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';
import { Aluno } from '../Pessoa/Aluno';
import { Lider } from '../Pessoa/Lider';

//REGISTRO DAS VENDAS
export interface VendaInstace extends Model {
    id_venda: number;
    id_aluno: number;
    id_lider: number;
    valor_total: number;
    descricao: string;
    data: Date;
}

export const Venda = sequelize.define<VendaInstace>('Venda', {
    id_venda: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    id_aluno:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Aluno,
            key: 'id_aluno'
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
}, {
    tableName: 'Venda',
    timestamps: false
});

Lider.hasMany(Venda, { foreignKey: 'id_lider' });
Venda.belongsTo(Lider, { foreignKey: 'id_lider' });

Aluno.hasMany(Venda, { foreignKey: 'id_aluno' });
Venda.belongsTo(Aluno, { foreignKey: 'id_aluno' });