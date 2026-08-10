from flask import Flask
from flask_cors import CORS
from controllers.documento_controller import documento_bp
from services.documento_service import DocumentoService

app = Flask(__name__)

CORS(app)

service = DocumentoService()
service.criar_tabela()

app.register_blueprint(documento_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)