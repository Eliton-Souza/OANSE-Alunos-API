import { Router } from 'express';
import * as PessoaController from '../controllers/pessoaController';
import * as ClubeController from '../controllers/clubeController';
import { updateValidaAluno, validaAluno } from '../middlewares/validaPessoa';

const router = Router();


//router.get('/', PessoaController.
/*
router.get('/pessoas', PessoaController.rotapessoa);
router.get('/consulta', PessoaController.consulta);
router.get('/aluno', PessoaController.criaAluno);
router.get('/lider', PessoaController.criaLider);
router.get('/consultalider', PessoaController.consultaLider);


router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);
*/



router.post('/criarAluno', validaAluno, PessoaController.criarAluno);
router.get('/alunos', PessoaController.listarAlunos);
router.get('/aluno/:id', PessoaController.pegarAluno);
router.put('/atualizarAluno/:id', updateValidaAluno, PessoaController.atualizarAluno);
router.delete('/deletarAluno/:id', PessoaController.deletarAluno);


router.post('/criarResponsavel', PessoaController.criarResponsavel);
router.post('/criarLider', PessoaController.criarLider);


router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);
export default router;