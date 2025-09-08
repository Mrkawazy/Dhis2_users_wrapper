// Small, dependency-free interactions
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const cards = $("#cards");
  const tabs = $$(".tab");
  const viewAllBtn = $("#viewAllToggle");
  const themeBtn = $("#themeToggle");
  const aboutLink = $("#aboutLink");
  const aboutDialog = $("#aboutDialog");
  const yearEl = $("#year");
  yearEl.textContent = new Date().getFullYear();

  function setActive(slug){
    tabs.forEach(t => {
      const active = t.dataset.target === slug;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", String(active));
    });
    $$(".card").forEach(c => c.classList.toggle("active", c.id === `panel-${slug}`));
    // Update hash for deep link
    history.replaceState(null, "", `#${slug}`);
  }

  // Deep-link on load (#campaign/#cbs/#nhis)
  const hash = (location.hash || "").replace("#","");
  if(["campaign","cbs","nhis"].includes(hash)){
    setActive(hash);
  }else{
    setActive("campaign");
  }

  tabs.forEach(t => t.addEventListener("click", () => setActive(t.dataset.target)));

  // View all toggles grid & shows all cards
  viewAllBtn.addEventListener("click", () => {
    const on = viewAllBtn.getAttribute("aria-pressed") === "true";
    viewAllBtn.setAttribute("aria-pressed", String(!on));
    cards.classList.toggle("view-all", !on);
    if(!on){ // entering view-all; ensure all cards are visible
      $$(".card").forEach(c => c.classList.add("active"));
    }else{   // leaving view-all; revert to current tab
      const active = $(".tab.active")?.dataset.target || "campaign";
      $$(".card").forEach(c => c.classList.toggle("active", c.id === `panel-${active}`));
    }
  });

  // Copy link and reload per-card
  cards.addEventListener("click", (e)=>{
    const btn = e.target.closest("button");
    if(!btn) return;
    if(btn.dataset.action === "reload"){
      const id = btn.dataset.frame;
      const frame = document.getElementById(id);
      if(frame){ frame.src = frame.src; }
    }
    if(btn.dataset.action === "copylink"){
      const slug = btn.dataset.slug;
      const url = new URL(location.href);
      url.hash = slug;
      navigator.clipboard.writeText(url.toString()).then(()=>{
        btn.textContent = "Copied!";
        setTimeout(()=> btn.textContent = "Copy Link", 1000);
      });
    }
  });

  // About modal
  aboutLink.addEventListener("click", (e)=>{
    e.preventDefault();
    aboutDialog.showModal();
  });

  // Theme toggle (persist in localStorage)
  const THEME_KEY = "tableau_site_theme";
  function applyTheme(theme){
    if(theme === "light"){
      document.documentElement.classList.add("light");
    }else{
      document.documentElement.classList.remove("light");
    }
  }
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(saved);
  themeBtn.addEventListener("click", ()=>{
    const next = document.documentElement.classList.contains("light") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
})();
