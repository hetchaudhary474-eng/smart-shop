const T = {
hi: { fest: "Uttarayan Utsav", tag: "Patang, firki aur festival ka saaman", open: "Dukaan kholo", day: "din", left: "baaki, 14 January 2027 tak", today: "Aaj hai!", past: "Ho gaya",
search: "🔍 Saaman search karo", nofind: "Ye saaman nahi mila.", back: "← Wapas", myorder: "Tumhara order", see: "Order dekho", none: "Is me abhi saaman nahi hai.", rates: "Rate aur order", name: "Tumhara naam", how: "Kaise loge?", pickup: "Dukaan se lunga", delivery: "Ghar par delivery", addr: "Address", total: "Total", empty: "Order ke liye + dabao.", needaddr: "Delivery ke liye address likho.", out: "Stock khatam",
copy: "Copy", copied: "Copy ho gaya.", selected: "Text select ho gaya, ab Copy dabao.", loading: "Rate load ho rahe hain...", fail: "Rate load nahi hue. Page dobara kholo.", order: "order",
wishh: "Shubhkamna message", pickmsg: "Message chuno", make: "Design wali photo banao", download: "Photo download karo", press: "Download na ho to photo ko der tak dabao.",
safeh: "Safe Uttarayan", s1: "Chinese, plastic ya kaanch wale manje ka use mat karo.", s2: "Subah jaldi aur shaam ko patang mat udao, tab pakshi zyada udte hain.", s3: "Bijli ke taar se door raho. Fansi patang mat nikalo.", s4: "Chhat ke kinare se door raho, sadak par patang ke peeche mat bhago.", bird: "Ghayal pakshi (Gujarat): 1962 ya 1926 par call karo.",
wishes: ["Aapko aur aapke parivar ko Uttarayan ki hardik shubhkamnaye!", "Aapki khushiyon ki patang hamesha unchi ude. Happy Uttarayan!", "Til-gud khao, meetha bolo. Makar Sankranti ki shubhkamnaye!"] },
gu: { fest: "ઉત્તરાયણ ઉત્સવ", tag: "પતંગ, ફીરકી અને તહેવારનો સામાન", open: "દુકાન ખોલો", day: "દિવસ", left: "બાકી, 14 જાન્યુઆરી 2027 સુધી", today: "આજે છે!", past: "થઈ ગઈ",
search: "🔍 સામાન શોધો", nofind: "આ સામાન ન મળ્યો.", back: "← પાછા", myorder: "તમારો ઓર્ડર", see: "ઓર્ડર જુઓ", none: "આમાં હજી સામાન નથી.", rates: "ભાવ અને ઓર્ડર", name: "તમારું નામ", how: "કેવી રીતે લેશો?", pickup: "દુકાનેથી લઈશ", delivery: "ઘરે ડિલિવરી", addr: "સરનામું", total: "કુલ", empty: "ઓર્ડર માટે + દબાવો.", needaddr: "ડિલિવરી માટે સરનામું લખો.", out: "સ્ટોક ખતમ",
copy: "કોપી કરો", copied: "કોપી થઈ ગયું.", selected: "લખાણ સિલેક્ટ થયું, હવે કોપી દબાવો.", loading: "ભાવ લોડ થઈ રહ્યા છે...", fail: "ભાવ લોડ ન થયા. પેજ ફરી ખોલો.", order: "ઓર્ડર",
wishh: "શુભકામના સંદેશ", pickmsg: "સંદેશ પસંદ કરો", make: "ડિઝાઇન વાળો ફોટો બનાવો", download: "ફોટો ડાઉનલોડ કરો", press: "ડાઉનલોડ ન થાય તો ફોટાને દબાવી રાખો.",
safeh: "સુરક્ષિત ઉત્તરાયણ", s1: "ચાઇનીઝ, પ્લાસ્ટિક કે કાચ વાળી દોરી ન વાપરો.", s2: "વહેલી સવારે અને સાંજે પતંગ ન ચગાવો, ત્યારે પક્ષીઓ વધુ ઊડે છે.", s3: "વીજળીના તારથી દૂર રહો. ફસાયેલી પતંગ ન કાઢો.", s4: "ધાબાની કિનારીથી દૂર રહો, રસ્તા પર પતંગ પાછળ ન દોડો.", bird: "ઘાયલ પક્ષી (ગુજરાત): 1962 અથવા 1926 પર કોલ કરો.",
wishes: ["આપને અને આપના પરિવારને ઉત્તરાયણની હાર્દિક શુભકામનાઓ!", "તમારી ખુશીઓની પતંગ હંમેશા ઊંચી ઊડે. હેપ્પી ઉત્તરાયણ!", "તલ-ગોળ ખાઓ, મીઠું બોલો. મકર સંક્રાંતિની શુભકામનાઓ!"] }
};
let lang = "hi", data = clean({}), state = "loading";
const qty = new Map();
try { if (localStorage.getItem("smartshop_lang") === "gu") lang = "gu"; } catch {}
const t = key => T[lang][key];

let view = "";
function count(item, q) { qty.set(item, q); render(); }
function card(item) {
const picture = item.img ? el("img", { src: item.img, alt: item.n, loading: "lazy" }) : el("div", { className: "noimg", textContent: CATS[item.c][0] });
return el("div", { className: "product" }, picture, el("b", { textContent: item.n }), el("span", { className: "price", textContent: "₹" + item.p }),
item.out ? el("b", { className: "soldout", textContent: t("out") }) : stepper(qty.get(item) || 0, item.n, q => count(item, q)));
}
function build() {
const list = data.items.filter(x => x.n && x.p);
const find = $("search").value.trim().toLowerCase();
const shown = list.filter(x => x.c === current && `${x.n} ${CATS[x.c][1]} ${CATS[x.c][2]}`.toLowerCase().includes(find));
$("cattitle").textContent = CATS[current][0] + " " + CATS[current][lang === "gu" ? 2 : 1];
$("items").replaceChildren(...shown.map(card));
$("load").textContent = state !== "ok" ? t(state) : shown.length ? "" : t(find ? "nofind" : "none");
$("cart").replaceChildren(...list.filter(x => !x.out && qty.get(x)).map(item => el("div", { className: "card-item" },
el("div", { className: "info" }, item.n, el("span", { textContent: "₹" + item.p })), stepper(qty.get(item), item.n, q => count(item, q)))));
}
function render() {
const lines = []; let total = 0;
data.items.forEach(item => {
const q = item.out ? 0 : qty.get(item) || 0;
if (!q || !item.p) return;
total = round(total + q * item.p); lines.push(`🔸 ${item.n} x ${q}: *₹${round(q * item.p)}*`);
});
const delivery = $("how").value === "delivery", name = $("cname").value.trim(), addr = $("addr").value.trim();
$("addrbox").hidden = !delivery;
const ready = total && (!delivery || addr);
const order = ready ? [`🧾 *${SHOP.toUpperCase()}* ${t("order")}`, ...lines, `💰 *${t("total")}: ₹${total}*`,
name && `👤 ${name}`, `🚚 ${t(delivery ? "delivery" : "pickup")}`, delivery && `📍 ${addr}`].filter(Boolean).join("\n") : "";
$("total").textContent = `${t("total")}: ₹${total}`;
$("order").textContent = order || t(total ? "needaddr" : "empty");
link($("orderwa"), order, data.phone); $("ordercopy").disabled = !order;
const from = $("from").value.trim(), msg = $("pick").value;
const wish = [`🪁 *${SHOP.toUpperCase()}* 🪁`, "", `✨ ${msg} ✨`, "", `🙏 ${from ? from + ", " : ""}${SHOP}`, "", `*${OWNER}*`].join("\n");
$("wish").textContent = wish; link($("wishwa"), wish, "");
cards.wish = { msg, from }; $("wishphoto").hidden = true;
$("orderstatus").textContent = $("wishstatus").textContent = "";
$("bar").textContent = `🛍️ ${t("see")} • ₹${total}`; $("bar").hidden = !total || view !== "cat";
}
function paint() {
document.documentElement.lang = lang === "gu" ? "gu" : "hi-Latn";
document.querySelectorAll("[data-t]").forEach(e => { e.textContent = t(e.dataset.t); });
$("lang").textContent = lang === "gu" ? "Hindi" : "ગુજરાતી";
$("search").placeholder = t("search"); $("search").setAttribute("aria-label", t("search"));
const left = daysLeft();
$("days").textContent = left > 0 ? `${left} ${t("day")}` : t(left === 0 ? "today" : "past");
$("when").textContent = left > 0 ? t("left") : "14 January 2027";
const chosen = Math.max(0, $("pick").selectedIndex);
$("pick").replaceChildren(...T[lang].wishes.map(w => el("option", { textContent: w })));
$("pick").selectedIndex = chosen;
$("offer").textContent = data.offer ? "🎁 " + data.offer : ""; $("offer").hidden = !data.offer;
$("homeload").textContent = state === "ok" ? "" : t(state);
boxes(lang); build(); render();
}
$("search").addEventListener("input", build);
$("open").addEventListener("click", () => { location.hash = "home"; });
$("gowish").addEventListener("click", () => { location.hash = "wish"; });
$("lang").addEventListener("click", () => { lang = lang === "gu" ? "hi" : "gu"; try { localStorage.setItem("smartshop_lang", lang); } catch {} paint(); });
["cname", "addr", "from"].forEach(id => $(id).addEventListener("input", render));
["how", "pick"].forEach(id => $(id).addEventListener("change", render));
["order", "wish"].forEach(k => $(k + "copy").addEventListener("click", () => copy(k, k + "status", t("copied"), t("selected"))));
photoButton("wish", "shubhkamna");
paint();
route(v => { view = v; if (v !== "cat") $("search").value = ""; build(); render(); });
fetch("rates.json?t=" + Date.now(), { cache: "no-store" })
.then(r => { if (!r.ok) throw new Error(); return r.json(); })
.then(json => { data = clean(json); state = "ok"; paint(); })
.catch(() => { state = "fail"; paint(); });
            
