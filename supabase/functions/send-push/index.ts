import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import * as webpush from "jsr:@negrel/webpush";

const PUBLIC_VAPID_KEY = Deno.env.get("PUBLIC_VAPID_KEY")!;
const PRIVATE_VAPID_KEY = Deno.env.get("PRIVATE_VAPID_KEY")!;

const vapidKeys = {
    publicKey: PUBLIC_VAPID_KEY,
    privateKey: PRIVATE_VAPID_KEY,
};

const vapid = await webpush.VAPID.generate(
    {
        subject: "mailto:your@email.com",
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
    },
);

serve(async (req: Request) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    };

    if (req.method === "OPTIONS") {
        return new Response("OK", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { subscription, payload } = await req.json();

        if (!subscription || !payload) {
            return new Response(
                JSON.stringify({ error: "Missing subscription or payload" }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }

        const endpoint = subscription.endpoint;
        const keys = {
            auth: subscription.keys.auth,
            p256dh: subscription.keys.p256dh,
        };

        await webpush.sendNotification({
            endpoint,
            keys,
            payload: JSON.stringify(payload),
            vapid,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    } catch (error: any) {
        console.error("Push error:", error);
        return new Response(
            JSON.stringify({ error: error.message ?? "Push failed" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
        );
    }
});
