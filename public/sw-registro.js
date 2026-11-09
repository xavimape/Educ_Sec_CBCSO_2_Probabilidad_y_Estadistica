// Registra el service worker. Vive en la raíz del sitio, junto a sw.js,
// así que su propia carpeta es el alcance correcto (funciona también en subruta).
(function () {
  if (!('serviceWorker' in navigator)) return;
  var script = document.currentScript;
  if (!script) return;
  var base = new URL('.', script.src).href;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register(new URL('sw.js', base).href, { scope: base }).catch(function () {});
  });
})();
