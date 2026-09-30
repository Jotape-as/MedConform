from flask import jsonify
from services.criar_solicitacao_service import CriarSolicitacaoService
from services.listar_solicitacoes_service import ListarSolicitacoesService
from services.atualizar_status_service import AtualizarStatusService
from services.excluir_solicitacao_service import ExcluirSolicitacaoService
from services.estatisticas_service import EstatisticasService
from services.listar_pendentes_service import ListarPendentesService
from services.emitir_parecer_service import EmitirParecerService
from models.solicitacao import Solicitacao
from dotenv import load_dotenv
import os
from google import genai
import json

load_dotenv()


class SolicitacaoController:

    def listar(self):
        try:
            service = ListarSolicitacoesService()
            solicitacoes = service.executar()
            
            lista = []
            for s in solicitacoes:
                # Formata o valor para a moeda local, se existir
                valor_db = getattr(s, 'valor_total', None)
                if valor_db:
                    valor_formatado = f"R$ {valor_db:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
                else:
                    valor_formatado = "R$ 0,00"

                lista.append({
                    "id_real": s.id,
                    "id": f"#RQ-{s.id:04d}",
                    "medico": s.medico_solicitante,
                    "procedimento": s.procedimento,
                    "status": s.status,
                    "data": s.data_agendada or "A definir",
                    
                    # 👇 A correção principal está aqui 👇
                    "valor": valor_formatado,
                    
                    "justificativa": s.justificativa,
                    "materiais_solicitados": getattr(s, 'materiais_solicitados', None),
                    "valor_total": valor_db,
                    "fornecedor_vencedor": getattr(s, 'fornecedor_vencedor', None)
                })
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def atualizar_status(self, solicitacao_id, request):
        try:
            dados = request.get_json()
            service = AtualizarStatusService()
            service.executar(solicitacao_id, dados.get("status"))
            return jsonify({"mensagem": "Status atualizado com sucesso!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def excluir(self, solicitacao_id):
        try:
            service = ExcluirSolicitacaoService()
            service.executar(solicitacao_id)
            return jsonify({"mensagem": "Solicitação excluída permanentemente!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def estatisticas(self):
        try:
            service = EstatisticasService()
            dados = service.executar()
            return jsonify(dados), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def listar_pendentes(self):
        try:
            service = ListarPendentesService()
            solicitacoes = service.executar()
            
            lista = []
            for s in solicitacoes:
                lista.append({
                    "id_real": s.id,
                    "id": f"#RQ-{s.id:04d}",
                    "paciente": getattr(s, 'nome_paciente', 'Não informado'),
                    "procedimento": s.procedimento,
                    "status": s.status,
                    
                    # 👇 CAMPOS NOVOS ADICIONADOS AQUI 👇
                    "justificativa": s.justificativa,
                    "materiais_solicitados": getattr(s, 'materiais_solicitados', None),
                    "valor_total": getattr(s, 'valor_total', None),
                    "fornecedor_vencedor": getattr(s, 'fornecedor_vencedor', None)
                })
                
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    def emitir_parecer(self, solicitacao_id, request):
        try:
            dados = request.get_json() or {}
            novo_status = dados.get("status")
            parecer = dados.get("parecer", "")

            if not novo_status:
                return jsonify({"erro": "Status é obrigatório."}), 400

            service = EmitirParecerService()
            service.executar(solicitacao_id, novo_status, parecer)
            return jsonify({"mensagem": f"Solicitação {novo_status.lower()} com sucesso!"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    def analisar_com_ia(self, id):
        try:
            # 1. PRIMEIRO PASSO: Buscar a solicitação na base de dados!
            # (Se o teu modelo tiver outro nome, ajusta de acordo)
            solicitacao = Solicitacao.query.get(id)
            
            if not solicitacao:
                return jsonify({"erro": "Solicitação não encontrada"}), 404

            # 2. SEGUNDO PASSO: Só agora criamos o prompt, pois a variável 'solicitacao' já existe
            prompt_auditoria = f"""
            Você é um Médico Auditor Chefe especialista em OPME (Órteses, Próteses e Materiais Especiais).
            Sua missão é cruzar os dados clínicos do paciente com os materiais de alto custo solicitados no catálogo oficial do hospital. O objetivo é bloquear fraudes, superfaturamentos por quantidade abusiva e erros anatômicos.

            DADOS DO PEDIDO CLÍNICO:
            - Procedimento Cirúrgico: {solicitacao.procedimento}
            - Justificativa Médica: {solicitacao.justificativa}
            - Materiais Selecionados e Quantidades: {solicitacao.materiais_solicitados}

            REGRAS DE AUDITORIA CRÍTICA:
            1. Pertinência Anatômica: Os materiais escolhidos fazem sentido para a região do corpo descrita no procedimento?
            2. Controle de Excesso: A quantidade solicitada de cada item é compatível com o padrão da cirurgia, ou há indícios claros de desperdício/fraude visando lucro?

            Responda EXCLUSIVAMENTE em formato JSON, sem nenhuma formatação Markdown (```json), usando exatamente esta estrutura:
            {{
                "status": "APROVADO",
                "risco_fraude": "BAIXO",
                "parecer_tecnico": "Escreva o parecer aqui..."
            }}
            """
            # 3. Pega a chave de forma segura e chama a IA
            chave_api = os.getenv("GEMINI_API_KEY")
            client = genai.Client(api_key=chave_api) 
            resposta = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt_auditoria
            )
            
            # 4. Limpa a resposta
            texto_limpo = resposta.text.replace('```json', '').replace('```', '').strip()
            dados_ia = json.loads(texto_limpo)
            
            return jsonify(dados_ia), 200

        except Exception as e:
            print("Erro na IA:", e)
            return jsonify({"erro": "Falha ao processar com IA."}), 500
        
        
    def criar(self, request):
        try:
            # Converte o formulário padrão para um dicionário
            dados_texto = request.form.to_dict()
            
            # Captura as listas de materiais e quantidades enviadas pelo HTML
            nomes_materiais = request.form.getlist('nome_material[]')
            quantidades = request.form.getlist('quantidade_material[]')
            
            # Monta uma lista de dicionários com os materiais estruturados
            lista_opme = []
            for nome, qtd in zip(nomes_materiais, quantidades):
                if nome.strip():
                    lista_opme.append({"nome": nome.strip(), "quantidade": int(qtd)})
            
            # Adiciona a lista estruturada aos dados que vão para o Service
            dados_texto['materiais_opme'] = lista_opme
            
            arquivo = request.files.get('exame')
            
            service = CriarSolicitacaoService()
            nova_solicitacao = service.executar(dados_texto, arquivo)
            
            return jsonify({"mensagem": "Solicitação criada com sucesso!", "id_solicitacao": nova_solicitacao.id}), 201
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    
