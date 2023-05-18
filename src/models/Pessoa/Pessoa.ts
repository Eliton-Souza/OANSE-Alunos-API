import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../instances/mysql';

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
