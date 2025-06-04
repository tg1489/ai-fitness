// Import Clerk's middleware utilities from the Next.js server package
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes should require authentication
// These are considered "protected routes"
const isProtectedRoute = createRouteMatcher(["/generate-program", "/profile"]);

// Define and export the custom middleware using Clerk's built-in middleware wrapper
export default clerkMiddleware(async (auth, req) => {
  // If the requested route is protected, enforce authentication
  if (isProtectedRoute(req)) await auth.protect();
  // If not a protected route, do nothing and allow the request to proceed
});

// Export Next.js middleware configuration
export const config = {
  matcher: [
    // This pattern matches any route that is not:
    // - an internal Next.js route (like /_next)
    // - or a static file (e.g. .css, .js, .png, .jpg, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run middleware on API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
