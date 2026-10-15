
const $ = id => document.getElementById(id);

let selectedIdea = "flight";
let photoUrl = null;
let photoObjectUrl = null;
let deferredInstall = null;

const ideas = {
  flight:
    "İstanbul Boğazı üzerinde motosikletimle sinematik bir uçuş sahnesi; gerçekçi kamera hareketleri ve etkileyici manzaralar.",
  slowmo:
    "İstanbul sahil yolunda motosikletimle akıcı sürüş, alçak kamera açısı ve sinematik ağır çekim.",
  comedy:
    "Motosiklet videosunda beklenmedik, zararsız ve komik bir sürpriz; doğal tepkiler ve eğlenceli kurgu.",
  night:
    "İstanbul'da gece motosiklet sürüşü, şehir ışıkları, ıslak zeminde yansımalar ve sinematik takip çekimleri."
};

const styles = {
  cinematic: "Sinematik, gerçekçi, profesyonel renk düzenlemesi",
  realistic: "Gerçekçi motosiklet videosu, doğal ışık ve fizik",
  action: "Dinamik aksiyon, hızlı kamera hareketleri ve güçlü kurgu",
  vlog: "Doğal motosiklet vlogu, sürücü bakış açısı ve samimi anlatım",
  anime: "Anime estetiği, etkileyici hareketler ve stilize görüntüler"
};

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function setStatus(message) {
  const status = $("status");
  if (status) status.textContent = message;
}

function getIdea() {
  const custom = $("customIdea")?.value.trim();
  return custom || ideas[selectedIdea] || ideas.flight;
}

function getStyle() {
  const value = $("style")?.value || "cinematic";
  return styles[value] || value;
}

function buildPrompt(idea, style, duration) {
  return `BOZZKURT AI — MOTOSİKLET VİDEO PLANI

KONU:
${idea}

GÖRSEL TARZ:
${style}

SÜRE:
${duration} saniye

FORMAT:
Dikey 9:16, sosyal medya Reels formatı.

SAHNE PLANI:
1. Açılış: İlk 2 saniyede dikkat çeken bir görüntü.
2. Gelişme: Konuyu farklı kamera açılarıyla göster.
3. Detay: Motosiklet, yol, ışık ve hareket detayları.
4. Final: Akılda kalıcı sinematik kapanış.

KAMERA:
Sürücü POV, yandan takip, alçak açı ve uygun yakın planlar.
Sahneler arasında akıcı geçişler kullan.

SES:
Motor sesi doğal ve belirgin olsun. Gerekiyorsa rüzgâr ambiyansı
ve telifsiz müzik öner. Konuşma varsa Türkçe olsun.

GERÇEKÇİLİK:
Motosikletin görünümü ve fiziksel hareketleri tutarlı olsun.
Tehlikeli hareketleri gerçek trafikte uygulamayı teşvik etme.
Bu metin bir üretim planıdır; tek başına video dosyası oluşturmaz.

VİDEO ÜRETİM PROMPTU:
${idea}. ${style}. Dikey 9:16, ${duration} saniye,
profesyonel kamera hareketleri, tutarlı motosiklet tasarımı,
doğal ışık, yüksek detay, akıcı kurgu ve gerçekçi ses tasarımı.`;
}

function displayResult(text) {
  const result = $("resultPrompt");
  if (result) result.value = text;

  setStatus("Video planın hazır.");
  showToast("Bozzkurt AI planı hazır!");
}

async function thinkWithAI() {
  const key = $("aiKey")?.value.trim();

  if (!key) {
    showToast("Önce Google AI Studio API anahtarını gir.");
    setStatus("API anahtarı bekleniyor.");
    $("aiKey")?.focus();
    return;
  }

  const button = $("thinkDesign");
  const originalText = button?.textContent;

  if (button) {
    button.disabled = true;
    button.textContent = "Yapay zekâ düşünüyor...";
  }

  setStatus("Fikrin analiz ediliyor...");

  const idea = getIdea();
  const style = getStyle();
  const duration = $("duration")?.value || "15";

  const prompt = `Sen Bozzkurt AI adlı profesyonel bir motosiklet video yönetmenisin.
Kullanıcı için Türkçe, uygulanabilir ve yaratıcı bir video tasarımı hazırla.

Kullanıcı fikri: ${idea}
Görsel tarz: ${style}
Süre: ${duration} saniye
Video formatı: Dikey 9:16.

Şu başlıkları açıkça kullan:
1. VİDEO FİKRİ
2. SAHNE SAHNE PLAN (zaman aralıklarıyla)
3. KAMERA AÇILARI VE HAREKETLERİ
4. TÜRKÇE KONUŞMA METNİ
5. MOTOR, ORTAM VE MÜZİK SESLERİ
6. YAPAY ZEKÂ VİDEO ÜRETİM PROMPTU
7. REELS BAŞLIĞI VE HASHTAGLER

Gerçekçi ve özgün ol. Konuşmayı doğal Türkçeyle yaz.
Sürüş sırasında sürücünün dikkatini dağıtacak davranışlar önermeden
güvenli çekim seçenekleri sun. Kullanıcının fikrine sadık kal.`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2200
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message || "API isteği başarısız oldu.";

      throw new Error(message);
    }

    const generatedText = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n")
      .trim();

    if (!generatedText) {
      throw new Error("Yapay zekâ boş yanıt verdi. Tekrar dene.");
    }

    displayResult(generatedText);
  } catch (error) {
    console.error("Bozzkurt AI:", error);

    setStatus("Yapay zekâ bağlantısı kurulamadı.");
    showToast(error.message || "Bağlantı hatası oluştu.");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || "Yapay zekâ ile tasarla";
    }
  }
}

function makeBasicPrompt() {
  displayResult(
    buildPrompt(getIdea(), getStyle(), $("duration")?.value || "15")
  );
}

function selectIdea(button) {
  document.querySelectorAll("[data-idea]").forEach(item => {
    item.classList.remove("active", "selected");
    item.setAttribute("aria-pressed", "false");
  });

  button.classList.add("active");
  button.setAttribute("aria-pressed", "true");

  selectedIdea = button.dataset.idea || "flight";

  const textarea = $("customIdea");
  if (textarea) textarea.value = "";

  setStatus("Video fikri seçildi.");
}

function setupPhotoInput() {
  const input = $("photoInput");
  const preview = $("photoPreview");
  const area = $("photoArea");
  const remove = $("removePhoto");

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Lütfen bir fotoğraf seç.");
      input.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("Fotoğraf en fazla 10 MB olabilir.");
      input.value = "";
      return;
    }

    if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);

    photoObjectUrl = URL.createObjectURL(file);
    photoUrl = photoObjectUrl;
    preview.src = photoUrl;

    area?.classList.remove("hidden");
    showToast("Fotoğraf eklendi.");
  });

  remove?.addEventListener("click", () => {
    input.value = "";
    preview.removeAttribute("src");

    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
      photoObjectUrl = null;
    }

    photoUrl = null;
    area?.classList.add("hidden");
    showToast("Fotoğraf kaldırıldı.");
  });
}

async function copyResult() {
  const text = $("resultPrompt")?.value.trim();

  if (!text) {
    showToast("Önce bir video planı oluştur.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("Metin kopyalandı!");
  } catch {
    const result = $("resultPrompt");
    result?.focus();
    result?.select();

    try {
      const copied = document.execCommand("copy");
      showToast(copied ? "Metin kopyalandı!" : "Metni seçip kopyala.");
    } catch {
      showToast("Metni seçip kopyalayabilirsin.");
    }
  }
}

function downloadResult() {
  const text = $("resultPrompt")?.value.trim();

  if (!text) {
    showToast("Önce bir video planı oluştur.");
    return;
  }

  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "bozzkurt-ai-video-plani.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Plan dosyası indiriliyor.");
}

function setupInstall() {
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstall = event;

    const button = $("installBtn");
    if (button) button.hidden = false;
  });

  $("installBtn")?.addEventListener("click", async () => {
    if (!deferredInstall) {
      showToast("Chrome menüsünden Ana ekrana ekle seçeneğini kullan.");
      return;
    }

    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
  });
}

function setupEvents() {
  document.querySelectorAll("[data-idea]").forEach(button => {
    button.addEventListener("click", () => selectIdea(button));
    button.setAttribute("aria-pressed", "false");
  });

  $("thinkDesign")?.addEventListener("click", thinkWithAI);
  $("makePrompt")?.addEventListener("click", makeBasicPrompt);
  $("copyPrompt")?.addEventListener("click", copyResult);
  $("downloadPrompt")?.addEventListener("click", downloadResult);

  $("customIdea")?.addEventListener("input", event => {
    if (event.target.value.trim()) {
      document.querySelectorAll("[data-idea]").forEach(button => {
        button.classList.remove("active", "selected");
        button.setAttribute("aria-pressed", "false");
      });
    }
  });

  setupPhotoInput();
  setupInstall();
}

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.warn("Service worker kaydedilemedi:", error);
    });
  }
});
