document.addEventListener('DOMContentLoaded', function () {
  // 🎨 Cores por dimensão
  const coresPorDimensao = {
    1: "#1f77b4",
    2: "#ff7f0e",
    3: "#2ca02c",
    4: "#d62728",
    5: "#9467bd",
    6: "#8c564b"
  };

  // 📅 Eventos vêm do eventos.js (global para todas as páginas)
  const eventosOriginais = Array.isArray(window.__eventosDim) ? window.__eventosDim : [];

  // 🗓️ Data por extenso (para o painel "eventos do dia")
  function dataExtenso(iso) {
    const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
    const [Y, M, D] = iso.split("-");
    return `${parseInt(D,10)} de ${meses[parseInt(M,10)-1]} de ${Y}`;
  }

  // 🔄 Mapeia evento → FullCalendar
  function toFC(ev) {
    const cor = coresPorDimensao[ev.dimensao] || "#777";
    return {
      title: ev.title,
      start: ev.date,
      description: ev.description,
      backgroundColor: cor,
      borderColor: cor,
      extendedProps: { dimensao: ev.dimensao, dimension: ev.dimensao }
    };
  }

  // ✅ Renderiza “eventos do dia” (se a área existir)
  function renderEventosDia(iso) {
    const box = document.getElementById("eventos-do-dia");
    if (!box) return;
    const ativas = selecionadasDimensoes();
    const list = eventosOriginais.filter(e => e.date === iso && ativas.includes(e.dimensao));
    box.innerHTML =
      `<h2>Evento(s) do dia</h2><p><strong>${dataExtenso(iso)}</strong></p>` +
      (list.length
        ? list.map(e => `<p><strong>${e.title}</strong>: ${e.description}</p>`).join("")
        : `<p>Nenhum evento nas dimensões selecionadas.</p>`);
  }

  // 🔘 Dimensões selecionadas
  function selecionadasDimensoes() {
    return Array.from(document.querySelectorAll("#filtros-dimensoes input:checked"))
      .map(c => parseInt(c.value, 10));
  }

  // 🖥️ Inicializa o calendário se existir o container
  const calendarioEl = document.getElementById("calendario");
  if (calendarioEl) {
    const calendar = new FullCalendar.Calendar(calendarioEl, {
      initialView: "dayGridMonth",
      locale: "pt-br",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listMonth",
      },
      buttonText: { today: "Hoje", month: "Mês", week: "Semana", day: "Dia", list: "Lista" },
      height: "auto",

      // Formatos/ajustes por view
      views: {
        // MÊS: apenas abreviação do dia da semana
        dayGridMonth: {
          dayHeaderFormat: { weekday: 'short' }
        },

        // SEMANA: dia abreviado + data em 2 linhas (sem vírgula)
        timeGridWeek: {
          slotMinTime: "08:00:00",
          slotMaxTime: "20:00:00",
          allDaySlot: false,
          expandRows: true,
          dayHeaderContent: (arg) => {
            const d  = arg.date;
            const wd = d.toLocaleDateString('pt-BR', { weekday: 'short' });             // ex.: "dom."
            const dm = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); // ex.: "28/09"
            // sem <br>; empilhado via CSS (flex column) e sem quebras indevidas
            return { html: `<span class="fc-wd">${wd}</span><span class="fc-dm">${dm}</span>` };
          }
        },

        // DIA: dia por extenso + data
        timeGridDay: {
          slotMinTime: "08:00:00",
          slotMaxTime: "20:00:00",
          allDaySlot: false,
          expandRows: true,
          dayHeaderFormat: { weekday: 'long', day: '2-digit', month: '2-digit' }
        }
      },

      events: eventosOriginais
        .filter(e => selecionadasDimensoes().includes(e.dimensao))
        .map(toFC),

      dateClick: (info) => renderEventosDia(info.dateStr),
      eventClick: (info) => renderEventosDia(info.event.start.toISOString().split("T")[0]),
    });

    window.calendar = calendar; // útil para depuração/ganchos
    calendar.render();

    // Atualiza ao mudar filtros
    const filtrosEl = document.getElementById("filtros-dimensoes");
    if (filtrosEl) {
      filtrosEl.addEventListener("change", () => {
        calendar.removeAllEvents();
        const filtrados = eventosOriginais
          .filter(e => selecionadasDimensoes().includes(e.dimensao))
          .map(toFC);
        calendar.addEventSource(filtrados);
      });
    }
  }

  // 📐 Reflow para corrigir resize/orientação
  function reflow() {
    try { window.dispatchEvent(new Event("resize")); } catch (e) {}
  }
  setTimeout(reflow, 50);
  setTimeout(reflow, 250);
  window.addEventListener("orientationchange", () => setTimeout(reflow, 60));
});

// ====== Filtros para cards do DOM (fora do calendário) ======
(function(){
  const filtros = document.querySelectorAll('#filtros-dimensoes input[type="checkbox"]');
  if (!filtros.length) return;

  const ativos = () => new Set(Array.from(filtros).filter(cb => cb.checked).map(cb => cb.dataset.dim || cb.value));

  function applyDOM(){
    const on = ativos();
    document.querySelectorAll('[data-dimension]').forEach(el => {
      el.style.display = on.has(String(el.dataset.dimension)) ? '' : 'none';
    });
  }

  filtros.forEach(cb => cb.addEventListener('change', applyDOM));
  document.addEventListener('DOMContentLoaded', applyDOM);
})();
