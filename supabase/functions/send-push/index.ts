
import { serve } from "https://deno.land/std/http/server.ts";
import { encode as b64urlEncode } from "https://deno.land/std@0.203.0/encoding/base64url.ts";

const PUBLIC_VAPID_KEY = Deno.env.get("PUBLIC_VAPID_KEY")!;
const PRIVATE_VAPID_KEY = Deno.env.get("PRIVATE_VAPID_KEY")!;

// Convert Base64URL → Uint8Array
function base64UrlToUint8Array(base64: string): Uint8Array {
    const pad = "=".repeat((4 - base64.length % 4) % 4);
    const base64Str = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64Str);
    return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
}

// HKDF helper
async function hkdf(secret: Uint8Array, salt: Uint8Array, info: Uint8Array, length = 16) {
    const key = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const prkBits = await crypto.subtle.sign("HMAC", key, secret);
    const prkKey = await crypto.subtle.importKey("raw", prkBits, { name: "HKDF" }, false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, prkKey, length * 8);
    return new Uint8Array(bits);
}

async function encryptPayload(subscription: any, payload: string) {
    const encoder = new TextEncoder();
    const clientPublicKey = base64UrlToUint8Array(subscription.keys.p256dh);
    const clientAuth = base64UrlToUint8Array(subscription.keys.auth);
    const payloadUint8 = encoder.encode(payload);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const serverKeyPair = await crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" },
        true,
        ["deriveBits"]
    );

    const serverPublicKey = new Uint8Array(await crypto.subtle.exportKey("raw", serverKeyPair.publicKey));

    const clientKey = await crypto.subtle.importKey(
        "raw",
        clientPublicKey,
        { name: "ECDH", namedCurve: "P-256" },
        true,
        []
    );

    const sharedSecret = await crypto.subtle.deriveBits(
        { name: "ECDH", public: clientKey },
        serverKeyPair.privateKey,
        256
    );

    const prk = await hkdf(new Uint8Array(sharedSecret), clientAuth, new Uint8Array([]));
    const contentEncryptionKey = await hkdf(prk, salt, encoder.encode("Content-Encoding: aes128gcm"));
    const nonce = await hkdf(prk, salt, encoder.encode("Content-Encoding: nonce"));

    const contentCryptoKey = await crypto.subtle.importKey(
        "raw",
        contentEncryptionKey,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );

    const encryptedPayload = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: nonce },
        contentCryptoKey,
        payloadUint8
    );

    const headers = {
        salt: b64urlEncode(salt),
        dh: b64urlEncode(serverPublicKey),
    };

    return {
        encryptedPayload: new Uint8Array(encryptedPayload),
        headers,
    };
}

serve(async (req) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    };

    if (req.method === "OPTIONS") {
        return new Response("OK", { headers: corsHeaders });
    }

    const { subscription, payload } = await req.json();

    const { encryptedPayload, headers } = await encryptPayload(subscription, JSON.stringify(payload));

    const jwtHeader = b64urlEncode(JSON.stringify({ alg: "ES256", typ: "JWT" }));
    const jwtClaims = b64urlEncode(
        JSON.stringify({
            aud: new URL(subscription.endpoint).origin,
            exp: Math.floor(Date.now() / 1000) + 43200,
            sub: "mailto:you@example.com",
        })
    );
    const jwtData = `${jwtHeader}.${jwtClaims}`;

    const keyData = {
        kty: "EC",
        crv: "P-256",
        x: PUBLIC_VAPID_KEY,
        d: PRIVATE_VAPID_KEY,
        ext: true,
    };

    const key = await crypto.subtle.importKey("jwk", keyData, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(jwtData));
    const jwt = `${jwtData}.${b64urlEncode(new Uint8Array(sig))}`;

    const res = await fetch(subscription.endpoint, {
        method: "POST",
        headers: {
            Authorization: `WebPush ${jwt}`,
            TTL: "60",
            "Content-Encoding": "aes128gcm",
            "Content-Type": "application/octet-stream",
            "Encryption": `salt=${headers.salt}`,
            "Crypto-Key": `dh=${headers.dh};p256ecdsa=${PUBLIC_VAPID_KEY}`,
        },
        body: encryptedPayload,
    });

    return new Response(JSON.stringify({ status: res.status }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
