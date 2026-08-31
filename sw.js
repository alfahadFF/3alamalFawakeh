self.addEventListener('fetch', (event) => {
  // تمرير الطلبات بشكل طبيعي عبر الشبكة لضمان عمل البطاقة بسلاسة
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
