self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? {
        title: "Notification",
        body: "No content",
    };
    const title = data.title;
    const options = {
        body: data.body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: "window" }).then((clientsArr) => {
            const hadWindow = clientsArr.some((windowClient) => {
                return windowClient.url === "/"
                    ? (windowClient.focus(), true)
                    : false;
            });
            if (!hadWindow) {
                self.clients.openWindow("/");
            }
        })
    );
});
