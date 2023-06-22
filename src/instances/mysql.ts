import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize= new Sequelize(

    process.env.database as string,
    process.env.username as string,
    process.env.password as string,
    {
        host:  process.env.host as string,
        dialect: "mysql",
        dialectOptions: {
          ssl: {
            rejectUnauthorized: true,
          },
        },
        define: {
          timestamps: false,
        },
    }
)