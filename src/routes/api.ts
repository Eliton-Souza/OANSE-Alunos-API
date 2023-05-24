import { Router } from 'express';
import * as LiderController from '../controllers/atores/liderController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import * as CarteiraController from '../controllers/negociacao/carteiraController';
import * as TransacaoController from '../controllers/negociacao/transacaoController';
import * as valida from '../middlewares/validaSchema';
import { rotaPrivada } from '../config/passport';

const router = Router();

//CRUD ALUNO
router.post('/aluno', valida.aluno, AlunoController.criarAluno);
router.get('/alunos', rotaPrivada ,AlunoController.listarAlunos);
router.get('/aluno/:id', AlunoController.pegarAluno);
router.put('/aluno/:id', valida.updateAluno, AlunoController.atualizarAluno);
router.delete('/aluno/:id', AlunoController.deletarAluno);

//CRUD RESPONSAVEL
router.post('/responsavel', valida.responsavel, ResponsavelController.criarResponsavel);
router.get('/responsaveis', ResponsavelController.listarResponsaveis);
router.get('/responsavel/:id', ResponsavelController.pegarResponsavel);
router.put('/responsavel/:id', valida.updateResponsavel, ResponsavelController.atualizarResponsavel);
router.delete('/responsavel/:id', ResponsavelController.deletarResponsavel);

//CRUD LIDER
router.post('/login', rotaPrivada, LiderController.login);
router.post('/lider', valida.lider, LiderController.criarLider);
router.get('/lideres', LiderController.listarLideres);
router.get('/lider/:id', LiderController.pegarLider);
router.put('/lider/:id', valida.updateLider, LiderController.atualizarLider);
router.delete('/lider/:id', LiderController.deletarLider);

//CRUD Carteira
router.get('/carteiras', CarteiraController.listarCarteiras);
router.get('/carteira/:id', CarteiraController.pegarCarteira);
router.put('/alterarSaldo/:id', valida.alteraSaldo, CarteiraController.alterarSaldo);
//router.post('/criarCarteira', CarteiraController.criarCarteira);              //carteira so pode ser criada quando aluno for criado para garantir que cada carteira tem aluno
//router.delete('/deletarCarteira/:id', CarteiraController.deletarCarteira);    //carteira so pode ser deletada quando aluno é deletado


//CRUD TRANSACAO
router.get('/transacoes', TransacaoController.listarTransacoes);
router.get('/transacao/:id', TransacaoController.pegarTransacao);
router.put('/transacao/:id', valida.editaDescricao,  TransacaoController.editarTransacao);
router.delete('/transacao/:id', TransacaoController.deletarTransacao);



router.get('/clube', ClubeController.clube);
router.get('/manual', ClubeController.manual);

export default router;