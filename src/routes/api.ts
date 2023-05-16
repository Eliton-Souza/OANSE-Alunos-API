import { Router } from 'express';
import * as LiderController from '../controllers/atores/liderController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import { updateValidaAluno, updateValidaLider, updateValidaResponsavel, validaAluno, validaLider, validaResponsavel } from '../middlewares/validaPessoa';

const router = Router();

//CRUD ALUNO
router.post('/criarAluno', validaAluno, AlunoController.criarAluno);
router.get('/alunos', AlunoController.listarAlunos);
router.get('/aluno/:id', AlunoController.pegarAluno);
router.put('/atualizarAluno/:id', updateValidaAluno, AlunoController.atualizarAluno);
router.delete('/deletarAluno/:id', AlunoController.deletarAluno);

//CRUD RESPONSAVEL
router.post('/criarResponsavel', validaResponsavel, ResponsavelController.criarResponsavel);
router.get('/listarResponsaveis', ResponsavelController.listarResponsaveis);
router.get('/pegarResponsavel/:id', ResponsavelController.pegarResponsavel);
router.put('/atualizarResponsavel/:id', updateValidaResponsavel, ResponsavelController.atualizarResponsavel);
router.delete('/deletarResponsavel/:id', ResponsavelController.deletarResponsavel);

//CRUD LIDER
router.post('/criarLider', validaLider, LiderController.criarLider);
router.get('/listarLideres', LiderController.listarLideres);
router.get('/pegarLider/:id', LiderController.pegarLider);
router.put('/atualizarLider/:id',updateValidaLider, LiderController.atualizarLider);
router.delete('/deletarLider/:id', LiderController.deletarLider);


//router.post('/criarLider', ResponsavelController.criarLider);


router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);

export default router;