from models.solicitacao import Solicitacao

class CriarSolicitacaoService:
    def executar(self, dados: dict):
        # 1. Validação de Regra de Negócio
        if not dados.get('nome_paciente'):
            raise ValueError("O nome do paciente é obrigatório.")
        if not dados.get('procedimento'):
            raise ValueError("O procedimento cirúrgico é obrigatório.")

        # 2. Instancia a Model com os dados
        nova_solicitacao = Solicitacao(
            nome_paciente=dados.get('nome_paciente'),
            registro_paciente=dados.get('registro_paciente'),
            convenio=dados.get('convenio'),
            medico_solicitante=dados.get('medico_solicitante'),
            crm=dados.get('crm'),
            procedimento=dados.get('procedimento'),
            data_agendada=dados.get('data_agendada'),
            justificativa=dados.get('justificativa')
        )

        # 3. Persiste no banco de dados chamando a Model
        nova_solicitacao.salvar()
        
        return nova_solicitacao