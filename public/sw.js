//This is the service worker with the Cache-first network

var CACHE = 'pwabuilder-precache';
var precacheFiles = [
  // main
  '/',
  // css
  '/font.css',
  '/style.css',
  '/reset.css',
  // manifest
  '/manifest.json',
  // js
  '/script.js',
  '/sw-register.js',
  '/sw.js',
  // favicon
  'https://cdn.glitch.com/86c99ebe-0198-4c6e-8de1-c4e515e04792%2Ffavicon.png?1546264249921',
  // icon font
  'https://cdn.glitch.com/e7b50d85-6473-4a0f-9575-f45e36b88b3e%2Ficofont.eot??v=1.0.0-beta#iefix',
  'https://cdn.glitch.com/e7b50d85-6473-4a0f-9575-f45e36b88b3e%2Ficofont.eot??v=1.0.0-beta',
  'https://cdn.glitch.com/e7b50d85-6473-4a0f-9575-f45e36b88b3e%2Ficofont.ttf??v=1.0.0-beta',
  'https://cdn.glitch.com/e7b50d85-6473-4a0f-9575-f45e36b88b3e%2Ficofont.woff?v=1.0.0-beta',
  'https://cdn.glitch.com/e7b50d85-6473-4a0f-9575-f45e36b88b3e%2Ficofont.svg?v=1.0.0-beta#icofont',
  // qotd.. too easy to hit 429.. and what good is a cached QOD anyway?
  // 'https://quotes.rest/qod',
  // chart lib
  'https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.js',
  'https://cdnjs.cloudflare.com/ajax/libs/chartist/0.11.0/chartist.min.css',
  // google fonts
  'https://fonts.googleapis.com/css?family=Patrick+Hand|Sacramento|Coming+Soon',
  'https://fonts.gstatic.com/s/sacramento/v5/buEzpo6gcdjy0EiZMBUG4C0f_f5Iai0.woff2',
  'https://fonts.gstatic.com/s/patrickhand/v11/LDI1apSQOAYtSuYWp8ZhfYe8XsLLubg58w.woff2',
  'https://fonts.gstatic.com/s/comingsoon/v8/qWcuB6mzpYL7AJ2VfdQR1t-VWDnRsDkg.woff2',
  // jquery
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.0/jquery.js',
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(evt) {
  console.log('[PWA Builder] The service worker is being installed.');
  /*
  evt.waitUntil(precache().then(function() {
    console.log('[PWA Builder] Skip waiting on install');
    return self.skipWaiting();
  }));
  */
});


//allow sw to control of current page
self.addEventListener('activate', function(event) {
  console.log('[PWA Builder] Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  console.log('[PWA Builder] The service worker is serving the asset.'+ evt.request.url);
  evt.respondWith(/*fromCache(evt.request).catch(*/fromServer(evt.request))/*)*/;
  //evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the 
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request){
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request).then(function(response){ return response});
}
