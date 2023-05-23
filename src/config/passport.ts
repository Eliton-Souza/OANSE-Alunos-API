import passport from "passport";
import { BasicStrategy } from "passport-http";
import { Lider, LiderInstace } from "../models/Pessoa/Lider";
import { Request, Response, NextFunction } from "express";

const naoAutorizado= {
    status: 401,
    mensagem: 'Não autorizado'
};

passport.use(new BasicStrategy(async(login, senha, done)=>{

    if(login && senha){
        const lider= await Lider.findOne({
            where: {login, senha}
        });
        if(lider){
            return done(null, lider);
        }
    }
    return done(naoAutorizado, false);

}));

export const rotaPrivada= (req: Request, res: Response, next: NextFunction)=>{
    passport.authenticate('basic', (error: Error, lider: LiderInstace) => {
        return lider ? next() : next(naoAutorizado);
    })(req, res, next);
}


export default passport;