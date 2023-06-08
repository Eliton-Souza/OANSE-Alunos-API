import { Router } from 'express';
import * as LiderController from '../controllers/atores/liderController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import * as CarteiraController from '../controllers/negociacao/carteiraController';
import * as TransacaoController from '../controllers/negociacao/transacaoController';
import * as valida from '../middlewares/validaSchema';
import { verificarToken } from '../config/passport';

const router = Router();

//CRUD ALUNO
router.post('/aluno', verificarToken, valida.aluno, AlunoController.criarAluno);
router.get('/alunos', verificarToken ,AlunoController.listarAlunos);
router.get('/aluno/:id',verificarToken, AlunoController.pegarAluno);
router.put('/aluno/:id', verificarToken, valida.updateAluno, AlunoController.atualizarAluno);
router.delete('/aluno/:id',verificarToken, AlunoController.deletarAluno);

//CRUD RESPONSAVEL
router.post('/responsavel', verificarToken,valida.responsavel, ResponsavelController.criarResponsavel);
router.get('/responsaveis', verificarToken, ResponsavelController.listarResponsaveis);
router.get('/responsavel/:id', verificarToken, ResponsavelController.pegarResponsavel);
router.put('/responsavel/:id', verificarToken, valida.updateResponsavel, ResponsavelController.atualizarResponsavel);
router.delete('/responsavel/:id', verificarToken, ResponsavelController.deletarResponsavel);

//CRUD LIDER
router.post('/login',  LiderController.login);
router.post('/lider', verificarToken, valida.lider, LiderController.criarLider);
router.get('/lideres', verificarToken, LiderController.listarLideres);
router.get('/lider/:id', verificarToken, LiderController.pegarLider);
router.put('/lider/:id', verificarToken, valida.updateLider, LiderController.atualizarLider);
router.delete('/lider/:id', verificarToken, LiderController.deletarLider);

//CRUD Carteira
router.get('/carteiras', verificarToken, CarteiraController.listarCarteiras);
router.get('/carteira/:id', verificarToken, CarteiraController.pegarCarteira);
router.put('/alterarSaldo/:id', verificarToken, valida.alteraSaldo, CarteiraController.alterarSaldo);
//router.post('/criarCarteira', CarteiraController.criarCarteira);              //carteira so pode ser criada quando aluno for criado para garantir que cada carteira tem aluno
//router.delete('/deletarCarteira/:id', CarteiraController.deletarCarteira);    //carteira so pode ser deletada quando aluno é deletado


//CRUD TRANSACAO
router.get('/transacoes', verificarToken, TransacaoController.listarTransacoes);
router.get('/transacao/:id', verificarToken, TransacaoController.pegarTransacao);
router.put('/transacao/:id', verificarToken, valida.editaDescricao,  TransacaoController.editarTransacao);
router.delete('/transacao/:id', verificarToken, TransacaoController.deletarTransacao);

router.get('/clube', verificarToken, ClubeController.clube);
router.get('/manuais', verificarToken, ClubeController.manuais);


//usado na validação do token no frontend
router.get('/rotaProtegida', verificarToken, (req, res) => {
    // Se o token foi verificado com sucesso, retornamos true
    res.json({ status: true });
  });

export default router;