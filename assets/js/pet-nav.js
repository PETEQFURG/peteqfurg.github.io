
// PET/EQ Navegação Unificada — v1
document.addEventListener('DOMContentLoaded', function(){
  // Menu horizontal (topo)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.navbar-horizontal .nav-menu');
  if (navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Sidebar (menu lateral)
  const sideBtn = document.querySelector('.sidebar-toggle');
  let backdrop = null;
  function openSidebar(){
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      backdrop.addEventListener('click', closeSidebar);
      document.body.appendChild(backdrop);
    }
    document.body.classList.add('sidebar-open');
    sideBtn && sideBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar(){
    document.body.classList.remove('sidebar-open');
    sideBtn && sideBtn.setAttribute('aria-expanded', 'false');
    if(backdrop){ backdrop.remove(); backdrop = null; }
  }
  sideBtn && sideBtn.addEventListener('click', () => {
    document.body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) closeSidebar();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && document.body.classList.contains('sidebar-open')) closeSidebar();
  });

  // Rótulos (opcional — já usado no index)
  if (navToggle){
    navToggle.setAttribute('title', 'Menu superior');
    navToggle.setAttribute('aria-label', 'Abrir/fechar menu superior');
  }
  if (sideBtn){
    sideBtn.setAttribute('title', 'Menu lateral');
    sideBtn.setAttribute('aria-label', 'Abrir/fechar menu lateral');
  }
});
