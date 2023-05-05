import { Router } from 'express';

import * as ApiController from '../controllers/pessoaController';

const router = Router();
/*
router.post('/register', ApiController.register);
router.post('/login', ApiController.login);


router.get('/list', ApiController.list);
*/
router.get('/', ApiController.ping);
router.get('/pessoas', ApiController.rotapessoa);
router.get('/consulta', ApiController.consulta);
router.get('/aluno', ApiController.criaAluno);
router.get('/lider', ApiController.criaLider);
router.get('/consultalider', ApiController.consultaLider);

export default router;