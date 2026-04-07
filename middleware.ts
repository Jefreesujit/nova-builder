import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Domain configuration
const BUILDER_DOMAIN = "app.novabuilder.com";
const SITES_DOMAIN = "novabuilder.app";
const MARKETING_DOMAIN = "novabuilder.com";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // First, update the Supabase session
  const response = await updateSession(request);

  // For local development, handle localhost differently
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isLocalhost) {
    // In local development, use path-based routing
    // /sites/[subdomain] is accessible directly
    return response;
  }

  // Production subdomain routing

  // 1. Builder App: app.novabuilder.com -> serve builder routes
  if (hostname === BUILDER_DOMAIN || hostname.startsWith("app.")) {
    // Builder routes are served from /(builder)/* group
    // No rewrite needed as they're the default
    return response;
  }

  // 2. Marketing Site: novabuilder.com (no subdomain) -> serve marketing
  if (hostname === MARKETING_DOMAIN || hostname === `www.${MARKETING_DOMAIN}`) {
    // Marketing routes are served from /(marketing)/* group
    // No rewrite needed as they're the default
    return response;
  }

  // 3. User Sites: *.novabuilder.app -> rewrite to /sites/[subdomain]
  if (hostname.endsWith(`.${SITES_DOMAIN}`) || hostname.endsWith(".novabuilder.app")) {
    // Extract subdomain from hostname
    const subdomain = hostname.replace(`.${SITES_DOMAIN}`, "").replace(".novabuilder.app", "");

    if (subdomain && subdomain !== "www") {
      // Rewrite to internal sites route WITHOUT redirecting
      url.pathname = `/sites/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
