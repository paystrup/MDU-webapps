
//Doesnt do anything but has to present
self.addEventListener("fetch", function(event) {
    event.respondWith(fetch(event.request));
});