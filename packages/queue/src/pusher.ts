import Pusher from "pusher";

export const pusher = new Pusher({
    appId: "soketi",
    key: "soketi",
    secret: "soketi",
    useTLS: false,
    host: "localhost",
    port: '6001',
})