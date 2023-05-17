import { Router } from 'express';
import * as LiderController from '../controllers/atores/liderController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import * as CarteiraController from '../controllers/negociacao/carteiraController';
import * as valida from '../middlewares/validaPessoa';

const router = Router();

//CRUD ALUNO
router.post('/criarAluno', valida.aluno, AlunoController.criarAluno);
router.get('/alunos', AlunoController.listarAlunos);
router.get('/aluno/:id', AlunoController.pegarAluno);
router.put('/atualizarAluno/:id', valida.updateAluno, AlunoController.atualizarAluno);
router.delete('/deletarAluno/:id', AlunoController.deletarAluno);

//CRUD RESPONSAVEL
router.post('/criarResponsavel', valida.responsavel, ResponsavelController.criarResponsavel);
router.get('/listarResponsaveis', ResponsavelController.listarResponsaveis);
router.get('/pegarResponsavel/:id', ResponsavelController.pegarResponsavel);
router.put('/atualizarResponsavel/:id', valida.updateResponsavel, ResponsavelController.atualizarResponsavel);
router.delete('/deletarResponsavel/:id', ResponsavelController.deletarResponsavel);

//CRUD LIDER
router.post('/criarLider', valida.lider, LiderController.criarLider);
router.get('/listarLideres', LiderController.listarLideres);
router.get('/pegarLider/:id', LiderController.pegarLider);
router.put('/atualizarLider/:id', valida.updateLider, LiderController.atualizarLider);
router.delete('/deletarLider/:id', LiderController.deletarLider);

//CRUD Carteira
router.get('/listarCarteiras', CarteiraController.listarCarteiras);
router.get('/pegarCarteira/:id', CarteiraController.pegarCarteira);
router.put('/atualizarSaldo/:id', CarteiraController.atualizarSaldo);
//router.post('/criarCarteira', CarteiraController.criarCarteira);              //carteira so pode ser criada quando aluno for criado para garantir que cada carteira tem aluno
//router.delete('/deletarCarteira/:id', CarteiraController.deletarCarteira);    //carteira so pode ser deletada quando aluno é deletado


router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);

export default router;