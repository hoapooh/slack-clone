import {
	convexAuthNextjsMiddleware,
	createRouteMatcher,
	nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server"

const isPublicPage = createRouteMatcher(["/auth"])

export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
	console.log("Hello" + convexAuth.isAuthenticated())
	if (!isPublicPage(request) && !convexAuth.isAuthenticated()) {
		// console.log(convexAuth.isAuthenticated())

		return nextjsMiddlewareRedirect(request, "/auth")
	}
	// TODO: Redirect user away from "/auth" if they are already authenticated
	if (isPublicPage(request) && convexAuth.isAuthenticated()) {
		console.log("User is authenticated, redirecting...")
		return nextjsMiddlewareRedirect(request, "/")
	}
})

export const config = {
	// The following matcher runs middleware on all routes
	// except static assets.
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
