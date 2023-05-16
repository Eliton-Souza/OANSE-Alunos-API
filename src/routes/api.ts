import { Router } from 'express';
import * as PessoaController from '../controllers/atores/pessoaController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import { updateValidaAluno, validaAluno } from '../middlewares/validaPessoa';

const router = Router();

//CRUD ALUNO
router.post('/criarAluno', validaAluno, AlunoController.criarAluno);
router.get('/alunos', AlunoController.listarAlunos);
router.get('/aluno/:id', AlunoController.pegarAluno);
router.put('/atualizarAluno/:id', updateValidaAluno, AlunoController.atualizarAluno);
router.delete('/deletarAluno/:id', AlunoController.deletarAluno);


router.post('/criarResponsavel', ResponsavelController.criarResponsavel);


//router.post('/criarLider', ResponsavelController.criarLider);


router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);

export default router;