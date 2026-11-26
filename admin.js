const SHOP = "Smart Shop", OWNER = "Owner :- HET CHAUDHARY";
// Pehli baar ke example rate. Save ke baad app saved rate dikhata hai.
let items = [{n:"Patang (10 ka set)",p:60},{n:"Firki 5000 m",p:1300},{n:"Cotton manja",p:800},{n:"Cap",p:60},{n:"Chashma",p:50}];
let qty = [], dirty = false, store = null;
const cards = {};
const $ = id => document.getElementById(id);
const now = new Date(), today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
const left = Math.round((Date.UTC(2027, 0, 14) - today) / 864e5);
$("days").textContent = left > 0 ? left + " din" : left === 0 ? "Aaj hai!" : "Ho gaya";
$("when").textContent = left > 0 ? "baaki, 14 January 2027 tak" : "14 January 2027";
const clean = list => list.slice(0, 100).map(x => ({ n: String(x?.n ?? "").slice(0, 60), p: Math.max(0, Math.min(1e6, +x?.p || 0)) }));
function field(parent, props) {
const el = Object.assign(document.createElement(props.tag || "input"), props);
delete el.tag;
parent.appendChild(el);
return el;
}
function changed() { dirty = true; $("savestatus").textContent = "Badlav abhi save nahi hua."; render(); }
function build() {
$("rates").textContent = $("items").textContent = "";
items.forEach((it, i) => {
const row = field($("rates"), { tag: "div", className: "rate" });
const n = field(row, { id: "n" + i, value: it.n, placeholder: "Saaman" });
n.setAttribute("aria-label", "Saaman ka naam");
const p = field(row, { id: "p" + i, type: "number", min: 0, inputMode: "decimal", value: it.p || "", placeholder: "₹" });
p.setAttribute("aria-label", "Rate");
const x = field(row, { tag: "button", type: "button", textContent: "×" });
x.setAttribute("aria-label", "Saaman hatao");
n.oninput = () => { it.n = n.value; changed(); };
p.oninput = () => { it.p = Math.max(0, +p.value || 0); changed(); };
x.onclick = () => { items.splice(i, 1); qty.splice(i, 1); build(); changed(); };
const l = field($("items"), { tag: "label", className: "item" });
field(l, { tag: "span", id: "s" + i });
const q = field(l, { id: "i" + i, type: "number", min: 0, inputMode: "numeric", value: qty[i] || 0 });
q.oninput = () => { qty[i] = Math.max(0, Math.min(999, Math.floor(+q.value || 0))); render(); };
});
render();
}
function link(a, text, number) {
a.setAttribute("aria-disabled", String(!text));
if (text) a.href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
else a.removeAttribute("href");
}
function render() {
const from = $("from").value.trim();
const wish = [`🪁 *${SHOP.toUpperCase()}* 🪁`, "", `✨ ${$("pick").value} ✨`, "", `🙏 ${from ? from + ", " : ""}${SHOP}`, "", `*${OWNER}*`].join("\n");
cards.wish = { msg: $("pick").value, from };
$("wish").textContent = wish;
link($("wishwa"), wish, "");
const rows = [], bill = []; let total = 0;
items.forEach((it, i) => {
const name = it.n.trim();
$("s" + i).textContent = `${name || "Saaman"}, ₹${it.p}`;
if (!name || !it.p) return;
rows.push([name, "₹" + it.p]);
if (qty[i]) { const amt = +(qty[i] * it.p).toFixed(2); total = +(total + amt).toFixed(2); bill.push([`${name} x ${qty[i]}`, "₹" + amt]); }
});
const date = new Date().toLocaleDateString("en-IN"), line = "━━━━━━━━━━━━";
const text = r => r.map(([n, p]) => `🔸 ${n}: *${p}*`);
const list = rows.length ? [`🪁 *${SHOP.toUpperCase()}* 🪁`, `Aaj ke rate (${date})`, line, ...text(rows), line,
"📲 Order ke liye reply karo", "https://hetchaudhary474-eng.github.io/smart-shop/"].join("\n") : "";
$("list").textContent = list || "Kam se kam ek saaman aur rate likho.";
link($("listwa"), list, "");
const order = total ? [`🧾 *${SHOP.toUpperCase()}* bill`, date, line, ...text(bill), line, `💰 *Total: ₹${total}*`, "Dhanyavaad! 🙏"].join("\n") : "";
cards.list = list ? { head: "Aaj ke rate", date, rows } : null;
cards.order = total ? { head: "Aapka bill", date, rows: bill, total: "₹" + total } : null;
["wish", "list", "order"].forEach(k => { $(k + "make").disabled = !cards[k]; $(k + "photo").hidden = true; });
$("total").textContent = "Total: ₹" + total;
$("order").textContent = order || "Bill ke liye quantity likho.";
link($("orderwa"), order, "");
$("listcopy").disabled = !list;
$("ordercopy").disabled = !total;
$("wishstatus").textContent = $("liststatus").textContent = $("orderstatus").textContent = "";
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
const blobs = {};
let downloads = null;
window.claude?.use?.("downloads")?.then(d => { downloads = d; });
["wish", "list", "order"].forEach(k => {
$(k + "make").addEventListener("click", async () => {
try { await document.fonts.load('700 60px "Baloo 2"'); await document.fonts.load('800 60px "Baloo 2"'); } catch {}
if (!cards[k]) return;
const c = draw(cards[k]);
$(k + "img").src = c.toDataURL("image/png");
c.toBlob(b => { blobs[k] = b; $(k + "photo").hidden = false; }, "image/png");
});
$(k + "save").addEventListener("click", async () => {
const note = $(k + "note"), manual = "Photo ko der tak dabao aur save karo, ya screenshot lo.";
if (!downloads) {
Object.assign(document.createElement("a"), { href: $(k + "img").src, download: `smart-shop-${k}.png` }).click();
note.textContent = "Download na ho to photo ko der tak dabao."; return;
}
try {
await downloads.save({ filename: `smart-shop-${{ wish: "shubhkamna", list: "rate", order: "bill" }[k]}.png`, data: blobs[k] });
note.textContent = "Download shuru ho gaya. Gallery ya Downloads me dekho.";
} catch { note.textContent = manual; }
});
});
function copy(src, status) {
const fail = () => { getSelection().selectAllChildren($(src)); $(status).textContent = "Text select ho gaya, ab Copy dabao."; };
if (!navigator.clipboard) return fail();
navigator.clipboard.writeText($(src).textContent).then(() => { $(status).textContent = "Copy ho gaya."; }, fail);
}
["wish", "list", "order"].forEach(k => $(k + "copy").addEventListener("click", () => copy(k, k + "status")));
$("from").addEventListener("input", render);
$("pick").addEventListener("change", render);
$("add").addEventListener("click", () => { items.push({ n: "", p: 0 }); build(); changed(); $("n" + (items.length - 1)).focus(); });
function load(data) {
if (dirty || !Array.isArray(data?.items)) return;
items = clean(data.items); build();
}
function ready(msg) { $("save").disabled = false; if (!dirty) $("savestatus").textContent = msg; }
const API = "https://api.github.com/repos/hetchaudhary474-eng/smart-shop/contents/rates.json";
const KEY = "smartshop_token";
let token = "", loaded = false;
try { token = localStorage.getItem(KEY) || ""; } catch {}
const call = (options = {}) => fetch(API, { ...options, cache: "no-store", headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token } });
const encode = text => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
const decode = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));
const why = code => code === 401 ? "Token galat hai ya expire ho gaya." : code === 403 || code === 404 ? "Token ko smart-shop me Contents: Read and write permission do." : "GitHub error " + code + ". Dobara try karo.";
const say = text => { $("savestatus").textContent = text; };
async function pull() {
loaded = false; $("save").disabled = true;
if (!token) { say("Save karne ke liye pehle token daalo."); return; }
say("Rate load ho rahe hain...");
try {
const res = await call();
if (res.ok) load(JSON.parse(decode((await res.json()).content)));
else if (res.status !== 404) { say(why(res.status)); return; }
loaded = true; $("save").disabled = false;
if (!dirty) say(res.ok ? "Live wale rate dikh rahe hain." : "Rate check karo aur pehli baar save karo.");
} catch { say("Rate load nahi hue. Internet check karke page refresh karo."); }
}
$("tokensave").addEventListener("click", () => {
const value = $("token").value.trim();
if (!value) { $("tokenstatus").textContent = "Pehle token paste karo."; return; }
token = value; $("token").value = "";
try { localStorage.setItem(KEY, token); $("tokenstatus").textContent = "Token save ho gaya."; }
catch { $("tokenstatus").textContent = "Token sirf page band hone tak rahega."; }
pull();
});
$("tokendel").addEventListener("click", () => {
token = ""; $("token").value = "";
try { localStorage.removeItem(KEY); } catch {}
$("tokenstatus").textContent = "Token is phone se hata diya."; pull();
});
$("save").addEventListener("click", async () => {
if (!loaded) return;
$("save").disabled = true; say("Save ho raha hai...");
const text = JSON.stringify({ items: clean(items) }, null, 2);
try {
const old = await call();
if (!old.ok && old.status !== 404) { say(why(old.status)); }
else {
const sha = old.ok ? (await old.json()).sha : undefined;
const res = await call({ method: "PUT", body: JSON.stringify({ message: "Naye rate", content: encode(text), sha }) });
if (res.ok) { dirty = JSON.stringify({ items: clean(items) }, null, 2) !== text; say("Save ho gaya! Kuch minute baad live app refresh karo."); }
else say(why(res.status));
}
} catch { say("Save nahi hua. Internet check karke dobara dabao."); }
$("save").disabled = false;
});
build();
if (token) $("tokenstatus").textContent = "Token is phone me save hai.";
pull();
// END
  
