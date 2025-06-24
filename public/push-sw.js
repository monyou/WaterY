self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const title = data.title || "Notification Title";
    const options = {
        body: data.body || "Default message body!",
        icon: "/icon-192x192.png",
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
