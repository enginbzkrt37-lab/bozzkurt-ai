const $ = id => document.getElementById(id);
let selectedIdea = "flight";
let photoUrl = null;
let deferredInstall = null;
const ideas = {
  flight: "İstanbul Boğazı üzerinde motosikletimle inanılmaz biçimde havalanıp köprünün üzerinden gökyüzüne doğru yükseliyorum.",
  slowmo: "İstanbul sahil yolunda motosikletimle akıcı bir sürüş yapıyorum; kamera alçak açıdan motoru takip ediyor ve sahne sinematik ağır çekime dönüşüyor.",
  comedy: "Motosikletimle normal bir şekilde ilerlerken beklenmedik, zararsız ve komik bir sürpriz yaşanıyor; tepkim doğal ve sahne şaşırtıcı.",
  night: "İstanbul'da gece, şehir ışıkları ve Boğaz yansımaları eşliğinde motosiklet sürüyorum; kamera beni yandan ve arkadan sinematik biçimde takip ediyor."
};
const names = {flight:"Boğaz üstünde uçuş",slowmo:"Sinematik sürüş",comedy:"Komik sürpriz",night:"Gece turu"};
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2300)}
document.querySelectorAll(".idea").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".idea").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");selectedIdea=btn.dataset.idea;
  $("status").textContent=`Seçilen fikir: ${names[selectedIdea]}.`;
}));
$("photoInput").addEventListener("change",e=>{
  const file=e.target.files && e.target.files[0];if(!file)return;
  if(!file.type.startsWith("image/")){toast("Lütfen bir görsel dosyası seç.");return}
  if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=URL.createObjectURL(file);
  $("photoPreview").src=photoUrl;$("photoPreview").classList.remove("hidden");$("uploadPrompt").classList.add("hidden");$("removePhoto").classList.remove("hidden");
  $("status").textContent="Fotoğraf seçildi. Bu prototip fotoğrafı sunucuya yüklemiyor.";
});
$("removePhoto").addEventListener("click",()=>{
  if(photoUrl)URL.revokeObjectURL(photoUrl);photoUrl=null;$("photoInput").value="";$("photoPreview").removeAttribute("src");$("photoPreview").classList.add("hidden");$("uploadPrompt").classList.remove("hidden");$("removePhoto").classList.add("hidden");toast("Fotoğraf kaldırıldı.");
});
$("makePrompt").addEventListener("click",()=>{
  const custom=$("customIdea").value.trim();const scene=custom||ideas[selectedIdea];
  const style=$("style").value;const duration=$("duration").value;
  const prompt=`Fotoğraftaki kişinin yüzünü, saçını, kıyafetlerini ve genel görünüşünü mümkün olduğunca tutarlı koru. Kişi motosikletinin üzerinde olsun. Sahne: ${scene}\n\nGörüntü tarzı: ${style}. Süre hedefi: ${duration}. Dikey 9:16 kadraj, doğal vücut ve motosiklet hareketleri, tutarlı anatomi, gerçekçi ışık ve gölgeler, akıcı kamera takibi, yüksek ayrıntı. Kişinin yüzünü değiştirme; motosikletin şekli ve kıyafetler sahne boyunca tutarlı kalsın. Gereksiz yazı, logo veya filigran ekleme. Konuşma ve dudak senkronu olmasın. Güvenli, kurgu bir sahne oluştur.`;
  $("resultPrompt").value=prompt;
  $("status").textContent=photoUrl?"Komut hazır. Seçtiğin fotoğrafı ayrıca video aracına yüklemeyi unutma.":"Komut hazır. Yüz tutarlılığı için video aracına bir referans fotoğrafı da yükle.";
  $("resultPrompt").scrollIntoView({behavior:"smooth",block:"center"});toast("Video komutun hazır!");
});
$("copyPrompt").addEventListener("click",async()=>{
  const value=$("resultPrompt").value;if(!value){toast("Önce video komutunu hazırla.");return}
  try{await navigator.clipboard.writeText(value);toast("Komut kopyalandı!")}catch(e){$("resultPrompt").select();document.execCommand("copy");toast("Komut kopyalandı!")}
});
$("downloadPrompt").addEventListener("click",()=>{
  const value=$("resultPrompt").value;if(!value){toast("Önce video komutunu hazırla.");return}
  const blob=new Blob([value],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="bozzkurt-ai-video-komutu.txt";a.click();URL.revokeObjectURL(url);toast("TXT dosyası indiriliyor.");
});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("installBtn").classList.remove("hidden")});
$("installBtn").addEventListener("click",async()=>{if(!deferredInstall){toast("Chrome menüsünden 'Ana ekrana ekle' seçeneğini kullan.");return}deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("installBtn").classList.add("hidden")});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
