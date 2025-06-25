import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import * as webpush from "jsr:@negrel/webpush";

const vapidKeysJson = Deno.env.get("VAPID_KEYS")!;

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

        webpush.importVapidKeys(JSON.parse(vapidKeysJson));
        const appServer = await webpush.ApplicationServer.new({
            contactInformation: "mailto:monyou@abv.bg",
            vapidKeys: JSON.parse(vapidKeysJson),
        });
        const sub = appServer.subscribe(subscription);
        sub.pushMessage(JSON.stringify(payload), {});

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
