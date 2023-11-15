import { Router } from 'express';
import * as LiderController from '../controllers/atores/liderController';
import * as AlunoController from '../controllers/atores/alunoController';
import * as ResponsavelController from '../controllers/atores/responsavelController';
import * as ClubeController from '../controllers/clubeController';
import * as CarteiraController from '../controllers/negociacao/carteiraController';
import * as TransacaoController from '../controllers/negociacao/transacaoController';
import * as MaterialController from '../controllers/secretaria/materialController';
import * as VendaController from '../controllers/secretaria/vendaController';
import * as PagamentoController from '../controllers/secretaria/pagamentoController';
import * as CaixaController from '../controllers/secretaria/caixaController';
import * as valida from '../middlewares/validaSchema';
import { verificarToken } from '../config/passport';

const router = Router();

//CRUD ALUNO
router.post('/aluno', verificarToken, valida.aluno, AlunoController.criarAluno);
router.get('/alunos', verificarToken ,AlunoController.listarAlunos);
router.get('/ranking', verificarToken ,AlunoController.rankingAlunos);
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
router.post('/login', LiderController.login);
router.post('/lider', verificarToken, valida.lider, LiderController.criarLider);
router.get('/lideres', verificarToken, LiderController.listarLideres);
router.get('/lider/:id', verificarToken, LiderController.pegarLider);
router.get('/meusDadoslider', verificarToken, LiderController.meusDadosLider);
router.put('/perfil/:id', verificarToken, valida.updateLider, LiderController.atualizarPerfilLider);
router.put('/lider/:id', verificarToken, valida.updateClubeLider, LiderController.atualizarClubeLider);
router.put('/acesso', verificarToken, valida.acessoLider, LiderController.alterarAcesso);
router.delete('/lider/:id', verificarToken, LiderController.deletarLider);

//CRUD Carteira
router.get('/carteiras', verificarToken, CarteiraController.listarCarteiras);
router.get('/carteira/:id', verificarToken, CarteiraController.pegarCarteira);
router.put('/carteira/:id', verificarToken, valida.alteraSaldo, CarteiraController.novoSalvo);
//router.post('/criarCarteira', CarteiraController.criarCarteira);              //carteira so pode ser criada quando aluno for criado para garantir que cada carteira tem aluno
//router.delete('/deletarCarteira/:id', CarteiraController.deletarCarteira);    //carteira so pode ser deletada quando aluno é deletado


//CRUD TRANSACAO
router.get('/transacoes', verificarToken, TransacaoController.listarTransacoes);
router.get('/transacao/:id', verificarToken, TransacaoController.pegarTransacao);
router.put('/transacao/:id', verificarToken, valida.editaDescricao,  TransacaoController.editarTransacao);
router.delete('/transacao/:id', verificarToken, TransacaoController.deletarTransacao);

//CRUD MATERIAL
router.post('/material', verificarToken, valida.material, MaterialController.criarMaterial);
router.get('/materiais/:id?', verificarToken, MaterialController.listarMateriais);
router.get('/material/:id', verificarToken, MaterialController.pegarMaterial);
router.put('/material/:id', verificarToken, valida.editarMaterial, MaterialController.editarMaterial);
router.delete('/material/:id', verificarToken, MaterialController.deletarMaterial);

//CRUD VENDAS
router.post('/venda', verificarToken, valida.venda, VendaController.registrarVenda);
router.get('/vendas', verificarToken, VendaController.listarVendas);
router.get('/venda/:id', verificarToken, VendaController.pegarVenda);
router.put('/venda/:id', verificarToken, valida.editaDescricao, VendaController.editarVenda);
router.delete('/venda/:id', verificarToken, VendaController.deletarVenda);


//CRUD PAGAMENTOS
router.post('/pagamento', verificarToken, valida.pagamento, PagamentoController.registrarPagamento);
router.get('/pagamentos', verificarToken, PagamentoController.listarPagamentos);
router.get('/pagamento/:id', verificarToken, PagamentoController.pegarPagamento);


//CRUD CAIXA
router.post('/caixa', verificarToken, valida.caixa, CaixaController.criarMovimentacao);
router.get('/caixas/', verificarToken, CaixaController.listarMovimentacoes);
router.get('/caixa/:id', verificarToken, CaixaController.pegarMovimentacao);
router.put('/caixa/:id', verificarToken, valida.editaDescricao, CaixaController.editarMovimentacao);


router.get('/clubes', verificarToken, ClubeController.listarClubes);
router.get('/manuais', verificarToken, ClubeController.manuais);


//usado na validação do token no frontend
router.get('/rotaProtegida', verificarToken, (req, res) => {
  // Lógica específica da rota protegida
  res.status(200).json({ message: 'Rota protegida acessada com sucesso' });
});

export default router;