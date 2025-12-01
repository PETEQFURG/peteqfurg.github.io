// ../assets/js/calendar.js
(function () {
  const CAL_ID   = 'calendario';
  const PANEL_ID = 'eventos-do-dia';
  // URL robusta; se precisar, defina window.__PET_EVENTS_URL antes de importar este arquivo
  const depth = window.location.pathname.split('/').length - 2;
const prefix = '../'.repeat(depth > 0 ? depth - 1 : 0);
const JSON_URL = window.__PET_EVENTS_URL || `${prefix}assets/data/eventos.json`;

  const LOCALE   = 'pt-br';

  // --------- Cores por dimensão (CSS var com fallback) ----------
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const DIM_COLORS = {
    1: cssVar('--dim1-color', '#1f77b4'),
    2: cssVar('--dim2-color', '#ff7f0e'),
    3: cssVar('--dim3-color', '#2ca02c'),
    4: cssVar('--dim4-color', '#d62728'),
    5: cssVar('--dim5-color', '#9467bd'),
    6: cssVar('--dim6-color', '#00838f')
  };

  // --------- helpers ----------
  const byId = (id) => document.getElementById(id);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const endOfDay   = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  const isAllDayISO = (iso) => typeof iso === 'string' && !iso.includes('T');

  function overlapsDay(ev, day) {
    const s = startOfDay(new Date(ev.start));
    const e = endOfDay(new Date(ev.end || ev.start));
    const t = startOfDay(day);
    return t >= s && t <= e;
  }

  function getCheckedDimensoes() {
    return Array
      .from(document.querySelectorAll('#filtros-dimensoes input:checked'))
      .map((c) => parseInt(c.value, 10));
  }

  function eventHasAnyDim(ev, dims) {
    const eDims = (ev.extendedProps && ev.extendedProps.dimensao) || [];
    if (!dims.length) return true;
    return eDims.some((d) => dims.includes(d));
  }

  // --------- cartão "eventos do dia" ----------
  function dataExtenso(dateObj) {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    return `${dateObj.getDate()} de ${meses[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
  }

  function renderEventosDoDia(panelEl, fcEvents, date, dimsSel) {
    const list = fcEvents
      .filter((ev) => eventHasAnyDim(ev, dimsSel) && overlapsDay(ev, date))
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    if (!panelEl) return;
    if (!list.length) {
      panelEl.innerHTML =
        `<div class="eventos-info"><strong>Nenhum evento em ${date.toLocaleDateString('pt-BR')}</strong>.</div><p>&nbsp;</p>`;
      return;
    }

    const itens = list.map((ev) => {
      const d1 = new Date(ev.start);
      const d2 = new Date(ev.end || ev.start);
      const horas = ev.allDay
        ? 'dia inteiro'
        : `${d1.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })}–${d2.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })} h`;

      const dims = (ev.extendedProps.dimensao || []).map((d) => `D${d}`).join(', ');
      const local = ev.extendedProps.local ? ` • <em>${ev.extendedProps.local}</em>` : '';
      const link  = ev.extendedProps.link ? ` — <a href="${ev.extendedProps.link}" target="_blank" rel="noopener">detalhes</a>` : '';

      const titulo = ev.extendedProps.tituloOriginal || ev.title;
      const desc   = ev.extendedProps.descricao ? `<br><span>${ev.extendedProps.descricao}</span>` : '';

      return `<li><strong>${titulo}</strong> (${horas}${local}) — <small>${dims}</small>${link}${desc}</li>`;
    }).join('');

    panelEl.innerHTML =
      `<div class="eventos-info">Eventos em <strong>${dataExtenso(date)}</strong>:</div><ul>${itens}</ul>`;
  }

  // --------- CSS para cabeçalho da semana e chips ----------
  (function injectCSS() {
    const id = 'fc-pet-headers';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .fc-timegrid .fc-col-header-cell-cushion{
        display:flex; flex-direction:column; align-items:center; gap:2px; white-space:nowrap;
      }
      .fc-timegrid .fc-col-header-cell-cushion .fc-wd{ font-weight:700; }
      .fc-timegrid .fc-col-header-cell-cushion .fc-dm{ font-size:.85em; opacity:.9; }
      .fc .fc-daygrid-event, .fc .fc-timegrid-event { font-size:12px; border-radius:8px; padding:2px 6px; }
    `;
    document.head.appendChild(s);
  })();

  // --------- bootstrap ----------
  async function bootstrap() {
    const calEl   = byId(CAL_ID);
    const panelEl = byId(PANEL_ID);
    if (!calEl) return;

    // === carrega eventos (robusto a subpastas) ===
    let raw = [];
    try {
      const res = await fetch(JSON_URL, { cache: 'no-store' });
      if (res.ok) raw = await res.json();
    } catch (e) { /* fallback abaixo */ }

    // fallback: suporta formato antigo (window.__eventosDim)
    if (!Array.isArray(raw) || !raw.length) {
      if (Array.isArray(window.__eventosDim)) {
        raw = window.__eventosDim.map(e => ({
          id: e.id,
          titulo: e.title,
          descricao: e.description || '',
          inicio: e.date,
          fim: e.end || e.date,
          local: e.local || '',
          status: e.status || 'planejado',
          dimensao: Array.isArray(e.dimensao) ? e.dimensao : [e.dimensao],
          link: e.link || ''
        }));
      } else {
        raw = [];
      }
    }

    // converte para eventos do FullCalendar
    const fcEvents = raw.map((ev) => {
      const allDay = isAllDayISO(ev.inicio);
      const dims   = Array.isArray(ev.dimensao) ? ev.dimensao : [];
      const d0     = dims.length ? dims[0] : null;
      const color  = DIM_COLORS[d0] || '#777';

      return {
        id: ev.id || (Math.random() + '').slice(2),
        title: d0 ? `D${d0}` : 'D?',
        start: ev.inicio,
        end: ev.fim || ev.inicio,
        allDay,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          tituloOriginal: ev.titulo || 'Evento',
          descricao: ev.descricao || '',
          local: ev.local || '',
          status: ev.status || 'planejado',
          dimensao: dims,
          link: ev.link || ''
        }
      };
    });

    let dimsSel = getCheckedDimensoes();

    const calendar = new FullCalendar.Calendar(calEl, {
      locale: LOCALE,
      initialView: 'dayGridMonth',
      height: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listMonth'
      },
      buttonText: { today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia', list: 'Lista' },

      views: {
        dayGridMonth: { displayEventTime: false, dayHeaderFormat: { weekday: 'short' } },
        timeGridWeek: {
          slotMinTime: '08:00:00',
          slotMaxTime: '20:00:00',
          allDaySlot: false,
          expandRows: true,
          dayHeaderContent: (arg) => {
            const d  = arg.date;
            const wd = d.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dm = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            return { html: `<span class="fc-wd">${wd}</span><span class="fc-dm">${dm}</span>` };
          },
          slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false }
        },
        listMonth: { displayEventTime: true }
      },

      // fonte de eventos com filtro
      events: function(info, success) {
        const filtered = dimsSel.length
          ? fcEvents.filter((ev) => eventHasAnyDim(ev, dimsSel))
          : fcEvents.slice();
        success(filtered);
      },

      // chip “limpo” (apenas D# e cor da dimensão) + tooltip com título completo
      eventDidMount: function(arg) {
        const time = arg.el.querySelector('.fc-event-time'); if (time) time.remove();
        const dot  = arg.el.querySelector('.fc-event-dot');  if (dot)  dot.remove();

        const dims = (arg.event.extendedProps && arg.event.extendedProps.dimensao) || [];
        const color = DIM_COLORS[dims[0]] || '#777';
        arg.el.style.backgroundColor = color;
        arg.el.style.borderColor = color;
        arg.el.style.color = '#fff';
        arg.el.style.borderRadius = '8px';
        arg.el.style.padding = '2px 6px';
        arg.el.style.whiteSpace = 'nowrap';
        arg.el.style.overflow = 'hidden';
        arg.el.style.textOverflow = 'ellipsis';

        const titleEl =
          arg.el.querySelector('.fc-event-title') ||
          arg.el.querySelector('.fc-list-event-title');
        if (titleEl) {
          const d0 = dims.length ? dims[0] : '?';
          titleEl.textContent = `D${d0}`;
        }

        // título completo como tooltip
        const fullTitle = arg.event.extendedProps.tituloOriginal || arg.event.title;
        arg.el.setAttribute('title', fullTitle);

        // na LISTA, acrescenta “ h” ao horário
        const listTime = arg.el.querySelector('.fc-list-event-time');
        if (listTime && !listTime.dataset.hApplied) {
          listTime.textContent = listTime.textContent.trim() + ' h';
          listTime.dataset.hApplied = '1';
        }
      },

      dateClick: function(arg) { renderEventosDoDia(byId(PANEL_ID), fcEvents, arg.date, dimsSel); },
      eventClick: function(arg){ renderEventosDoDia(byId(PANEL_ID), fcEvents, arg.event.start, dimsSel); }
    });

    calendar.render();

    // filtros (calendário + cartão)
    const filtrosEl = byId('filtros-dimensoes');
    if (filtrosEl) {
      filtrosEl.addEventListener('change', () => {
        dimsSel = getCheckedDimensoes();
        calendar.refetchEvents();

        const panel = byId(PANEL_ID);
        const strong = panel ? panel.querySelector('.eventos-info strong') : null;
        if (strong) {
          const [dia, , mesTexto, , ano] = strong.textContent.split(' ');
          const meses = { janeiro:0, fevereiro:1, março:2, abril:3, maio:4, junho:5,
                          julho:6, agosto:7, setembro:8, outubro:9, novembro:10, dezembro:11 };
          const d = new Date(parseInt(ano,10), meses[mesTexto], parseInt(dia,10));
          renderEventosDoDia(panel, fcEvents, d, dimsSel);
        }
      });
    }

    // reflow suave
    function reflow() { try { window.dispatchEvent(new Event('resize')); } catch(e) {} }
    setTimeout(reflow, 50);
    setTimeout(reflow, 250);
    window.addEventListener('orientationchange', () => setTimeout(reflow, 60));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();

// ====== Filtros para CARDS do DOM (fora do calendário) – RESTAURADO ======
(function(){
  const filtros = document.querySelectorAll('#filtros-dimensoes input[type="checkbox"]');
  if (!filtros.length) return;

  const ativos = () =>
    new Set(Array.from(filtros).filter(cb => cb.checked).map(cb => String(cb.value)));

  function applyDOM(){
    const on = ativos();
    document.querySelectorAll('[data-dimension]').forEach(el => {
      el.style.display = on.has(String(el.dataset.dimension)) ? '' : 'none';
    });
  }

  filtros.forEach(cb => cb.addEventListener('change', applyDOM));
  // roda uma vez após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDOM);
  } else {
    applyDOM();
  }
})();
