/* ============================================================
   ЭКО ПЛАСТ - скрипт страницы.
   Плиты и раскрытие дугой витка · ролик героя с подписями по кадрам ·
   видео по видимости + модальный плеер · прайс: фильтр по диаметру и обновление
   из Google-таблицы · перевод RU/KZ (?lang= сильнее localStorage) · меню ·
   бегущая лента · лента видео с кнопками · WhatsApp с названием позиции ·
   форма в WhatsApp. Библиотек нет.
   ============================================================ */
(function(){
"use strict";
var WA = "77477213502";                  /* основной WhatsApp ЭКО ПЛАСТ */
/* export отдаёт ячейки как есть. gviz угадывает тип колонки по большинству и молча
   выбрасывает «чужие» ячейки («до 16» среди чисел, «2» среди «1.6»), поэтому он только запасной */
var SHEET_ID = "1_FjwEbMOW9eNdZz-Kf_2cw7hKoArWUKjsk3XDv7XaoQ";
var SHEET = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/export?format=csv";
var SHEET_GVIZ = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv";
var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.EP_CONV). Клики по телефону и WhatsApp
   ловим делегированием, переход не блокируем. Пустой ярлык - событие не шлём. */
function conv(key){
  var id = (window.EP_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Разметка русская. Ключа нет - строка остаётся русской. */
var KZ = {
"m.title":"Алматыдағы өндірушіден ПНД құбырлары - Ø16-250 мм, метрі 75 ₸-ден | ЭКО ПЛАСТ",
"m.desc":"Алматыда ПНД құбырларын өндіру: сумен жабдықтау, кәріз, кабель қорғау, фитингтер. Диаметрі 16-250 мм, SDR 9-26, 5 / 6 / 12 м кесінділер және орамдар. Нарықта 20 жылдан астам, қызмет мерзімі 50 жылдан астам. 50 позициялық прайс сайтта.",
"m.ogt":"Алматыдағы өндірушіден ПНД құбырлары - ЭКО ПЛАСТ",
"m.ogd":"Диаметрі 16-250 мм, 5 / 6 / 12 м кесінділер және орамдар. Сумен жабдықтау, кәріз, кабель қорғау, фитингтер. Нарықта 20 жылдан астам.",
"a.home":"ЭКО ПЛАСТ, басты бетке","a.nav":"Сайт бөлімдері","a.lang":"Сайт тілі","a.call":"Қоңырау шалу +7 747 721 35 02","a.menu":"Мәзір","a.prev":"Артқа","a.next":"Алға","a.filt":"Диаметр бойынша сүзгі","a.lane":"Өндіріс туралы бейнелер","a.player":"Бейне ойнатқыш","a.close":"Жабу",
"nav.pr":"Өнім","nav.ce":"Бағалар","nav.pz":"Өндіріс","nav.vd":"Бейне","nav.kn":"Байланыс",
"b.wa":"WhatsApp-қа жазу","b.prices":"Бағалар мен диаметрлер","b.ask":"Бағасын білу","b.price":"Прайс","b.video":"Бейнені көру","b.visit":"Шоурумға келу","b.how":"Қалай жасаймыз","b.schet":"WhatsApp-та шот сұрату","b.calc":"Есеп сұрату",

"h.kick":"Алматы · <span class=\"kx\">өз өндірісіміз · </span>нарықта 20 жылдан астам",
"h.h1a":"Алматыдағы өндірушіден","h.h1b":"ПНД <b>құбырлары</b>",
"h.lead":"<b>Диаметрі 16-250 мм</b>, 5, 6 және 12 м кесінділер және орамдар. Қызмет мерзімі 50 жылдан астам. Метр бағасы - 75 ₸-ден, 50 позициялық прайс төменде.",
"h.a":"Алматыдағы ЭКО ПЛАСТ қоймасындағы көк таңбалау жолағы бар ПНД құбырларының ұштары",

"p1.k":"Сумен жабдықтау","p1.h":"Ауыз суға арналған құбырлар","p1.p":"Көк таңбалау жолағы бар ПЭ100. Таттанбайды, бітелмейді, ауыз су үшін қауіпсіз.",
"p1.c1":"<b>Ø16-250</b> мм","p1.c2":"SDR 9-26 · 16 атм-ге дейін","p1.c3":"5 / 6 / 12 м және орамдар","p1.a":"Көк таңбалау жолағы бар сумен жабдықтауға арналған ПНД құбырлары, ЭКО ПЛАСТ өндірісі","p1.cap":"ПЭ100 · көк жолақ · ауыз су",
"p2.k":"Кәріз","p2.h":"Кәріз және су бұруға арналған құбырлар","p2.p":"Қысымды және қысымсыз желілер, нөсер кәрізі, дренаж. Тегіс қабырға - бітелу мен тұнба жоқ.",
"p2.c1":"<b>Ø50-250</b> мм","p2.c2":"SDR 17-26","p2.c3":"5 / 6 / 12 м кесінділер","p2.a":"Алматыдағы ЭКО ПЛАСТ қысқы қоймасындағы үлкен диаметрлі ПНД құбырлары","p2.cap":"қойма · Алматы",
"p3.k":"Кабель қорғау","p3.h":"Кабельге арналған ПНД құбыры","p3.p":"Жердегі және қабырғадағы күштік және талшықты-оптикалық желілер. Ішінде кабель тартуға арналған зонд.",
"p3.c1":"<b>Ø16-250</b> мм","p3.c2":"орамдар мен кесінділер","p3.c3":"зондпен тарту","p3.a":"ЭКО ПЛАСТ маманының қолындағы көк таңбалау жолағы бар кабель қорғауға арналған ПНД құбыры","p3.cap":"күштік және оптикалық кабель",
"p4.k":"Фитингтер","p4.h":"Фитингтер мен жалғағыштар","p4.p":"Компрессиялық муфталар, үштіктер, бұрмалар, шүмектер - құбырдың әр диаметріне. Дәнекерлеусіз монтаж.",
"p4.c1":"барлық диаметрге","p4.c2":"компрессиялық","p4.c3":"Алматыдағы қоймадан","p4.a":"ЭКО ПЛАСТ шоурумындағы ПНД құбырларына арналған компрессиялық фитингтер сөрелері","p4.cap":"шоурум · Сейфуллин, 235",
"p5.k":"Өз өндірісіміз","p5.h":"Алматыдағы өз цехымыз","p5.p":"Шикізатты кептіреміз, экструзиялаймыз, калибрлейміз, таңбалаймыз. Әр құбырға жауап береміз - санға қумаймыз.",
"p5.c1":"нарықта <b>20+</b> жыл","p5.c2":"ГОСТ","p5.c3":"ПЭ100 шикізаты","p5.a":"ЭКО ПЛАСТ цехындағы экструзиялық желі: құбыр калибратордан шығып жатыр","p5.cap":"цех · экструзиялық желі",

"c.k":"Бағалар","c.h":"<em>ПНД құбырларының</em> прайсы","c.l":"50 позиция: диаметрі, SDR, қабырғасы, қысымы, метр салмағы және бағасы. Барлық бағалар - 1 метрге, теңгемен.",
"c.fl":"Диаметрі","c.all":"Барлығы",
"t.d":"Ø, мм","t.w":"Қабырғасы, мм","t.pr":"Қысымы, атм","t.kg":"Салмағы, кг/м","t.p0":"ҚҚС-сыз, ₸","t.p1":"ҚҚС-пен, ₸",
"c.note":"Бағалар 1 метрге теңгемен, жаңартылды","c.hint":"Кестені оңға жылжытыңыз","c.none":"Мұндай диаметр бойынша позиция жоқ",
"bd.k":"Үлкен диаметрлер","bd.h":"250 мм-ден жоғары - сұраныс бойынша","bd.p":"Ø280 мм және одан үлкенін тапсырыспен жасаймыз. Мерзімі мен бағасын көлем бойынша есептейміз - не керек екенін жазыңыз.",

"e.k":"Құбырды қалай жасаймыз","e.h":"Түйіршіктен орамға дейінгі алты қадам","e.l":"Технология барлық 50 позицияға бір. Сапалы және арзан құбырдың айырмасы - шикізатта, қабырға қалыңдығында және әр қадамдағы бақылауда.",
"s1.h":"Шикізатты кептіру","s1.p":"ПЭ100 түйіршіктері вакуумдық камерадан өтеді: артық ылғал кетеді.",
"s2.h":"Экструзия","s2.p":"Балқыма қысыммен қалыптаушы бастиекке барады.",
"s3.h":"Қалыптаушы бастиек","s3.p":"SDR бойынша диаметр мен қабырға қалыңдығын береді.",
"s4.h":"Калибрлеу және салқындату","s4.p":"Құбыр дәл өлшемге келіп, ваннада салқындайды.",
"s5.h":"Тарту аппараты және таңбалау","s5.p":"Біркелкі тарту және таңбасы бар көк жолақ.",
"s6.h":"Кесу немесе орау","s6.p":"5, 6 және 12 м кесінділер немесе орам - нысанда қалай ыңғайлы болса.",
"m1.a":"ЭКО ПЛАСТ цехының экструдері мен жабдығы","m1.c":"экструдер","m2.a":"ПЭ100 түйіршігі салынған қаптар - ПНД құбырларының шикізаты","m2.c":"ПЭ100 шикізаты","m3.a":"Тарту аппараты: ПНД құбыры калибратордан шығып жатыр","m3.c":"тарту аппараты","m4.a":"Жұмысшы ПНД құбырын орамға орап жатыр","m4.c":"орамға орау","m5.a":"Алматыдағы ЭКО ПЛАСТ цехының жалпы көрінісі","m5.c":"цех",

"w.k":"Неге ЭКО ПЛАСТ","w.h":"Үйден <em>ұзақ жасайтын</em> құбыр",
"n1":"жыл нарықта","n2":"жыл қызмет мерзімі","n3":"мм - диаметрлер","n4":"атм жұмыс қысымы",
"f1.h":"ГОСТ","f1.p":"Сертификатталған өнім, ГОСТ пен техникалық талаптарға сай.",
"f2.h":"Экологиялық","f2.p":"Ауыз су мен топырақ үшін қауіпсіз. Иіссіз және қоспасыз.",
"f3.h":"Таттанбайды","f3.p":"Шірімейді, іші бітелмейді. Бүкіл қызмет мерзімінде тегіс қабырға.",
"f4.h":"Қысымға төзімді","f4.p":"SDR 9-26: 4-тен 16 атм-ге дейін. Қабырға қалыңдығы - желінің мақсатына қарай.",
"q.a":"ЭКО ПЛАСТ директоры Александр ПНД құбырларын өндіру цехында","q.p":"«Тек сапалы шикізат қолданамыз. Санға қумаймыз - әр құбырға жауап береміз.»","q.n":"Александр · ЭКО ПЛАСТ директоры",

"v.k":"Бейне","v.h":"Біздің <em>өндірісті</em> көріңіз","v.l":"Төрт қысқа бейне: құбыр қалай жасалады, цехқа экскурсия, сұрақтарға жауаптар және кабельге арналған құбыр.","v.snd":"дыбыспен",
"v1.h":"Құбыр қалай жасалады","v1.p":"Түйіршіктен кесіндіге дейін - 48 секундта","v1.a":"Бейне кадры: ПНД құбыры қалай жасалады","v1.aria":"Көру: құбыр қалай жасалады",
"v2.h":"Цехқа экскурсия","v2.p":"Желі, калибратор, қойма","v2.a":"Бейне кадры: ЭКО ПЛАСТ цехына экскурсия","v2.aria":"Көру: цехқа экскурсия",
"v3.h":"ПНД туралы бес сұрақ","v3.p":"Шикізат, қызмет мерзімі, қысым, арзаннан айырмасы","v3.a":"Бейне кадры: ЭКО ПЛАСТ менеджері ПНД құбырлары туралы сұрақтарға жауап береді","v3.aria":"Көру: ПНД құбырлары туралы бес сұрақ",
"v4.h":"Кабельге арналған ПНД құбыры","v4.p":"Кабельді зондпен тарту","v4.a":"Бейне кадры: кабель қорғауға арналған ПНД құбыры","v4.aria":"Көру: кабельге арналған ПНД құбыры",

"k.k":"Байланыс","k.h":"<em>Өндіріске</em> келіңіз","k.l":"Алматы, Сейфуллин даңғылы, 235. Цехты көрсетеміз, диаметр мен SDR таңдаймыз, қоймадан жөнелтеміз.",
"k.ph":"Телефондар · WhatsApp","k.ad":"Мекенжай","k.adv":"Алматы, Сейфуллин даңғылы, 235<small>өндіріс, қойма және фитингтер шоурумы</small>","k.hr":"Кесте","k.hrv":"дс-сб 9:00-17:00<small>жексенбі - демалыс</small>","k.net":"Желіде","k.gis":"2GIS-те ашу",
"z.h":"Есепке өтінім","z.l":"Диаметрін, метражын және қаланы жазыңыз - жұмыс уақытында WhatsApp-та жауап береміз.",
"z.name":"Атыңыз","z.nameph":"Сізге қалай жүгінуге болады","z.phone":"Телефон","z.what":"Не керек","z.whatph":"Ø110 SDR 17, 300 м, Алматы",
"z.agree":"Өтінім бойынша байланысу үшін дербес деректерімді өңдеуге келісемін.","z.send":"WhatsApp-қа жіберу",
"z.ok":"Рақмет! Дайын хабарламасы бар WhatsApp ашылады.","z.err":"Атыңызды, телефоныңызды көрсетіп, келісімді растаңыз.",
"z.note":"Түймені басқан соң дайын хабарламасы бар WhatsApp ашылады - ол сіздің нөміріңізден кетеді.",
"ft.p":"Алматыда ПНД құбырлары мен фитингтерін өндіру. Сумен жабдықтау, кәріз, кабель қорғау. Диаметрі 16-250 мм, 5 / 6 / 12 м кесінділер және орамдар.",
"ft.addr":"Алматы, Сейфуллин даңғылы, 235","ft.h":"дс-сб 9:00-17:00",
"ft.copy":"© 2026 ЭКО ПЛАСТ. Алматыда ПНД құбырларын өндіру.",
"bar.call":"Қоңырау",
"r1":"Қойма · Ø16-250 мм құбырлар","r2":"Экструзиялық желі · өз цехымыз","r3":"Құбырды орамға орау","r4":"Орам жөнелтуге дайын",
"so.h1":"Цех пен жөнелтулер: Instagram","so.h2":"Өндіріс бейнелері: TikTok","so.m1":"Instagram: цех пен жөнелтулер","so.m2":"TikTok: бейнелер",
"so.v1":"Көбірек бейне: TikTok","so.v2":"Цех пен жөнелтулер: Instagram"
};

/* готовые тексты WhatsApp: название позиции - отдельной строкой */
var WA_TXT = {
ru:{
  hero:"Здравствуйте! Пишу с сайта ЭКО ПЛАСТ. Нужны ПНД трубы:\n",
  cat:"Здравствуйте! Интересует цена:\n{t}\nДиаметр и метраж: ",
  schet:"Здравствуйте! Прошу выставить счёт на ПНД трубы.\nПозиции (диаметр, SDR, метраж): ",
  big:"Здравствуйте! Нужна труба большого диаметра (свыше 250 мм).\nДиаметр, SDR и метраж: ",
  kontakty:"Здравствуйте! Пишу с сайта ЭКО ПЛАСТ. Вопрос: "
},
kk:{
  hero:"Сәлеметсіз бе! ЭКО ПЛАСТ сайтынан жазып отырмын. ПНД құбырлары керек:\n",
  cat:"Сәлеметсіз бе! Бағасы қызықтырады:\n{t}\nДиаметрі мен метражы: ",
  schet:"Сәлеметсіз бе! ПНД құбырларына шот қоюыңызды сұраймын.\nПозициялар (диаметрі, SDR, метражы): ",
  big:"Сәлеметсіз бе! Үлкен диаметрлі құбыр керек (250 мм-ден жоғары).\nДиаметрі, SDR және метражы: ",
  kontakty:"Сәлеметсіз бе! ЭКО ПЛАСТ сайтынан жазып отырмын. Сұрақ: "
}};

var TICK = ["Водоснабжение","Канализация","Защита кабеля","Фитинги","Ø16-250 мм","Бухты и отрезки","ПЭ100","ГОСТ","Своё производство"];
var TICK_KZ = ["Сумен жабдықтау","Кәріз","Кабель қорғау","Фитингтер","Ø16-250 мм","Орамдар мен кесінділер","ПЭ100","ГОСТ","Өз өндірісіміз"];

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
  RU["c.none"] = "Нет позиций с таким диаметром";
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }
function curLang(){ return root.lang === "kk" ? "kk" : "ru"; }
function T(k){ return pick(k, curLang() === "kk") || ""; }
function plain(html){ var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

/* текст заявки собирается из заголовка плиты на текущем языке */
function setWaLinks(){
  var L = curLang();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var key = a.dataset.wa, t = WA_TXT[L][key] || WA_TXT[L].hero;
    if (t.indexOf("{t}") > -1) {
      var card = a.closest(".pp"), h = card ? card.querySelector("h2") : null;
      t = t.replace("{t}", h ? h.textContent.trim() : "");
    }
    a.href = "https://wa.me/" + (a.dataset.num || WA) + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

/* давление в таблице: «до 16» / «16-ға дейін» */
function pressureLang(){
  var kk = curLang() === "kk";
  document.querySelectorAll("#pbody td.pv").forEach(function(td){
    var raw = td.dataset.raw || td.textContent.trim();
    td.dataset.raw = raw;
    var m = raw.match(/^до\s*([\d.,]+)$/i);
    td.textContent = m ? (kk ? m[1] + "-ға дейін" : "до " + m[1]) : raw;
  });
}

function applyLang(lang){
  var kk = lang === "kk";
  root.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){
    var v = pick(el.dataset.iPh, kk); if (v !== undefined) el.setAttribute("placeholder", v);
  });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, kk); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (kk ? "kk" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("ep-lang", kk ? "kk" : "ru"); } catch(e){}
  setWaLinks();
  pressureLang();
  fillTicker();
  requestAnimationFrame(function(){ fitText(); update(); });
}
/* ?lang=kk в URL сильнее localStorage: русское объявление не должно открыть казахскую версию */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("ep-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  applyLang(lang);
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ applyLang(b.getAttribute("data-lang")); });
});

/* дисплейные строки: казахский длиннее - ужимаем, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 span").forEach(function(el){
    el.style.fontSize = "";
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.5) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩАЯ ЛЕНТА ----------------
   Копий столько, чтобы дорожка была шире двух экранов; шаг цикла - одна копия. */
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var list = curLang() === "kk" ? TICK_KZ : TICK;
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(16, w / 55) + "s");
}
var tkTimer;
addEventListener("resize", function(){
  update();
  clearTimeout(tkTimer);
  tkTimer = setTimeout(function(){ fillTicker(); fitText(); update(); lanes.forEach(function(l){ l.state(); }); }, 200);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); update(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") { closeMenu(); closeModal(); } });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 70; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH());
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ПЛИТЫ ----------------
   Один слушатель scroll через rAF. На каждую обёртку .pw пишем
   --enter / --exit / --stay и --open (раскрытие дугой), герою ещё --f (интро). */
var pws = [].slice.call(document.querySelectorAll(".pw"));
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeInOut(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.style.setProperty("--open",  easeInOut(clamp((enter - 0.28) / 0.66)).toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.6);
    if (pw === heroPw) pw.style.setProperty("--f", introK.toFixed(3));
  });
  hdrState();
  /* липкая панель: после 55 % первого экрана, прячется на контактах */
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("load", update);
  /* интро 1250 мс: текст поднимается, витрина с роликом выезжает.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = easeInOut(p);
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ if (hero) hero.classList.add("on"); requestAnimationFrame(step); });
    /* страховка: если rAF не тикает (фоновая вкладка), собрать экран по таймеру */
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 400);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 2200);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- СЧЁТЧИКИ ---------------- */
(function(){
  var nums = [].slice.call(document.querySelectorAll(".num[data-to]"));
  if (!nums.length) return;
  function run(el){
    var to = parseFloat(el.dataset.to), t0 = null;
    if (RED) { el.textContent = to; return; }
    var step = function(ts){
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  if (HAS_IO) {
    var nio = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ run(e.target); nio.unobserve(e.target); } }); }, {threshold:.5});
    nums.forEach(function(n){ nio.observe(n); });
  } else nums.forEach(run);
})();

/* ---------------- ВИДЕО ПО ВИДИМОСТИ ----------------
   src подставляется, когда кадр входит в вьюпорт; вне кадра - пауза.
   Класс is-live вешаем по событию playing, чтобы не мигал чёрный кадр. */
(function(){
  var vids = [].slice.call(document.querySelectorAll("video[data-src]"));
  if (!vids.length) return;
  var save = navigator.connection && navigator.connection.saveData;
  vids.forEach(function(v){ v.addEventListener("playing", function(){ v.classList.add("is-live"); }); });
  function on(v){
    if (!v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    var p = v.play(); if (p && p.catch) p.catch(function(){});
  }
  function off(v){ if (!v.paused) v.pause(); }
  if (RED || save) return;
  if (HAS_IO) {
    var vio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) on(e.target); else off(e.target); });
    }, {threshold:.3});
    vids.forEach(function(v){ vio.observe(v); });
  } else {
    vids.forEach(on);
  }
})();

/* ---------------- МОДАЛЬНЫЙ ПЛЕЕР ---------------- */
var vm = document.getElementById("vm"), vmVideo = document.getElementById("vm-video"), vmTitle = document.getElementById("vm-title");
var lastFocus = null;
function openModal(src, titleKey){
  if (!vm) return;
  lastFocus = document.activeElement;
  vmTitle.textContent = titleKey ? plain(T(titleKey)) : "";
  vmVideo.src = src;
  vm.classList.add("open");
  document.body.classList.add("vm-open");
  var p = vmVideo.play(); if (p && p.catch) p.catch(function(){});
  document.getElementById("vm-x").focus();
}
function closeModal(){
  if (!vm || !vm.classList.contains("open")) return;
  vm.classList.remove("open");
  document.body.classList.remove("vm-open");
  vmVideo.pause(); vmVideo.removeAttribute("src"); vmVideo.load();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
document.addEventListener("click", function(e){
  var b = e.target.closest("[data-video]");
  if (b) { e.preventDefault(); openModal(b.dataset.video, b.dataset.vt); return; }
  if (e.target === vm || e.target.closest("#vm-x")) closeModal();
});

/* ---------------- ЛЕНТЫ С КНОПКАМИ ----------------
   Шаг - ровно одна карточка (ширина + gap из стилей), крайняя кнопка гаснет,
   обе прячутся, если всё влезло. Ленте tabindex=0 - листается стрелками. */
var lanes = [];
document.querySelectorAll(".lane-w").forEach(function(w){
  var lane = w.querySelector(".lane"), prev = w.querySelector(".lbtn.prev"), next = w.querySelector(".lbtn.next");
  if (!lane || !prev || !next) return;
  function stepW(){
    var c = lane.firstElementChild; if (!c) return 300;
    var cs = getComputedStyle(lane);
    var gap = parseFloat(cs.columnGap || cs.gap) || 14;
    return c.getBoundingClientRect().width + gap;
  }
  function state(){
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    prev.hidden = none; next.hidden = none;
    prev.disabled = lane.scrollLeft <= 1;
    next.disabled = lane.scrollLeft >= max - 1;
  }
  prev.addEventListener("click", function(){ lane.scrollBy({left: -stepW(), behavior: RED ? "auto" : "smooth"}); });
  next.addEventListener("click", function(){ lane.scrollBy({left: stepW(), behavior: RED ? "auto" : "smooth"}); });
  lane.addEventListener("scroll", state, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });
  state();
  addEventListener("load", state);
  lanes.push({state: state});
});

/* ---------------- ПРАЙС: ФИЛЬТР ПО ДИАМЕТРУ ---------------- */
var pbody = document.getElementById("pbody"), filt = document.getElementById("filt");
var curD = "all";
function fmtPrice(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
function fmtNum(s){ return String(s).replace(".", ","); }
function applyFilter(){
  if (!pbody) return;
  var shown = 0;
  [].forEach.call(pbody.querySelectorAll("tr[data-d]"), function(tr){
    var on = curD === "all" || tr.dataset.d === curD;
    tr.hidden = !on; if (on) shown++;
  });
  var none = pbody.querySelector(".none");
  if (!shown) {
    if (!none) { none = document.createElement("tr"); none.className = "none"; none.innerHTML = "<td colspan=\"7\"></td>"; pbody.appendChild(none); }
    none.firstChild.textContent = T("c.none"); none.hidden = false;
  } else if (none) none.hidden = true;
  if (filt) [].forEach.call(filt.querySelectorAll(".chip"), function(c){
    var on = c.dataset.d === curD;
    c.classList.toggle("is-active", on); c.setAttribute("aria-pressed", on ? "true" : "false");
  });
}
if (filt) filt.addEventListener("click", function(e){
  var c = e.target.closest(".chip"); if (!c) return;
  curD = c.dataset.d; applyFilter();
});
window.epFilter = function(d){ curD = d; applyFilter(); return pbody.querySelectorAll("tr[data-d]:not([hidden])").length; };

/* ---------------- ПРАЙС ИЗ GOOGLE-ТАБЛИЦЫ ----------------
   Порядок колонок как в prices.csv: diameter, sdr, wall, pressure, weight,
   price_no_vat, price_vat; первая строка - заголовки. Любая ошибка -
   молча оставляем зашитые цены. */
function parseCSV(text){
  var rows = [], row = [], cell = "", q = false;
  for (var i = 0; i < text.length; i++) {
    var ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(function(r){ return r.some(function(c){ return c.trim() !== ""; }); });
}
function numOf(s){ var v = parseFloat(String(s).replace(/\s| | /g, "").replace(",", ".")); return isNaN(v) ? null : v; }
function rebuildTable(rows){
  var data = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i]; if (r.length < 7) return false;
    var d = numOf(r[0]), sdr = numOf(r[1]), wall = numOf(r[2]), w = numOf(r[4]), p0 = numOf(r[5]), p1 = numOf(r[6]);
    if (d === null || sdr === null || p0 === null || p1 === null || d < 10 || p0 <= 0) return false;
    data.push({d: d, sdr: r[1].trim(), wall: wall === null ? r[2].trim() : fmtNum(wall), pr: r[3].trim(), w: w === null ? r[4].trim() : fmtNum(w), p0: p0, p1: p1});
  }
  if (data.length < 10) return false;
  var html = "", last = null, ds = [];
  data.forEach(function(x){
    var ds_ = String(x.d);
    if (ds.indexOf(ds_) < 0) ds.push(ds_);
    html += "<tr data-d=\"" + ds_ + "\"" + (ds_ !== last ? " class=\"gs\"" : "") + "><td class=\"d\">" + ds_ + "</td><td>" + fmtNum(x.sdr) + "</td><td>" + x.wall + "</td><td class=\"pv\">" + x.pr.replace(/[<>&]/g, "") + "</td><td>" + x.w + "</td><td class=\"p0\">" + fmtPrice(x.p0) + "</td><td class=\"p1\">" + fmtPrice(x.p1) + "</td></tr>";
    last = ds_;
  });
  pbody.innerHTML = html;
  if (filt) {
    filt.innerHTML = "<span class=\"lbl\" data-i=\"c.fl\">" + T("c.fl") + "</span><button class=\"chip\" type=\"button\" data-d=\"all\" aria-pressed=\"true\" data-i=\"c.all\">" + T("c.all") + "</button>" +
      ds.map(function(d){ return "<button class=\"chip\" type=\"button\" data-d=\"" + d + "\" aria-pressed=\"false\">Ø" + d + "</button>"; }).join("");
  }
  if (ds.indexOf(curD) < 0) curD = "all";
  pressureLang(); applyFilter();
  var dt = new Date(), pd = document.getElementById("pdate");
  if (pd) pd.textContent = ("0" + dt.getDate()).slice(-2) + "." + ("0" + (dt.getMonth() + 1)).slice(-2) + "." + dt.getFullYear();
  return true;
}
/* зашитые в HTML строки - по ключу «диаметр|SDR»: ими закрываем пустые ячейки,
   если пришлось читать через gviz */
var BASE = {};
function baseSnapshot(){
  if (!pbody) return;
  [].forEach.call(pbody.querySelectorAll("tr[data-d]"), function(tr){
    var td = tr.children;
    BASE[tr.dataset.d + "|" + numOf(td[1].textContent)] = [td[0].textContent, td[1].textContent, td[2].textContent, (td[3].dataset.raw || td[3].textContent), td[4].textContent, td[5].textContent, td[6].textContent];
  });
}
function fillBlanks(rows){
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i], b = BASE[numOf(r[0]) + "|" + numOf(r[1])];
    if (!b) continue;
    for (var k = 0; k < 7; k++) if (r[k] === undefined || String(r[k]).trim() === "") r[k] = b[k];
  }
  return rows;
}
function getCSV(url){
  var ctl = typeof AbortController === "function" ? new AbortController() : null;
  if (ctl) setTimeout(function(){ ctl.abort(); }, 8000);
  return fetch(url, {signal: ctl ? ctl.signal : undefined, cache: "no-store"})
    .then(function(r){ if (!r.ok) throw 0; return r.text(); })
    .then(function(t){
      if (t.length < 100 || t.length > 200000 || /<html/i.test(t.slice(0, 300))) throw 0;
      var rows = parseCSV(t);
      if (rows.length < 5) throw 0;
      return rows;
    });
}
function loadSheet(){
  if (!pbody || typeof fetch !== "function" || location.protocol === "file:") return;
  baseSnapshot();
  getCSV(SHEET)
    .then(function(rows){ if (!rebuildTable(rows)) throw 0; })
    .catch(function(){
      return getCSV(SHEET_GVIZ).then(function(rows){ rebuildTable(fillBlanks(rows)); });
    })
    .catch(function(){});
}
window.epRebuild = rebuildTable;

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var name = form.name.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10 || !form.agree.checked) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var L = curLang();
  var t = (L === "kk"
    ? "Сәлеметсіз бе! ЭКО ПЛАСТ сайтынан өтінім.\nАты: " + name + "\nТелефон: " + phone + (msg ? "\nНе керек: " + msg : "")
    : "Здравствуйте! Заявка с сайта ЭКО ПЛАСТ.\nИмя: " + name + "\nТелефон: " + phone + (msg ? "\nЧто нужно: " + msg : ""));
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- РОЛИК ГЕРОЯ ----------------
   Монтаж из 4 кадров клиента. Петля без звука подключается после интро и только
   на нормальном соединении. Подпись и полоска прогресса идут по времени ролика:
   границы кадров - середины переходов в монтаже (hero-reel.mp4, 9,3 с). */
(function(){
  var v = document.getElementById("hero-video"); if (!v) return;
  var caps = [].slice.call(document.querySelectorAll("#reel-cap span"));
  var bars = [].slice.call(document.querySelectorAll("#reel-bar i"));
  var CUT = [0, 3.8, 5.7, 7.2];
  var cur = -1;
  function paint(){
    var t = v.currentTime || 0, d = v.duration || 9.29, k = 0;
    for (var i = 0; i < CUT.length; i++) if (t >= CUT[i]) k = i;
    if (k !== cur) {
      cur = k;
      caps.forEach(function(c, i){ c.classList.toggle("on", i === k); });
    }
    bars.forEach(function(b, i){
      var s0 = CUT[i], s1 = i + 1 < CUT.length ? CUT[i + 1] : d;
      b.style.setProperty("--p", i < k ? 1 : (i > k ? 0 : clamp((t - s0) / (s1 - s0)).toFixed(3)));
    });
  }
  var raf = 0;
  function loop(){ paint(); raf = v.paused ? 0 : requestAnimationFrame(loop); }
  v.addEventListener("playing", function(){ v.classList.add("is-live"); if (!raf) raf = requestAnimationFrame(loop); });
  v.addEventListener("seeked", paint);
  var save = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ""));
  if (RED || save) return;
  function play(){ var p = v.play(); if (p && p.catch) p.catch(function(){}); }
  setTimeout(function(){
    if (!v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    play();
  }, 600);
  /* вне экрана и в фоновой вкладке - пауза */
  var vis = true;
  if (HAS_IO) new IntersectionObserver(function(es){
    vis = es[0].isIntersecting;
    if (!vis) v.pause(); else if (v.getAttribute("src") && !document.hidden) play();
  }, {threshold: .05}).observe(document.getElementById("reel"));
  document.addEventListener("visibilitychange", function(){
    if (document.hidden) v.pause(); else if (v.getAttribute("src") && vis) play();
  });
})();

/* ---------------- СТАРТ ---------------- */
snapshot();
initLang();
fillTicker();
fitText();
hdrState();
applyFilter();
loadSheet();
})();
