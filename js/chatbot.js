/* ===========================================================
   chatbot.js — בוט שאלות נפוצות לטברנה יאסו רודוס
   הוספה לכל דף: <script src="chatbot.js"></script> לפני </body>
   =========================================================== */
 
(function () {
 
  /* ---------- 1. כאן עורכים את השאלות והתשובות ---------- */
  const FAQ = [
    {
      keywords: ["שעות", "פתוח", "פתיחה", "סגור", "מתי"],
      question: "מה שעות הפעילות?",
      answer: "אנחנו פתוחים ימים א׳–ה׳ בין 15:00–24:00. בימי שישי המסעדה סגורה לישיבה (רק איסוף קייטרינג), ובמוצ״ש נפתחים כשעה אחרי צאת השבת."
    },
    {
      keywords: ["הזמנה", "להזמין", "לשריין", "שולחן", "מקום"],
      question: "איך מזמינים שולחן?",
      answer: "אפשר להזמין דרך דף ההזמנות באתר, ותוך כמה דקות תקבלו אישור בוואטסאפ. בערבי טברנה יוונית עם מוזיקה חיה יש מינימום הזמנה של 30€ לאדם."
    },
    {
      keywords: ["פיקדון", "ביט", "תשלום", "מקדמה", "לבטל"],
      question: "מה זה הפיקדון שצריך לשלם?",
      answer: "לשמירת השולחן נדרש פיקדון של 100 ₪ באמצעות ביט. הפיקדון מוחזר בסוף הערב מול החשבון הכולל. שימו לב: ללא פיקדון ביט לא נשמר מקום מראש, ואי הגעה/ביטול מאוחר לא מזכים בהחזר."
    },
    {
      keywords: ["כשר", "כשרות", "תעודה", "רבנות"],
      question: "האם המסעדה כשרה?",
      answer: "כן, טברנה יאסו רודוס היא מסעדה כשרה בהשגחת הרב. אפשר לצפות בתעודת הכשרות בעמוד הייעודי באתר."
    },
    {
      keywords: ["תפריט", "מנות", "לאכול", "אוכל"],
      question: "מה יש בתפריט?",
      answer: "התפריט שלנו מציע מטבח טברנה יווני-ישראלי — מנות ים תיכוניות, בשרים על האש ומנות צמחוניות. אפשר לראות את התפריט המלא בעברית, אנגלית וצרפתית בעמוד התפריט באתר."
    },
    {
      keywords: ["איפה", "כתובת", "מיקום", "להגיע", "ניווט"],
      question: "איפה אתם נמצאים?",
      answer: "הכתובת שלנו מופיעה בעמוד 'איך מגיעים' באתר, כולל מפה וכפתור ניווט ישיר לגוגל מפות."
    },
    {
      keywords: ["מוזיקה", "טברנה", "רקדנים", "הופעה", "חי"],
      question: "יש מוזיקה חיה?",
      answer: "כן! בערבי טברנה יוונית מתקיימת מוזיקה יוונית חיה עם זמר, בוזוקי ורקדנים. הכניסה חינם, עם מינימום הזמנה של 30€ לאדם."
    },
    {
      keywords: ["טלפון", "ליצור קשר", "וואטסאפ", "לדבר"],
      question: "איך יוצרים קשר?",
      answer: "הכי מהיר זה דרך עמוד 'צור קשר' באתר, או הודעת וואטסאפ ישירות לפי המספרים שמופיעים שם."
    }
  ];
 
  const FALLBACK_ANSWER =
    "לא הצלחתי למצוא תשובה מדויקת לשאלה הזו 🙂 אפשר לנסח אחרת, או ליצור קשר ישירות דרך עמוד 'צור קשר'.";
 
  /* ---------- 2. עיצוב (בהתאם לצבעי האתר הכחולים) ---------- */
  const style = document.createElement("style");
  style.textContent = `
    #ytb-chat-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg,#0069a8,#003b66);
      color: #fff;
      border: none;
      font-size: 26px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,30,55,.35);
      z-index: 999;
    }
    #ytb-chat-window {
      position: fixed;
      bottom: 90px;
      left: 20px;
      width: 320px;
      max-width: calc(100vw - 40px);
      height: 440px;
      max-height: 70vh;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 35px rgba(0,0,0,.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: Arial, Helvetica, sans-serif;
      direction: rtl;
      z-index: 999;
    }
    #ytb-chat-window.open { display: flex; }
    #ytb-chat-header {
      background: linear-gradient(to bottom,#0069a8,#003b66);
      color: #fff;
      padding: 14px 16px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #ytb-chat-header span { cursor: pointer; font-size: 20px; }
    #ytb-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f7f7f7;
    }
    .ytb-msg { margin-bottom: 10px; display: flex; }
    .ytb-msg.bot { justify-content: flex-start; }
    .ytb-msg.user { justify-content: flex-end; }
    .ytb-bubble {
      max-width: 80%;
      padding: 9px 12px;
      border-radius: 14px;
      font-size: 14px;
      line-height: 1.5;
    }
    .ytb-msg.bot .ytb-bubble { background: #eaf3fb; color: #222; border-bottom-left-radius: 4px; }
    .ytb-msg.user .ytb-bubble { background: #0069a8; color: #fff; border-bottom-right-radius: 4px; }
    #ytb-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 10px;
      background: #fff;
      border-top: 1px solid #eee;
    }
    .ytb-chip {
      background: #eaf3fb;
      color: #003b66;
      border: 1px solid #cfe2f3;
      border-radius: 20px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: pointer;
    }
    #ytb-chat-input-row {
      display: flex;
      border-top: 1px solid #eee;
      padding: 8px;
      gap: 6px;
    }
    #ytb-chat-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 14px;
      outline: none;
    }
    #ytb-chat-send {
      background: #0069a8;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      font-size: 16px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
 
  /* ---------- 3. בניית ה-HTML ---------- */
  const btn = document.createElement("button");
  btn.id = "ytb-chat-btn";
  btn.setAttribute("aria-label", "פתח צ׳אט שאלות נפוצות");
  btn.textContent = "💬";
  document.body.appendChild(btn);
 
  const win = document.createElement("div");
  win.id = "ytb-chat-window";
  win.innerHTML = `
    <div id="ytb-chat-header">
      <span id="ytb-chat-close">×</span>
      <span>שאלות נפוצות – יאסו רודוס</span>
    </div>
    <div id="ytb-chat-body"></div>
    <div id="ytb-quick"></div>
    <div id="ytb-chat-input-row">
      <input id="ytb-chat-input" type="text" placeholder="הקלד שאלה...">
      <button id="ytb-chat-send">➤</button>
    </div>
  `;
  document.body.appendChild(win);
 
  const body = win.querySelector("#ytb-chat-body");
  const quick = win.querySelector("#ytb-quick");
  const input = win.querySelector("#ytb-chat-input");
 
  /* ---------- 4. לוגיקה ---------- */
  function addMessage(text, from) {
    const row = document.createElement("div");
    row.className = "ytb-msg " + from;
    const bubble = document.createElement("div");
    bubble.className = "ytb-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }
 
  function findAnswer(text) {
    const clean = text.trim().toLowerCase();
    let best = null;
    let bestScore = 0;
    FAQ.forEach(item => {
      let score = 0;
      item.keywords.forEach(k => {
        if (clean.includes(k)) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });
    return best ? best.answer : FALLBACK_ANSWER;
  }
 
  function handleSend(text) {
    if (!text.trim()) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(() => {
      addMessage(findAnswer(text), "bot");
    }, 300);
  }
 
  // כפתורי שאלות מהירות
  FAQ.forEach(item => {
    const chip = document.createElement("button");
    chip.className = "ytb-chip";
    chip.textContent = item.question;
    chip.onclick = () => handleSend(item.question);
    quick.appendChild(chip);
  });
 
  win.querySelector("#ytb-chat-send").onclick = () => handleSend(input.value);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSend(input.value);
  });
 
  btn.onclick = () => {
    win.classList.toggle("open");
    if (win.classList.contains("open") && body.children.length === 0) {
      addMessage("שלום! 👋 איך אפשר לעזור? אפשר ללחוץ על אחת השאלות למטה או להקליד שאלה חופשית.", "bot");
    }
  };
  win.querySelector("#ytb-chat-close").onclick = () => win.classList.remove("open");
 
})();

