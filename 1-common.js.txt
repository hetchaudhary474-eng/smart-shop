const SHOP = "Smart Shop", OWNER = "Owner :- HET CHAUDHARY";
const $ = id => document.getElementById(id);
const el = (tag, props = {}, ...kids) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
const CATS = [["🪁", "Patang", "પતંગ"], ["🧵", "Firki", "ફીરકી"], ["🩹", "Finger Tape", "ફિંગર ટેપ"], ["🕶️", "Chashma", "ચશ્મા"], ["🧢", "Cap", "કેપ"]];
const guess = n => [/patang|પતંગ/i, /firki|manja|dori|ફીરકી|દોરી/i, /tape|bandage|ટેપ/i, /chashm|ચશ્મા/i, /\bcap\b|topi|કેપ/i].findIndex(r => r?.test(n));
const category = x => Number.isInteger(x?.c) && x.c >= 0 && x.c < CATS.length ? x.c : guess(String(x?.n)) < 0 ? 1 : guess(String(x?.n));
const clean = data => ({
items: (Array.isArray(data?.items) ? data.items : []).slice(0, 100).map(x => ({
c: category(x), n: String(x?.n ?? "").slice(0, 60), p: Math.max(0, Math.min(1e6, +x?.p || 0)), out: !!x?.out,
img: /^images\/[a-z0-9-]+\.jpg$/.test(x?.img) ? x.img : "" })),
offer: String(data?.offer ?? "").slice(0, 200),
phone: /^\d{10}$/.test(data?.phone) ? data.phone : ""
});
const round = n => +n.toFixed(2);
function stepper(value, name, onChange) {
const input = el("input", { type: "number", min: 0, max: 999, inputMode: "numeric", value });
input.setAttribute("aria-label", name);
const set = v => { const q = Math.max(0, Math.min(999, Math.floor(+v || 0))); input.value = q; onChange(q); };
input.oninput = () => set(input.value);
const btn = (text, step, label) => { const b = el("button", { type: "button", textContent: text, onclick: () => set(+input.value + step) }); b.setAttribute("aria-label", name + " " + label); return b; };
return el("div", { className: "qty" }, btn("\u2212", -1, "kam karo"), input, btn("+", 1, "jodo"));
}
const daysLeft = () => { const d = new Date(); return Math.round((Date.UTC(2027, 0, 14) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5); };
function link(a, text, phone) {
a.setAttribute("aria-disabled", String(!text));
if (text) a.href = `https://wa.me/${phone ? "91" + phone : ""}?text=${encodeURIComponent(text)}`; else a.removeAttribute("href");
}
function copy(src, status, done, selected) {
const fail = () => { getSelection().selectAllChildren($(src)); $(status).textContent = selected; };
if (!navigator.clipboard) return fail();
navigator.clipboard.writeText($(src).textContent).then(() => { $(status).textContent = done; }, fail);
}
const cards = {};
function photoButton(k, name) {
$(k + "make").addEventListener("click", async () => {
try { await document.fonts.load('700 60px "Baloo 2"'); await document.fonts.load('800 60px "Baloo 2"'); } catch {}
if (!cards[k]) return;
const url = draw(cards[k]).toDataURL("image/png");
$(k + "img").src = url; $(k + "save").href = url; $(k + "save").download = `smart-shop-${name}.png`; $(k + "photo").hidden = false;
});
}
function boxes(lang, count) {
$("boxes").replaceChildren(...CATS.map(([icon, hi, gu], i) => el("a", { className: "box", href: "#c" + i },
el("span", { className: "icon", textContent: icon }), el("b", { textContent: lang === "gu" ? gu : hi }), count ? el("small", { textContent: count(i) }) : "")));
}
let current = 0;
function route(onChange) {
const apply = () => {
const hash = location.hash.slice(1), cat = /^c[0-4]$/.test(hash);
const view = cat ? "cat" : ["home", "order", "wish", "more"].includes(hash) ? hash : "";
if (cat) current = +hash[1];
$("cover").hidden = !!view; $("app").hidden = !view;
document.querySelectorAll("[data-view]").forEach(e => { e.hidden = !e.dataset.view.split(" ").includes(view); });
onChange(view); scrollTo(0, 0);
};
addEventListener("hashchange", apply); apply();
}
function draw(card) {
const W = 1080, rowH = 84, top = 430, n = card.msg ? 0 : card.rows.length + (card.total ? 1 : 0);
const H = Math.max(1350, top + n * rowH + 330);
const c = Object.assign(document.createElement("canvas"), { width: W, height: H }), g = c.getContext("2d");
const font = (px, w = 700) => g.font = `${w} ${px}px "Baloo 2", sans-serif`;
const say = (t, x, y, max, align = "center") => { g.textAlign = align; g.fillText(t, x, y, max); };
const sky = g.createLinearGradient(0, 0, 0, H);
sky.addColorStop(0, "#6fc3f2"); sky.addColorStop(.6, "#bfe6fb"); sky.addColorStop(1, "#ffb066");
g.fillStyle = sky; g.fillRect(0, 0, W, H);
const shape = (pts, color) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = color; g.fill(); };
const kite = (x, y, k, r, a, b) => {
g.save(); g.translate(x, y); g.rotate(r); g.scale(k, k);
shape([[0,-50],[40,-10],[0,42],[-40,-10]], a); shape([[0,-50],[40,-10],[0,-10]], b); shape([[-40,-10],[0,-10],[0,42]], b); shape([[0,42],[-9,56],[9,56]], a);
g.strokeStyle = "#0b2540"; g.lineWidth = 2; g.beginPath(); g.moveTo(0,-50); g.lineTo(0,42); g.moveTo(-40,-10); g.quadraticCurveTo(0,-34,40,-10); g.moveTo(0,56); g.quadraticCurveTo(-18,72,0,90); g.stroke();
g.restore();
};
if (card.msg) {
g.save(); g.translate(W / 2, H / 2); g.rotate(-.45); g.globalAlpha = .13; g.fillStyle = "#0b2540"; font(78);
for (let r = -8; r <= 8; r++) for (let col = -2; col <= 2; col++) say(SHOP, col * 540 + (r % 2 ? 270 : 0), r * 130, 480);
g.restore();
}
kite(120, 130, 1.5, -.35, "#c2185b", "#ffcb3d"); kite(965, 140, 1.5, .4, "#128a5a", "#ff7a45");
g.fillStyle = "#0b2540"; font(120); say(SHOP, W / 2, 180, 700);
font(48); say("Uttarayan Utsav", W / 2, 260, 700);
if (card.msg) {
g.fillStyle = "rgba(255,255,255,.9)"; g.fillRect(80, 370, W - 160, 620);
g.fillStyle = "#c2185b"; font(82); say("Happy Uttarayan!", W / 2, 500, 840);
font(54); const lines = [""];
card.msg.split(" ").forEach(word => {
const i = lines.length - 1, next = (lines[i] + " " + word).trim();
if (lines[i] && g.measureText(next).width > 800) lines.push(word); else lines[i] = next;
});
g.fillStyle = "#10263f";
lines.forEach((t, i) => say(t, W / 2, 690 - (lines.length - 2) * 40 + i * 80, 840));
if (card.from) { font(46); say("Shubhechhak: " + card.from, W / 2, 940, 840); }
kite(W / 2, 1075, 1.25, .2, "#2447d8", "#ffffff");
g.fillStyle = "#0b2540"; g.fillRect(0, H - 165, W, 165);
g.fillStyle = "#ffffff"; font(40); say(SHOP + " ki taraf se", W / 2, H - 108, 1000);
g.fillStyle = "#ffcb3d"; font(68, 800); say(OWNER, W / 2, H - 34, 1000);
return c;
}
g.fillStyle = "#ffffff"; g.beginPath(); g.rect(60, 310, W - 120, H - 540); g.fill();
g.fillStyle = "#c2185b"; g.fillRect(60, 310, W - 120, 100);
g.fillStyle = "#ffffff"; font(50); say(card.head, 100, 378, 520, "left"); say(card.date, W - 100, 378, 320, "right");
card.rows.forEach(([name, price], i) => {
const y = top + 56 + i * rowH;
g.fillStyle = "#10263f"; font(46); say(name, 100, y, 640, "left");
g.fillStyle = "#c2185b"; say(price, W - 100, y, 220, "right");
g.fillStyle = "#cfe0ee"; g.fillRect(100, y + 24, W - 200, 2);
});
if (card.total) { const y = top + 66 + card.rows.length * rowH; g.fillStyle = "#10263f"; font(60); say("Total", 100, y, 500, "left"); say(card.total, W - 100, y, 350, "right"); }
g.fillStyle = "#0b2540"; g.fillRect(0, H - 180, W, 180);
g.fillStyle = "#ffcb3d"; font(60); say(card.total ? "Dhanyavaad!" : "Order ke liye message karo", W / 2, H - 68, 1000);
return c;
  }
