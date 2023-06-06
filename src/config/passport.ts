import passport from "passport";
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import { Lider } from "../models/Pessoa/Lider";

dotenv.config();

export interface dadosUsuario{
    id_lider: number;
    nome: string;
    id_clube: number;
    exp: number;
};

const options= {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}


const jwtStrategy = new JWTStrategy(options, async (payload: dadosUsuario, done) => {
    const tokenExp = payload.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const lider= await Lider.findByPk(payload.id_lider);

    if (tokenExp < currentTimestamp && !lider) {
        // O token está expirado ou lider nao encontrado
        return done(null, false);
    }

        // Token válido, passe as informações do usuário decodificadas para a função done
        return done(null, payload);
    });

passport.use(jwtStrategy);

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('jwt', { session: false }, (error: Error, user: dadosUsuario) => {
    if (error || !user) {
        // O token é inválido ou expirou
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = user;

    next();
    })(req, res, next);
};

export const gerarToken= (dados: dadosUsuario) => {
    return jwt.sign(dados, process.env.JWT_SECRET as string);
}