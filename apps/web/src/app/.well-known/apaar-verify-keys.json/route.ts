import { NextResponse } from "next/server";

export async function GET() {
  const keysPayload = {
    keys: [
      {
        kty: "OKP",
        crv: "Ed25519",
        kid: "ed25519-aicte-2026-key-01",
        use: "sig",
        alg: "EdDSA",
        x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo",
        issued_at: "2026-01-01T00:00:00Z",
        status: "ACTIVE",
        issuer: "AICTE APAAR-Verify Platform (SIH26263)",
      },
    ],
  };

  return NextResponse.json(keysPayload, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

