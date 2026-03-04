const root = document.documentElement;

// theme toggle
function setTheme(t){
  root.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}
function toggleTheme(){
  const current = root.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}
document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);
setTheme(localStorage.getItem("theme") || "dark");

// year
document.getElementById("year").textContent = new Date().getFullYear();

// --- EDIT THESE DETAILS ---
const BUSINESS = {
  phoneE164: "+10000000000",
  phoneDisplay: "(000) 000-0000",
  email: "crossroadautodetail@example.com",
  hours: "Mon–Sat: 9am–6pm • Sun: Closed",
  locationShort: "Your City, State",
  address: "123 Main St, Your City, ST"
};

document.getElementById("phoneLink").href = `tel:${BUSINESS.phoneE164}`;
document.getElementById("phoneLink").textContent = BUSINESS.phoneDisplay;

document.getElementById("callTop").href = `tel:${BUSINESS.phoneE164}`;

document.getElementById("emailLink").href = `mailto:${BUSINESS.email}`;
document.getElementById("emailLink").textContent = BUSINESS.email;

document.getElementById("hoursText").textContent = BUSINESS.hours;
document.getElementById("locationText").textContent = BUSINESS.locationShort;
document.getElementById("addressText").textContent = BUSINESS.address;

// quote form (mailto)
const quoteForm = document.getElementById("quoteForm");
const formHint = document.getElementById("formHint");

quoteForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(quoteForm);

  const name = (data.get("name") || "").toString().trim();
  const contact = (data.get("contact") || "").toString().trim();
  const service = (data.get("service") || "").toString().trim();
  const msg = (data.get("msg") || "").toString().trim();

  const subject = encodeURIComponent(`Quote Request — ${service}`);
  const body = encodeURIComponent(
`name: ${name}
contact: ${contact}
service: ${service}

message:
${msg || "(none)"}

— sent from crossroad terminal site`
  );

  window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
  if (formHint) formHint.textContent = "opening email app… ✅";
});

// --- SLIDE NAV / PAGE SWITCHER ---
const pages = document.querySelectorAll(".page");
const navBtns = document.querySelectorAll(".navBtn");
const cmdText = document.getElementById("cmdText");
const pagePath = document.getElementById("pagePath");
const statusText = document.getElementById("statusText");

let currentPage = "home";

function showPage(nextPage){
  if (nextPage === currentPage) return;

  const currEl = document.querySelector(`.page[data-page="${currentPage}"]`);
  const nextEl = document.querySelector(`.page[data-page="${nextPage}"]`);

  if (!currEl || !nextEl) return;

  // decide direction based on nav order
  const order = ["home","services","work","reviews","contact"];
  const dir = order.indexOf(nextPage) > order.indexOf(currentPage) ? "right" : "left";

  currEl.classList.remove("show");
  currEl.classList.add(dir === "right" ? "exitLeft" : "exitRight");

  // prep next
  nextEl.classList.remove("exitLeft","exitRight");
  nextEl.classList.add("show");

  // cleanup old after animation
  setTimeout(() => {
    currEl.classList.remove("exitLeft","exitRight");
  }, 320);

  currentPage = nextPage;

  // nav active states
  navBtns.forEach(b => b.classList.toggle("active", b.dataset.page === nextPage));

  // terminal header text
  if (pagePath) pagePath.textContent = nextPage;
  if (cmdText) cmdText.textContent = `open ${nextPage}`;
  if (statusText){
    statusText.textContent = "LOADING";
    setTimeout(() => statusText.textContent = "READY", 240);
  }

  // small haptic-like vibe
  try { navigator.vibrate?.(15); } catch {}
}

// nav buttons
navBtns.forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// buttons inside pages that jump pages
document.querySelectorAll("[data-page].btn").forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});
