import { NextResponse } from "next/server";

import { adsensePublisherId } from "@/lib/adsense";

export function GET() {
  const body = adsensePublisherId
    ? `google.com, ${adsensePublisherId}, DIRECT, f08c47fec0942fa0\n`
    : "# Configure NEXT_PUBLIC_ADSENSE_CLIENT to publish your ads.txt entry.\n";

  return new NextResponse(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
