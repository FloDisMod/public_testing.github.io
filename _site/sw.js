const version = '20230423175007';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/media/2023/02/27/planetTexas2050/","/media/2023/02/03/wellcome-trust-announcement/","/media/2023/02/03/Eddie-on-Youtube/","/hide-posts/2023-01-24-kissingbugs-1/","/hide-posts/2023-01-25-model/","/hide-posts/2023-01-26-CERA/","/contact/","/digital_infra/","/education/","/elements/","/extension_outreach/","/project/flood_model/","/groups/","/blog/","/","/index_search/","/project/kissing_bug/","/manifest.json","/news/","/offline/","/ourteam/profile_al/","/ourteam/profile_becky/","/ourteam/profile_christy/","/ourteam/profile_clintDawson/","/ourteam/profile_eirik/","/ourteam/profile_example/","/ourteam/profile_jennifer/","/ourteam/profile_katherineBrown/","/ourteam/profile_liting/","/ourteam/profile_michael/","/ourteam/profile_paty/","/ourteam/profile_suzanne/","/ourteam/profile_tamer/","/ourteam/profile_will/","/publications/","/research_page/","/assets/search.json","/search/","/assets/styles.css","/thanks/","/redirects.json","/sitemap.xml","/robots.txt","/feed.xml","/assets/styles.css.map","/assets/logos/FloDisMod_Wordmark__tagline.png", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
