document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const erroDiv = document.getElementById('login-erro');
    const btnSubmit = e.target.querySelector('button');

    erroDiv.style.display = 'none';
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...';
    btnSubmit.disabled = true;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const dados = await response.json();

        if (response.ok) {
            sessionStorage.setItem('usuarioNome', dados.usuario.nome);
            sessionStorage.setItem('usuarioPerfil', dados.usuario.perfil);

            window.location.href = 'index.html';
        } else {
            erroDiv.textContent = dados.erro || "Falha na autenticação.";
            erroDiv.style.display = 'block';
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        erroDiv.textContent = "Erro ao conectar com o servidor.";
        erroDiv.style.display = 'block';
    } finally {
        btnSubmit.innerHTML = 'Entrar no Sistema';
        btnSubmit.disabled = false;
    }
});