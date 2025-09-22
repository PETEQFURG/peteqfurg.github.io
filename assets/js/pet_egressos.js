(function () {
  function initOne(root) {
    if (!root) return;
    var tbl = root.querySelector('#pet-eg-tbl, table');
    var q = root.querySelector('#pet-eg-q, .pet-search');
    var count = root.querySelector('#pet-eg-count, .pet-count');
    if (!tbl) return;

    var rows = Array.prototype.slice.call(tbl.tBodies[0].rows || []);
    function updateCount() {
      if (!count) return;
      var visible = rows.filter(function (r) { return r.style.display !== 'none'; }).length;
      count.textContent = visible + ' de ' + rows.length;
    }
    updateCount();

    // Search/filter
    if (q) {
      q.addEventListener('input', function () {
        var term = (q.value || '').trim().toLowerCase();
        rows.forEach(function (r) {
          var text = r.textContent.toLowerCase();
          r.style.display = text.indexOf(term) !== -1 ? '' : 'none';
        });
        updateCount();
      });
    }

    // Sort
    function getCellValue(row, idx) { return row.children[idx].textContent.trim(); }
    function comparer(idx, asc) {
      return function (a, b) {
        var v1 = getCellValue(asc ? a : b, idx);
        var v2 = getCellValue(asc ? b : a, idx);
        var n1 = parseFloat(v1.replace(/[^0-9.-]/g,''));
        var n2 = parseFloat(v2.replace(/[^0-9.-]/g,''));
        if (!isNaN(n1) && !isNaN(n2)) return n1 - n2;
        return v1.localeCompare(v2, 'pt-BR', { sensitivity: 'base' });
      };
    }
    var ths = (tbl.tHead && tbl.tHead.rows[0]) ? Array.prototype.slice.call(tbl.tHead.rows[0].cells) : [];
    ths.forEach(function (th, idx) {
      if (!th.classList.contains('pet-sortable')) return;
      var asc = true;
      th.addEventListener('click', function () {
        rows.sort(comparer(idx, asc));
        asc = !asc;
        rows.forEach(function (r) { tbl.tBodies[0].appendChild(r); });
      });
    });
  }

  // Public API
  window.PetEgressosInit = function (selectorOrElement) {
    if (!selectorOrElement) return;
    var el = (typeof selectorOrElement === 'string') ? document.querySelector(selectorOrElement) : selectorOrElement;
    initOne(el);
  };

  // Auto-init all .pet-eg sections on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.pet-eg').forEach(initOne);
    });
  } else {
    document.querySelectorAll('.pet-eg').forEach(initOne);
  }
})();