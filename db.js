/**
 * db.js — Doce Caramelo v2
 * Sincronização em tempo real via Firebase Realtime Database.
 * Qualquer alteração feita em um dispositivo aparece automaticamente
 * em todos os outros dispositivos que estiverem com o site aberto.
 *
 * ⚠️ NÃO EDITE este arquivo manualmente, a menos que saiba o que está fazendo.
 */

const FIREBASE_URL = 'https://doce-caramelov2-default-rtdb.firebaseio.com';
const DATA_PATH    = '/dados.json';
const FULL_URL     = FIREBASE_URL + DATA_PATH;

// ─────────────────────────────────────────────
// INDICADOR VISUAL DE SINCRONIZAÇÃO
// Mostra um ponto colorido no canto da tela:
//   🟡 amarelo = salvando
//   🟢 verde   = salvo
//   🔴 vermelho = erro de conexão
// ─────────────────────────────────────────────
(function criarIndicador() {
  const style = document.createElement('style');
  style.textContent = `
    #sync-dot {
      position: fixed;
      bottom: 14px;
      right: 14px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #3DC97A;
      z-index: 99999;
      transition: background 0.4s, transform 0.2s;
      box-shadow: 0 0 0 2px rgba(0,0,0,0.3);
      cursor: default;
    }
    #sync-dot.saving  { background: #F0C040; transform: scale(1.3); }
    #sync-dot.error   { background: #E05252; }
    #sync-dot.ok      { background: #3DC97A; }
    #sync-dot-label {
      position: fixed;
      bottom: 28px;
      right: 28px;
      font-size: 10px;
      color: rgba(240,232,216,0.55);
      z-index: 99999;
      pointer-events: none;
      font-family: 'DM Mono', monospace;
    }
  `;
  document.head.appendChild(style);

  const dot   = document.createElement('div');
  dot.id      = 'sync-dot';
  dot.title   = 'Status de sincronização';

  const label = document.createElement('div');
  label.id    = 'sync-dot-label';
  label.textContent = '';

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(dot);
    document.body.appendChild(label);
  });
})();

function _setSyncStatus(status, texto) {
  const dot   = document.getElementById('sync-dot');
  const label = document.getElementById('sync-dot-label');
  if (dot)   { dot.className = status; }
  if (label) { label.textContent = texto || ''; }
}

// ─────────────────────────────────────────────
// CAMADA FIREBASE — leitura e escrita via REST
// ─────────────────────────────────────────────
const DB = (function () {

  // Cache local para leitura instantânea enquanto
  // aguarda resposta do Firebase
  let _cache = null;

  // ── SALVAR ──────────────────────────────────
  // Envia os dados para o Firebase via PUT.
  // Retorna true se salvou, false se deu erro.
  async function save(state) {
    _setSyncStatus('saving', 'salvando…');
    try {
      const clean = JSON.parse(JSON.stringify(state, (k, v) => {
        if (k === '_metaInterval') return undefined;
        return v;
      }));
      _cache = clean;

      const res = await fetch(FULL_URL, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(clean),
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      _setSyncStatus('ok', '');
      return true;
    } catch (e) {
      console.error('[DB] Erro ao salvar no Firebase:', e);
      // Fallback: salva no localStorage para não perder dados
      try {
        localStorage.setItem('doce_caramelo_fallback', JSON.stringify(state));
      } catch (_) {}
      _setSyncStatus('error', 'sem conexão');
      return false;
    }
  }

  // ── CARREGAR ─────────────────────────────────
  // Lê os dados do Firebase via GET.
  // Se não tiver conexão, tenta o localStorage como fallback.
  // Esta função é SÍNCRONA para compatibilidade com o index.html
  // (retorna o cache local imediatamente e dispara atualização em background).
  function load() {
    // Dispara leitura assíncrona em background
    _loadFromFirebase();
    // Retorna cache ou null para o index.html não travar
    return _cache;
  }

  async function _loadFromFirebase() {
    _setSyncStatus('saving', 'carregando…');
    try {
      const res  = await fetch(FULL_URL);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();

      if (data && typeof data === 'object') {
        _cache = data;
        _setSyncStatus('ok', '');
        // Atualiza o estado global S e re-renderiza a tela
        _aplicarDados(data);
      } else {
        // Firebase retornou null → banco vazio, tudo normal
        _setSyncStatus('ok', '');
      }
    } catch (e) {
      console.error('[DB] Erro ao carregar do Firebase:', e);
      // Fallback: tenta o localStorage
      try {
        const raw = localStorage.getItem('doce_caramelo_fallback');
        if (raw) {
          _cache = JSON.parse(raw);
          _aplicarDados(_cache);
        }
      } catch (_) {}
      _setSyncStatus('error', 'sem conexão');
    }
  }

  // Aplica os dados vindos do Firebase no estado global S
  // e re-renderiza a tela sem precisar recarregar a página
  function _aplicarDados(data) {
    if (typeof S !== 'undefined' && S !== null) {
      Object.assign(S, data);
      if (typeof renderAll         === 'function') renderAll();
      if (typeof updateMetaBanner  === 'function') updateMetaBanner();
      if (typeof startMetaTimer    === 'function' && S.meta && S.meta.active && S.meta.endTime) {
        startMetaTimer();
      }
    }
  }

  // ── LIMPAR ───────────────────────────────────
  async function clear() {
    _cache = null;
    try {
      await fetch(FULL_URL, { method: 'DELETE' });
      localStorage.removeItem('doce_caramelo_fallback');
    } catch (e) {
      console.error('[DB] Erro ao limpar:', e);
    }
  }

  // ── TAMANHO ──────────────────────────────────
  function size() {
    if (!_cache) return '0 KB';
    const raw = JSON.stringify(_cache);
    return (raw.length / 1024).toFixed(1) + ' KB';
  }

  // ── SINCRONIZAÇÃO AUTOMÁTICA ─────────────────
  // A cada 8 segundos, busca os dados do Firebase
  // para refletir alterações feitas em outro dispositivo.
  // (Isso é o "tempo real" para o plano gratuito do Firebase)
  setInterval(() => {
    _loadFromFirebase();
  }, 8000);

  return { save, load, clear, size };

})();
