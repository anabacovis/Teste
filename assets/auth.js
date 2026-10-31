/* Autenticação compartilhada (Supabase Auth).
   Uso nas telas protegidas, dentro do <head>:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
     <script src="assets/auth.js" data-guard></script>
   Sem sessão → volta para Login.html. A chave abaixo é a publishable (pública por natureza). */
(function () {
  const SUPABASE_URL = 'https://bfwvanafslhvsansukdx.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_vhN1eiKJYItY1OIX3dPsjA_bqg6lk6V';

  // Guarda o hash antes do Supabase limpá-lo (link de recuperação: #...type=recovery)
  window.authHash = new URLSearchParams(location.hash.slice(1));

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.sb = sb;

  window.logout = async function () {
    await sb.auth.signOut();
    window.location.href = 'Login.html';
  };

  const me = document.currentScript;
  if (!me || !me.hasAttribute('data-guard')) return;

  // Esconde a tela até confirmar a sessão (evita mostrar dados a quem não entrou)
  document.documentElement.style.visibility = 'hidden';
  sb.auth.getSession().then(({ data }) => {
    if (!data.session) {
      window.location.replace('Login.html');
      return;
    }
    window.currentUser = data.session.user;
    document.documentElement.style.visibility = '';
  });

  sb.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') window.location.replace('Login.html');
  });
})();
