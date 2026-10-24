import os
import json
from dotenv import load_dotenv
from google import genai
from models.solicitacao import Solicitacao

load_dotenv()

class AnalisarIAService:
    def executar(self, solicitacao_id):
        solicitacao = Solicitacao.query.get(solicitacao_id)
        if not solicitacao:
            raise ValueError("Solicitação não encontrada")

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

        chave_api = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=chave_api)
        
        resposta = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt_auditoria
        )

        texto_limpo = resposta.text.replace('```json', '').replace('```', '').strip()
        return json.loads(texto_limpo)