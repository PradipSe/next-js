const Koa = require('koa')
const next = require('next')
const cors = require('@koa/cors')
const Router = require('@koa/router')

const API = require('./routes/api')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

const applicationServerLog = () => {
	console.log(
		'\x1b[42m\x1b[37m%s\x1b[0m',
		'Application Started '
	)
	console.log('\x1b[42m\x1b[37m%s\x1b[0m', ' PORT: ', port)
}

app.nextConfig.poweredByHeader = false

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router() 

		/**
		 * First middleware that gets invoked first on every request
		 */
	server.use(async (ctx, next) => {
		ctx.serverState = {}
		// ctx.clientIP = getClientIP(ctx)
		ctx.deviceType = (ctx.headers['cf-device-type'] && ctx.headers['cf-device-type'].toLowerCase()) || 'mobile'
		// Setting isMobile flag in serverState for server side usage
		ctx.serverState.isMobile = ctx.deviceType === 'mobile'
			/**
			 * Maintain cookie to handle both desktop
			 * and Mobile view from server side
			 * This will give you "isMobile" as boolean response in cookie.
			 */
		ctx.deviceType === 'mobile'
			? ctx.cookies.set('isMobile', 'true', { httpOnly: false })
			: ctx.cookies.set('isMobile', 'false', { httpOnly: false })
		// Setting appCode
		ctx.appCode = ctx.deviceType === 'mobile' ? 'MERCHMWEB' : 'MERCHWEB'
		/**
			 * Setting header `true-client-ip` and `cf-device-type`
			 * for easier debugging and logging purposes
		 */
		// ctx.set('true-client-ip', ctx.clientIP)
		ctx.set('cf-device-type', ctx.deviceType)
		await next()
  })
  
	server
		.use(
			cors({
			origin: '*',
			allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
			}),
		)
		.use(async (ctx, next) => {
			await next()
		})

	server.use(async (ctx, next) => {
		ctx.status = 200
		ctx.set('X-Frame-Options', 'SAMEORIGIN')
		await next()
	})

  router.all('*', async (ctx) => {
    if(ctx.req.url.includes('/entertainment/buzz')) {
      ctx.req.url = ctx.req.url.replace('/entertainment/buzz', '')
    }
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(API.routes())
  server.use(router.routes())
  server.listen(port, err => {
    if (err) throw err
    applicationServerLog()
  })
  
})
