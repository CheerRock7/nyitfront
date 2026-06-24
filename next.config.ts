import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the native `pg` driver out of the bundler so it loads at runtime.
  serverExternalPackages: ["pg"],
  // Allow phone testing through an ngrok HTTPS tunnel during dev (camera APIs
  // require a secure context, which ngrok provides). Harmless in production.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.app", "*.ngrok.io"],
  // Proxy product images through this app's own origin so they load over the
  // page's protocol (HTTPS via ngrok) instead of the VPS's HTTP — otherwise the
  // browser blocks them as mixed content. UPLOADS_ORIGIN defaults to the VPS.
  async rewrites() {
    const origin = process.env.UPLOADS_ORIGIN || "http://194.233.88.142:3000";
    return [{ source: "/uploads/:path*", destination: `${origin}/uploads/:path*` }];
  },
};

export default nextConfig;
