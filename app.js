/**
 * encontralo · app.js
 * ─────────────────────────────────────────────────────────
 * Toda la lógica de la app en módulos independientes.
 *
 * SUPABASE: buscá las secciones marcadas con ═══ SUPABASE ═══
 * para saber exactamente dónde conectar el backend.
 * Son 4 puntos: init, login, guardar, y cargar historial.
 * ─────────────────────────────────────────────────────────
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════════ */

const CONFIG = {

  // ═══ SUPABASE ════════════════════════════════════════════
  // Cuando tengas el proyecto en supabase.com, pegá estos
  // valores. Los encontrás en Project Settings → API.
  SUPABASE_URL: 'https://TU_PROYECTO.supabase.co',
  SUPABASE_KEY: 'TU_ANON_KEY',
  // ═════════════════════════════════════════════════════════

  // Nominatim (reverse geocoding, gratis, sin key)
  NOMINATIM_URL: 'https://nominatim.openstreetmap.org/reverse',

  // Velocidad promedio caminando (m/min) para calcular ETA
  WALK_SPEED_MPM: 80,

  // Onboarding: flag en localStorage
  ONB_KEY: 'encontralo_onb_done',
  // Auth: flag en localStorage (se reemplaza con Supabase session)
  AUTH_KEY: 'encontralo_user',
};


/* ══════════════════════════════════════════════════════════
   ESTADO GLOBAL
   Todo el estado de la app en un objeto.
   Nunca modificar directamente — usar los setters.
══════════════════════════════════════════════════════════ */

const State = (() => {
  let _state = {
    user:      null,   // { id, name, email, avatar_url }
    autoData:  null,   // { id, dir, barrio, tipo, nota, lat, lng, foto, ts }
    historial: [],     // Array de autoData anteriores
    geo: {
      lat: -34.6037,
      lng: -58.3816,
      ok: false,
    },
    pendingLocation: null, // Ubicación capturada antes de guardar
    selectedTipo: 'Calle',
    pendingFoto: null,     // base64 de la foto antes de guardar
  };

  return {
    get: () => _state,
    set: (patch) => { _state = { ..._state, ...patch }; },
    setUser:      (u) => { _state.user = u; },
    setAutoData:  (d) => { _state.autoData = d; },
    addHistorial: (d) => { _state.historial.unshift(d); },
    clearAuto:    ()  => { _state.autoData = null; },
    setGeo:       (lat, lng) => { _state.geo = { lat, lng, ok: true }; },
  };
})();


/* ══════════════════════════════════════════════════════════
   SUPABASE CLIENT
   Wrapper que centraliza todas las llamadas al backend.
   Cuando estés lista para conectar, completá cada función.
══════════════════════════════════════════════════════════ */

const DB = {

  // ═══ SUPABASE: init ══════════════════════════════════════
  // Descomentar cuando agregues el script de Supabase en index.html
  //
  // _client: null,
  // init() {
  //   this._client = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
  // },
  // ═════════════════════════════════════════════════════════


  // ═══ SUPABASE: guardar parking ════════════════════════════
  // Reemplazar con:
  // async savePark(data) {
  //   const { error } = await this._client.from('parkings').insert({
  //     user_id:  data.userId,
  //     lat:      data.lat,
  //     lng:      data.lng,
  //     dir:      data.dir,
  //     barrio:   data.barrio,
  //     tipo:     data.tipo,
  //     nota:     data.nota || null,
  //     foto_url: data.fotoUrl || null,
  //   });
  //   if (error) throw error;
  // },
  async savePark(data) {
    // LOCAL: guardado temporal en memoria
    console.log('[DB] savePark (local):', data);
    return { id: 'local_' + Date.now() };
  },


  // ═══ SUPABASE: marcar como encontrado (borrar activo) ═════
  // async markFound(parkId) {
  //   const { error } = await this._client
  //     .from('parkings')
  //     .update({ found_at: new Date().toISOString() })
  //     .eq('id', parkId);
  //   if (error) throw error;
  // },
  async markFound(parkId) {
    console.log('[DB] markFound (local):', parkId);
  },


  // ═══ SUPABASE: cargar historial del usuario ═══════════════
  // async loadHistory(userId) {
  //   const { data, error } = await this._client
  //     .from('parkings')
  //     .select('*')
  //     .eq('user_id', userId)
  //     .order('created_at', { ascending: false })
  //     .limit(50);
  //   if (error) throw error;
  //   return data;
  // },
  async loadHistory(userId) {
    // LOCAL: devuelve lo que está en memoria
    console.log('[DB] loadHistory (local):', userId);
    return State.get().historial;
  },


  // ═══ SUPABASE: subir foto ══════════════════════════════════
  // async uploadFoto(userId, base64) {
  //   const blob = await fetch(base64).then(r => r.blob());
  //   const path = `${userId}/${Date.now()}.jpg`;
  //   const { error } = await this._client.storage
  //     .from('parking-fotos')
  //     .upload(path, blob, { contentType: 'image/jpeg' });
  //   if (error) throw error;
  //   const { data } = this._client.storage.from('parking-fotos').getPublicUrl(path);
  //   return data.publicUrl;
  // },
  async uploadFoto(userId, base64) {
    // LOCAL: devuelve el base64 como URL temporal
    return base64;
  },

};


/* ══════════════════════════════════════════════════════════
   AUTH
   Manejo de sesión y login con Google OAuth.
══════════════════════════════════════════════════════════ */

const Auth = {

  // ═══ SUPABASE: login con Google ════════════════════════════
  // Reemplazar con:
  // async loginWithGoogle() {
  //   UI.setLoginLoading(true);
  //   const { error } = await DB._client.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: { redirectTo: window.location.origin }
  //   });
  //   if (error) { UI.toast('Error al iniciar sesión'); UI.setLoginLoading(false); }
  // },
  async loginWithGoogle() {
    UI.setLoginLoading(true);
    // SIMULADO: simula un login exitoso después de 1 segundo
    await sleep(1000);
    const fakeUser = {
      id:         'demo_user_001',
      name:       'Milu',
      email:      'milu@gmail.com',
      avatar_url: null,
    };
    Auth._onLogin(fakeUser);
  },


  // ═══ SUPABASE: escuchar cambios de sesión ══════════════════
  // Llamar esto en el init de la app:
  // DB._client.auth.onAuthStateChange((event, session) => {
  //   if (event === 'SIGNED_IN' && session?.user) {
  //     Auth._onLogin({
  //       id:         session.user.id,
  //       name:       session.user.user_metadata.full_name,
  //       email:      session.user.email,
  //       avatar_url: session.user.user_metadata.avatar_url,
  //     });
  //   } else if (event === 'SIGNED_OUT') {
  //     Auth._onLogout();
  //   }
  // });
  // ═════════════════════════════════════════════════════════


  _onLogin(user) {
    State.setUser(user);
    localStorage.setItem(CONFIG.AUTH_KEY, JSON.stringify(user));
    UI.setLoginLoading(false);
    UI.updateUserUI(user);
    Nav.go('home');
  },

  async logout() {
    if (!confirm('¿Cerrar sesión?')) return;

    // ═══ SUPABASE: logout ══════════════════════════════════
    // await DB._client.auth.signOut();
    // ═════════════════════════════════════════════════════════

    localStorage.removeItem(CONFIG.AUTH_KEY);
    State.setUser(null);
    Nav.go('login');
  },

  // Restaurar sesión desde localStorage (hasta que Supabase maneje sesión real)
  restoreSession() {
    try {
      const raw = localStorage.getItem(CONFIG.AUTH_KEY);
      if (raw) {
        const user = JSON.parse(raw);
        State.setUser(user);
        return user;
      }
    } catch (e) { /* sesión corrupta, ignorar */ }
    return null;
  },
};


/* ══════════════════════════════════════════════════════════
   GEO
   Geolocalización del navegador + reverse geocoding.
══════════════════════════════════════════════════════════ */

const Geo = {

  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocalización no disponible'));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          State.setGeo(pos.coords.latitude, pos.coords.longitude);
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => reject(err),
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  },

  async reverseGeocode(lat, lng) {
    try {
      const url = `${CONFIG.NOMINATIM_URL}?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`;
      const res  = await fetch(url);
      const data = await res.json();
      const a    = data.address || {};
      const road = a.road || a.pedestrian || a.street || a.footway || 'Ubicación actual';
      const num  = a.house_number ? ' ' + a.house_number : '';
      const barrio = a.suburb || a.neighbourhood || a.quarter || a.city_district || 'Buenos Aires';
      return { dir: road + num, barrio };
    } catch {
      return { dir: 'Ubicación actual', barrio: 'Buenos Aires' };
    }
  },

  // Fórmula de Haversine: distancia entre dos puntos en metros
  calcDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2
            + Math.cos(lat1 * Math.PI / 180)
            * Math.cos(lat2 * Math.PI / 180)
            * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  },

  formatDist(meters) {
    return meters < 1000
      ? Math.round(meters) + ' m'
      : (meters / 1000).toFixed(1) + ' km';
  },

  formatWalk(meters) {
    const mins = Math.round(meters / CONFIG.WALK_SPEED_MPM);
    return '~' + (mins < 1 ? 1 : mins) + ' min caminando';
  },
};


/* ══════════════════════════════════════════════════════════
   MAPS
   Manejo de los tres mapas Leaflet de la app.
══════════════════════════════════════════════════════════ */

const Maps = {
  _instances: {},

  _tileLayer() {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '',
    });
  },

  _carIcon() {
    return L.divIcon({
      html: `<div style="
        width:36px;height:36px;border-radius:50%;
        background:#D85A30;border:3px solid white;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,.22);">
        <svg width="18" height="12" viewBox="0 0 24 16" fill="white">
          <rect x="2" y="6" width="20" height="8" rx="2"/>
          <rect x="5" y="2" width="12" height="8" rx="2"/>
        </svg>
      </div>`,
      className: '',
      iconAnchor: [18, 18],
    });
  },

  _youIcon() {
    return L.divIcon({
      html: `<div style="
        width:14px;height:14px;border-radius:50%;
        background:#2A5C8A;border:2.5px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,.2);"></div>`,
      className: '',
      iconAnchor: [7, 7],
    });
  },

  _clearMarkers(map) {
    map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
  },

  _init(id, opts = {}) {
    if (this._instances[id]) return this._instances[id];
    const m = L.map(id, {
      zoomControl: false,
      attributionControl: false,
      ...opts,
    });
    this._tileLayer().addTo(m);
    this._instances[id] = m;
    return m;
  },

  // Mapa de la pantalla Home (solo lectura, sin drag)
  initHome(autoLat, autoLng, myLat, myLng) {
    const m = this._init('map-home', {
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    });
    this._clearMarkers(m);
    L.marker([autoLat, autoLng], { icon: this._carIcon() }).addTo(m);
    L.marker([myLat, myLng],     { icon: this._youIcon() }).addTo(m);
    L.polyline([[myLat, myLng], [autoLat, autoLng]], {
      color: '#D85A30', weight: 2.5, dashArray: '8 6', opacity: .65,
    }).addTo(m);
    m.fitBounds([[myLat, myLng], [autoLat, autoLng]], { padding: [60, 60] });
    return m;
  },

  // Mapa del formulario Guardar (interactivo)
  initGuardar(lat, lng) {
    const m = this._init('map-guardar');
    this._clearMarkers(m);
    m.setView([lat, lng], 17);
    const pin = L.divIcon({
      html: `<div style="
        width:30px;height:30px;border-radius:50%;
        background:#D85A30;border:3px solid white;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,.25);">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="white">
          <circle cx="7" cy="5.5" r="2.2"/>
          <path d="M7 1C4.5 1 2.5 3 2.5 5.5C2.5 9.5 7 13 7 13S11.5 9.5 11.5 5.5C11.5 3 9.5 1 7 1Z"/>
        </svg>
      </div>`,
      className: '',
      iconAnchor: [15, 15],
    });
    L.marker([lat, lng], { icon: pin }).addTo(m);
    return m;
  },

  // Mapa de Regreso (interactivo con ruta)
  initRegreso(autoLat, autoLng, myLat, myLng) {
    const m = this._init('map-regreso');
    this._clearMarkers(m);
    L.marker([autoLat, autoLng], { icon: this._carIcon() }).addTo(m);
    L.marker([myLat, myLng],     { icon: this._youIcon() }).addTo(m);
    L.polyline([[myLat, myLng], [autoLat, autoLng]], {
      color: '#D85A30', weight: 3, dashArray: '10 8', opacity: .75,
    }).addTo(m);
    m.fitBounds([[myLat, myLng], [autoLat, autoLng]], { padding: [80, 80] });
    return m;
  },

  // Invalida el tamaño cuando la pantalla se vuelve visible
  invalidate(id) {
    setTimeout(() => {
      if (this._instances[id]) this._instances[id].invalidateSize();
    }, 100);
  },
};


/* ══════════════════════════════════════════════════════════
   GUARDAR
   Lógica del formulario de guardar lugar.
══════════════════════════════════════════════════════════ */

const Guardar = {

  async open() {
    Nav.go('guardar');

    // Resetear tipo seleccionado
    document.querySelectorAll('.tipo-btn').forEach(b => {
      const isDefault = b.dataset.tipo === 'Calle';
      b.classList.toggle('tipo-btn--sel', isDefault);
      b.setAttribute('aria-checked', String(isDefault));
    });
    State.set({ selectedTipo: 'Calle', pendingFoto: null });

    // Limpiar nota y foto
    document.getElementById('g-nota').value = '';
    document.getElementById('preview-foto').classList.add('hidden');
    document.getElementById('foto-area').classList.remove('hidden');
    document.getElementById('foto-input').value = '';

    // Geo + mapa
    document.getElementById('g-dir').textContent    = 'Detectando ubicación...';
    document.getElementById('g-coords').textContent = 'Obteniendo coordenadas...';

    try {
      const { lat, lng } = await Geo.getCurrentPosition();
      Maps.initGuardar(lat, lng);
      Maps.invalidate('map-guardar');
      const { dir, barrio } = await Geo.reverseGeocode(lat, lng);
      document.getElementById('g-dir').textContent    = dir;
      document.getElementById('g-coords').textContent = barrio + '  ·  ' + lat.toFixed(5) + ', ' + lng.toFixed(5);
      State.set({ pendingLocation: { lat, lng, dir, barrio } });
    } catch {
      const geo = State.get().geo;
      Maps.initGuardar(geo.lat, geo.lng);
      Maps.invalidate('map-guardar');
      document.getElementById('g-dir').textContent    = 'Ubicación aproximada';
      document.getElementById('g-coords').textContent = 'GPS no disponible — podés continuar igual';
      State.set({ pendingLocation: { lat: geo.lat, lng: geo.lng, dir: 'Ubicación aproximada', barrio: 'Buenos Aires' } });
    }
  },

  selTipo(btn) {
    document.querySelectorAll('.tipo-btn').forEach(b => {
      b.classList.remove('tipo-btn--sel');
      b.setAttribute('aria-checked', 'false');
    });
    btn.classList.add('tipo-btn--sel');
    btn.setAttribute('aria-checked', 'true');
    State.set({ selectedTipo: btn.dataset.tipo });
  },

  handleFoto(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      State.set({ pendingFoto: e.target.result });
      const preview = document.getElementById('preview-foto');
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      document.getElementById('foto-area').classList.add('hidden');
    };
    reader.readAsDataURL(file);
  },

  async guardar() {
    const btn = document.getElementById('btn-guardar');
    btn.disabled = true;
    btn.textContent = 'Guardando...';

    try {
      const s   = State.get();
      const loc = s.pendingLocation || { lat: s.geo.lat, lng: s.geo.lng, dir: 'Ubicación actual', barrio: 'Buenos Aires' };
      const nota = document.getElementById('g-nota').value.trim();

      // Subir foto si hay
      let fotoUrl = null;
      if (s.pendingFoto && s.user) {
        fotoUrl = await DB.uploadFoto(s.user.id, s.pendingFoto);
      }

      // ═══ SUPABASE: guardar en BD ════════════════════════
      await DB.savePark({
        userId:  s.user?.id || 'local',
        lat:     loc.lat,
        lng:     loc.lng,
        dir:     loc.dir,
        barrio:  loc.barrio,
        tipo:    s.selectedTipo,
        nota,
        fotoUrl,
      });
      // ═════════════════════════════════════════════════════

      const autoData = {
        id:     'local_' + Date.now(),
        lat:    loc.lat,
        lng:    loc.lng,
        dir:    loc.dir,
        barrio: loc.barrio,
        tipo:   s.selectedTipo,
        nota,
        foto:   fotoUrl,
        ts:     new Date(),
      };

      State.setAutoData(autoData);
      State.addHistorial({ ...autoData });

      // Llenar pantalla de confirmación
      document.getElementById('cf-dir').textContent  = autoData.dir;
      document.getElementById('cf-tipo').textContent = autoData.barrio + ' · ' + autoData.tipo;
      document.getElementById('cf-hora').textContent = 'Hoy, ' + Utils.fHora(autoData.ts);
      const notaRow = document.getElementById('cf-nota-row');
      const notaSep = document.getElementById('cf-nota-sep');
      if (nota) {
        document.getElementById('cf-nota-val').textContent = nota;
        notaRow.classList.remove('hidden');
        notaSep.style.display = 'block';
      } else {
        notaRow.classList.add('hidden');
        notaSep.style.display = 'none';
      }

      Nav.go('confirm');

    } catch (err) {
      console.error('[Guardar]', err);
      UI.toast('No se pudo guardar. Intentá de nuevo.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Guardar acá';
    }
  },
};


/* ══════════════════════════════════════════════════════════
   APP
   Acciones de negocio de la pantalla principal.
══════════════════════════════════════════════════════════ */

const App = {

  volverHome() {
    Nav.go('home');
    const auto = State.get().autoData;
    if (auto) App._mostrarAutoGuardado(auto);
  },

  _mostrarAutoGuardado(auto) {
    document.getElementById('state-empty').classList.add('hidden');
    document.getElementById('state-guardado').classList.remove('hidden');

    document.getElementById('home-dir').textContent  = auto.dir;
    document.getElementById('home-meta').textContent = auto.barrio + ' · Guardado ' + Utils.tRel(auto.ts);

    const geo  = State.get().geo;
    const dist = Geo.calcDistance(geo.lat, geo.lng, auto.lat, auto.lng);
    document.getElementById('home-dist').textContent = Geo.formatDist(dist);
    document.getElementById('home-walk').textContent = Geo.formatWalk(dist);

    if (auto.foto) {
      const thumb = document.getElementById('home-thumb');
      thumb.style.backgroundImage    = `url(${auto.foto})`;
      thumb.style.backgroundSize     = 'cover';
      thumb.style.backgroundPosition = 'center';
      thumb.innerHTML = '';
    }

    Maps.initHome(auto.lat, auto.lng, State.get().geo.lat, State.get().geo.lng);
    Maps.invalidate('map-home');
  },

  irARegreso() {
    const auto = State.get().autoData;
    if (!auto) return;
    Nav.go('regreso');

    const geo  = State.get().geo;
    const dist = Geo.calcDistance(geo.lat, geo.lng, auto.lat, auto.lng);
    document.getElementById('reg-dir').textContent  = auto.dir;
    document.getElementById('reg-meta').textContent = auto.barrio + ' · Guardado ' + Utils.tRel(auto.ts);
    document.getElementById('reg-dist').textContent = Geo.formatDist(dist);
    document.getElementById('reg-walk').textContent = Geo.formatWalk(dist);

    Maps.initRegreso(auto.lat, auto.lng, geo.lat, geo.lng);
    Maps.invalidate('map-regreso');
  },

  confirmarBorrar() {
    if (!confirm('¿Ya encontraste el auto? Se borrará el lugar guardado.')) return;
    State.clearAuto();
    document.getElementById('state-guardado').classList.add('hidden');
    document.getElementById('state-empty').classList.remove('hidden');
    Nav.go('home');
  },

  compartir() {
    const auto = State.get().autoData;
    if (!auto) { UI.toast('No hay ningún lugar guardado.'); return; }
    const txt = `Guardé el auto con encontralo:\n${auto.dir}, ${auto.barrio}\nhttps://maps.google.com/?q=${auto.lat},${auto.lng}`;

    if (navigator.share) {
      navigator.share({ title: 'Mi auto está en', text: txt }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(txt)
        .then(() => UI.toast('Ubicación copiada ✓'))
        .catch(() => UI.toast(txt));
    }
  },

  abrirMaps() {
    const auto = State.get().autoData;
    if (!auto) return;
    window.open(`https://maps.google.com/maps?daddr=${auto.lat},${auto.lng}`, '_blank');
  },
};


/* ══════════════════════════════════════════════════════════
   NAV
   Router de pantallas.
══════════════════════════════════════════════════════════ */

const Nav = {

  go(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
      const isTarget = s.dataset.screen === screenId;
      s.classList.toggle('active', isTarget);
    });

    // Acciones al llegar a cada pantalla
    if (screenId === 'historial') Historial.render();
    if (screenId === 'perfil')    Perfil.update();
    if (screenId === 'guardar')   {} // ya lo maneja Guardar.open()
  },

  setTab(tab) {
    document.getElementById('nav-home').classList.toggle('active', tab === 'home');
    document.getElementById('nav-hist').classList.toggle('active', tab === 'historial');

    if (tab === 'home') {
      Nav.go('home');
    } else {
      Nav.go('historial');
    }
  },
};


/* ══════════════════════════════════════════════════════════
   HISTORIAL
══════════════════════════════════════════════════════════ */

const Historial = {

  async render() {
    const list  = document.getElementById('hist-list');
    const count = document.getElementById('hist-count');
    const auto  = State.get().autoData;

    // ═══ SUPABASE: cargar historial real ══════════════════
    // const user = State.get().user;
    // if (user) {
    //   const rows = await DB.loadHistory(user.id);
    //   State.set({ historial: rows.map(r => ({
    //     id: r.id, dir: r.dir, barrio: r.barrio,
    //     tipo: r.tipo, nota: r.nota, lat: r.lat, lng: r.lng,
    //     foto: r.foto_url, ts: new Date(r.created_at),
    //   })) });
    // }
    // ═════════════════════════════════════════════════════

    const items = State.get().historial;
    count.textContent = items.length + ' registros';

    if (!items.length) {
      list.innerHTML = `<div class="hist-empty">
        Todavía no guardaste ningún lugar.<br>
        La próxima vez que estaciones, tocá el botón y listo.
      </div>`;
      return;
    }

    list.innerHTML = items.map((h, i) => {
      const isActive = i === 0 && !!auto;
      const fecha    = Utils.fFecha(h.ts);
      return `
        <div class="hist-item ${isActive ? 'hist-item--active' : ''}">
          <div class="hist-thumb ${h.foto ? '' : 'hist-thumb--empty'}"
               ${h.foto ? `style="background-image:url(${h.foto});background-size:cover;background-position:center;"` : ''}>
            ${!h.foto ? `<svg width="18" height="12" viewBox="0 0 18 12" fill="none" opacity=".5">
              <rect x="1" y="4" width="16" height="7" rx="2" fill="#888780"/>
              <rect x="4" y="1" width="9" height="7" rx="2" fill="#888780"/>
            </svg>` : ''}
          </div>
          <div style="flex:1;min-width:0;">
            <div class="hist-row-header">
              <span class="hist-dir">${h.dir}</span>
              <span class="${isActive ? 'hist-badge' : 'hist-badge--old'}">${fecha}</span>
            </div>
            <p class="hist-meta">${h.barrio} · ${Utils.fHora(h.ts)} · ${h.tipo}</p>
            ${h.nota ? `<p class="hist-nota">${h.nota}</p>` : ''}
          </div>
        </div>`;
    }).join('');

    list.innerHTML += `<div class="hist-clear">
      <button class="hist-clear__btn" onclick="Historial.clear()">Borrar todo el historial</button>
    </div>`;
  },

  clear() {
    if (!confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) return;
    State.set({ historial: [] });
    this.render();
  },
};


/* ══════════════════════════════════════════════════════════
   PERFIL
══════════════════════════════════════════════════════════ */

const Perfil = {
  update() {
    const { user, historial } = State.get();
    if (!user) return;

    document.getElementById('perf-name').textContent  = user.name  || '—';
    document.getElementById('perf-email').textContent = user.email || '—';
    document.getElementById('perf-cant').textContent  = historial.length + ' lugares';

    // Avatar: foto de Google si hay, iniciales si no
    const av = document.getElementById('perf-av');
    if (user.avatar_url) {
      av.innerHTML = `<img src="${user.avatar_url}" alt="Avatar de ${user.name}">`;
    } else {
      const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      av.textContent = initials;
      document.getElementById('user-avatar').textContent = initials;
    }
  },
};


/* ══════════════════════════════════════════════════════════
   UI
   Helpers de interfaz.
══════════════════════════════════════════════════════════ */

const UI = {

  setLoginLoading(loading) {
    const btn = document.getElementById('btn-google');
    btn.disabled    = loading;
    btn.textContent = loading ? 'Ingresando...' : '';
    if (!loading) {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg> Continuar con Google`;
    }
  },

  updateUserUI(user) {
    const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('user-avatar').textContent = initials;
  },

  toggleSwitch(btn) {
    const isOn = btn.classList.contains('toggle--on');
    btn.classList.toggle('toggle--on',  !isOn);
    btn.classList.toggle('toggle--off',  isOn);
    btn.setAttribute('aria-pressed', String(!isOn));
  },

  toast(msg, duration = 2800) {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.getElementById('app').appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), duration);
  },
};


/* ══════════════════════════════════════════════════════════
   UTILS
   Funciones de formato y ayuda.
══════════════════════════════════════════════════════════ */

const Utils = {

  fHora(d) {
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  },

  fFecha(d) {
    const now  = new Date();
    const diff = now - d;
    if (diff < 86400000)  return 'Hoy';
    if (diff < 172800000) return 'Ayer';
    return d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0');
  },

  tRel(d) {
    const mins = Math.floor((Date.now() - d) / 60000);
    if (mins < 1)  return 'hace un momento';
    if (mins < 60) return `hace ${mins} min`;
    const hs = Math.floor(mins / 60), rm = mins % 60;
    return rm ? `hace ${hs}h ${rm}m` : `hace ${hs}h`;
  },

  clock() {
    const d = new Date();
    const t = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    document.querySelectorAll('.js-clock').forEach(el => { el.textContent = t; });
  },
};


/* ══════════════════════════════════════════════════════════
   INIT
   Punto de entrada — se ejecuta al cargar la página.
══════════════════════════════════════════════════════════ */

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

document.addEventListener('DOMContentLoaded', () => {

  // ─── Clock ───────────────────────────────────────────────
  Utils.clock();
  setInterval(Utils.clock, 15000);

  // ─── Navegación declarativa (data-to) ────────────────────
  document.querySelectorAll('.js-nav').forEach(el => {
    el.addEventListener('click', () => {
      const to = el.dataset.to;
      if (to === 'guardar') Guardar.open();
      else Nav.go(to);
    });
  });

  // ─── Botón FAB y "Guardar dónde estoy" ───────────────────
  document.querySelectorAll('.js-open-guardar').forEach(btn => {
    btn.addEventListener('click', () => Guardar.open());
  });

  // ─── Permisos GPS (slide 2 del onboarding) ───────────────
  document.getElementById('btn-perm')?.addEventListener('click', () => {
    Geo.getCurrentPosition().catch(() => {});
  });

  // ═══ SUPABASE: init client ═══════════════════════════════
  // DB.init();
  // ═════════════════════════════════════════════════════════

  // ─── Decidir pantalla inicial ────────────────────────────
  const onbDone = localStorage.getItem(CONFIG.ONB_KEY);
  const user    = Auth.restoreSession();

  if (!onbDone) {
    localStorage.setItem(CONFIG.ONB_KEY, '1');
    Nav.go('onb1');
  } else if (!user) {
    Nav.go('login');
  } else {
    UI.updateUserUI(user);
    Nav.go('home');
    // Intentar obtener ubicación en segundo plano
    Geo.getCurrentPosition().catch(() => {});
  }

  // ─── Service Worker (PWA) ────────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

});
