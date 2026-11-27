const API = "https://api.github.com/repos/hetchaudhary474-eng/smart-shop/contents/";
const KEY = "smartshop_token";
let token = "", loaded = false, busy = 0, version = 0, data = clean({});
const qty = new Map();
try { token = localStorage.getItem(KEY) || ""; } catch {}
const call = (path, options = {}) => fetch(API + path, { ...options, cache: "no-store", headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token } });
const encode = text => btoa(String.fromCharCode(...new TextEncoder().encode(text)));
const decode = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));
const why = code => code === 401 ? "Token galat hai ya expire ho gaya." : code === 403 || code === 404 ? "Token ko smart-shop me Contents: Read and write permission do." : "GitHub error " + code + ". Dobara try karo.";
const say = text => { $("savestatus").textContent = text; };
const canSave = () => { $("save").disabled = !loaded || busy > 0; };
function changed() { version++; say("Badlav abhi save nahi hua."); render(); }

async function addPhoto(item, file) {
if (!file) return;
if (!token) return say("Photo ke liye pehle token daalo.");
busy++; canSave(); say("Photo upload ho rahi hai...");
try {
const url = URL.createObjectURL(file), img = new Image();
img.src = url; await img.decode();
const k = Math.min(1, 600 / Math.max(img.width, img.height));
const c = el("canvas", { width: Math.round(img.width * k), height: Math.round(img.height * k) });
const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
URL.revokeObjectURL(url);
const small = c.toDataURL("image/jpeg", 0.8), path = `images/${Date.now()}-${Math.floor(Math.random() * 1e6)}.jpg`;
const res = await call(path, { method: "PUT", body: JSON.stringify({ message: "Nayi photo", content: small.split(",")[1] }) });
if (res.ok) { item.img = path; item.preview = small; changed(); say("Photo upload ho gayi. Ab Rate save karo."); build(); }
else say(why(res.status));
} catch { say("Photo upload nahi hui. Dusri photo ya internet check karo."); }
busy--; canSave();
}
function build() {
$("rates").textContent = $("items").textContent = "";
boxes("hi", i => data.items.filter(x => x.c === i).length + " saaman");
$("cattitle").textContent = CATS[current][0] + " " + CATS[current][1];
data.items.forEach(item => {
const name = el("input", { value: item.n, placeholder: "Saaman" }); name.setAttribute("aria-label", "Saaman ka naam");
const price = el("input", { type: "number", min: 0, inputMode: "decimal", value: item.p || "", placeholder: "₹" }); price.setAttribute("aria-label", "Rate");
const del = el("button", { type: "button", textContent: "×" }); del.setAttribute("aria-label", "Saaman hatao");
const out = el("input", { type: "checkbox", checked: item.out });
const file = el("input", { type: "file", accept: "image/*" });
name.oninput = () => { item.n = name.value; changed(); };
price.oninput = () => { item.p = Math.max(0, +price.value || 0); changed(); };
del.onclick = () => { data.items.splice(data.items.indexOf(item), 1); changed(); build(); };
out.onchange = () => { item.out = out.checked; changed(); };
file.onchange = () => addPhoto(item, file.files[0]);
const tools = el("div", { className: "tools" }, el("label", { className: "check" }, out, "Stock khatam"));
if (item.img) {
tools.append(el("img", { className: "thumb", src: item.preview || item.img, alt: item.n }));
tools.append(el("button", { type: "button", textContent: "Photo hatao", onclick: () => { item.img = item.preview = ""; changed(); build(); } }));
}
if (item.c === current) $("rates").append(el("div", { className: "edit" }, el("div", { className: "row3" }, name, price, del), tools, el("label", { className: "file" }, "Photo chuno", file)));
const info = el("div", { className: "info" }); info.item = item;
$("items").append(el("div", { className: "card-item" }, info, stepper(qty.get(item) || 0, item.n || "Saaman", q => { qty.set(item, q); render(); })));
});
render();
}
function render() {
document.querySelectorAll("#items .info").forEach(e => { e.textContent = `${e.item.n || "Saaman"}, ₹${e.item.p}${e.item.out ? " (stock khatam)" : ""}`; });
const rows = [], bill = []; let total = 0;
data.items.forEach(item => {
const n = item.n.trim(), q = qty.get(item) || 0;
if (!n || !item.p || item.out) return;
rows.push([n, "₹" + item.p]);
if (q) { total = round(total + q * item.p); bill.push([`${n} x ${q}`, "₹" + round(q * item.p)]); }
});
const date = new Date().toLocaleDateString("en-IN"), line = "━━━━━━━━━━━━";
const text = r => r.map(([n, p]) => `🔸 ${n}: *${p}*`);
const list = rows.length ? [`🪁 *${SHOP.toUpperCase()}* 🪁`, `Aaj ke rate (${date})`, data.offer && `🎁 ${data.offer}`, line, ...text(rows), line, "📲 Order ke liye reply karo", "https://hetchaudhary474-eng.github.io/smart-shop/"].filter(Boolean).join("\n") : "";
const order = total ? [`🧾 *${SHOP.toUpperCase()}* bill`, date, line, ...text(bill), line, `💰 *Total: ₹${total}*`, "Dhanyavaad! 🙏"].join("\n") : "";
const from = $("from").value.trim(), msg = $("pick").value;
const wish = [`🪁 *${SHOP.toUpperCase()}* 🪁`, "", `✨ ${msg} ✨`, "", `🙏 ${from ? from + ", " : ""}${SHOP}`, "", `*${OWNER}*`].join("\n");
cards.list = list ? { head: "Aaj ke rate", date, rows } : null;
cards.order = total ? { head: "Aapka bill", date, rows: bill, total: "₹" + total } : null;
cards.wish = { msg, from };
$("list").textContent = list || "Kam se kam ek saaman aur rate likho.";
$("order").textContent = order || "Bill ke liye + dabao.";
$("wish").textContent = wish;
$("total").textContent = "Total: ₹" + total;
link($("listwa"), list, ""); link($("orderwa"), order, ""); link($("wishwa"), wish, "");
["list", "order", "wish"].forEach(k => { $(k + "make").disabled = $(k + "copy").disabled = !cards[k]; $(k + "photo").hidden = true; $(k + "status").textContent = ""; });
}
function show(json) { data = clean(json); qty.clear(); $("offer").value = data.offer; $("phone").value = data.phone; build(); }
async function pull() {
loaded = false; canSave();
const start = version;
if (!token) {
say("Save karne ke liye pehle token daalo.");
try { const r = await fetch("rates.json?t=" + Date.now(), { cache: "no-store" }); if (r.ok && version === start && !token) show(await r.json()); } catch {}
return;
}
say("Rate load ho rahe hain...");
try {
const res = await call("rates.json");
if (res.ok) show(JSON.parse(decode((await res.json()).content)));
else if (res.status !== 404) return say(why(res.status));
loaded = true; canSave(); say("Live wale rate dikh rahe hain.");
} catch { say("Rate load nahi hue. Internet check karke page refresh karo."); }
}
$("save").addEventListener("click", async () => {
const phone = $("phone").value.trim();
if (phone && !/^\d{10}$/.test(phone)) return say("WhatsApp number 10 ank ka likho, ya khali chhodo.");
busy++; canSave(); say("Save ho raha hai...");
const start = version, text = JSON.stringify(clean(data), null, 2);
try {
const old = await call("rates.json");
if (!old.ok && old.status !== 404) say(why(old.status));
else {
const sha = old.ok ? (await old.json()).sha : undefined;
const res = await call("rates.json", { method: "PUT", body: JSON.stringify({ message: "Naye rate", content: encode(text), sha }) });
say(!res.ok ? why(res.status) : version === start ? "Save ho gaya! Kuch minute baad live app refresh karo." : "Save hua. Naye badlav ke liye dobara save karo.");
}
} catch { say("Save nahi hua. Internet check karke dobara dabao."); }
busy--; canSave();
});
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
$("offer").addEventListener("input", () => { data.offer = $("offer").value; changed(); });
$("phone").addEventListener("input", () => { data.phone = $("phone").value.trim(); changed(); });
$("add").addEventListener("click", () => { data.items.push({ c: current, n: "", p: 0, out: false, img: "" }); changed(); build(); });
$("from").addEventListener("input", render);
$("pick").addEventListener("change", render);
$("open").addEventListener("click", () => { location.hash = token ? "home" : "more"; });
["list", "order", "wish"].forEach(k => $(k + "copy").addEventListener("click", () => copy(k, k + "status", "Copy ho gaya.", "Text select ho gaya, ab Copy dabao.")));
photoButton("list", "rate"); photoButton("order", "bill"); photoButton("wish", "shubhkamna");
const left = daysLeft();
$("days").textContent = left > 0 ? left + " din" : left === 0 ? "Aaj hai!" : "Ho gaya";
$("when").textContent = left > 0 ? "baaki, 14 January 2027 tak" : "14 January 2027";
if (token) $("tokenstatus").textContent = "Token is phone me save hai.";
route(() => build()); pull();
  
