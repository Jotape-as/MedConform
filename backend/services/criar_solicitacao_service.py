from models.solicitacao import Solicitacao
import os
from werkzeug.utils import secure_filename
from google import genai
import random

# Define a pasta de uploads na raiz do backend
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class CriarSolicitacaoService:
    def executar(self, dados: dict, arquivo_exame=None):
        # 1. Validação de Regra de Negócio
        if not dados.get('nome_paciente'):
            raise ValueError("O nome do paciente é obrigatório.")
        if not dados.get('procedimento'):
            raise ValueError("O procedimento cirúrgico é obrigatório.")

        # NOVO: Validação dos materiais OPME
        materiais_opme = dados.get('materiais_opme', [])
        if not materiais_opme:
            raise ValueError("É necessário solicitar pelo menos um material OPME.")

        # NOVO: Simula a busca no banco de fornecedores pelo menor preço
        melhor_orcamento = self._calcular_melhor_orcamento(materiais_opme)

        # 2. Processa o upload do arquivo de exame (se houver)
        caminho_arquivo = None
        if arquivo_exame and arquivo_exame.filename != '':
            filename = secure_filename(arquivo_exame.filename)
            caminho_arquivo = os.path.join(UPLOAD_FOLDER, filename)
            arquivo_exame.save(caminho_arquivo)

        # 3. Instancia a Model com os dados e o caminho do exame
        nova_solicitacao = Solicitacao(
            nome_paciente=dados.get('nome_paciente'),
            registro_paciente=dados.get('registro_paciente'),
            convenio=dados.get('convenio'),
            medico_solicitante=dados.get('medico_solicitante'),
            crm=dados.get('crm'),
            procedimento=dados.get('procedimento'),
            data_agendada=dados.get('data_agendada'),
            justificativa=dados.get('justificativa'),
            # Adicione estes campos à sua base de dados depois para descomentar:
            valor_total=melhor_orcamento['total'],
            fornecedor_vencedor=melhor_orcamento['fornecedor'],
            materiais_solicitados=str(materiais_opme)
        )

        # 4. Persiste no banco de dados chamando a Model
        nova_solicitacao.salvar()
        
        return nova_solicitacao

    # NOVO: Método que simula a escolha do fornecedor mais barato
    def _calcular_melhor_orcamento(self, materiais):
        fornecedores = ["NeoOrtho Medical", "Synthes Brasil", "Stryker OPME"]
        orcamentos = []

        for fornecedor in fornecedores:
            total_fornecedor = 0
            for item in materiais:
                preco_simulado = random.uniform(500.0, 4500.0) 
                total_fornecedor += preco_simulado * item['quantidade']
            
            orcamentos.append({
                "fornecedor": fornecedor,
                "total": round(total_fornecedor, 2)
            })

        orcamentos_ordenados = sorted(orcamentos, key=lambda x: x['total'])
        return orcamentos_ordenados[0]


def analisar_exame_com_ia(caminho_arquivo, justificativa_medica):
    # Puxa a chave de forma segura do arquivo .env
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    contents = [
        f"Analise a coerência deste pedido médico e do exame anexado para cirurgia OPME. Justificativa: {justificativa_medica}"
    ]
    
    # Se houver um arquivo de exame anexado, faz o upload para o Gemini processar
    if caminho_arquivo and os.path.exists(caminho_arquivo):
        arquivo_enviado = client.files.upload(file=caminho_arquivo)
        contents.insert(0, arquivo_enviado)
        
    resposta = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=contents
    )
    
    return resposta.text