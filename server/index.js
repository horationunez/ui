const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');

const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';

const app = express();

function createRenderer (bundle, options) {
	// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
	return createBundleRenderer(bundle, Object.assign(options, {
		// recommended for performance
		runInNewContext: false
	}));
}

let renderer;
let readyPromise;
const templatePath = resolve('../src/index.template.html');

if (isProd) {
	// In production: create server renderer using template and built server bundle.
	// The server bundle is generated by vue-ssr-webpack-plugin.
	const template = fs.readFileSync(templatePath, 'utf-8')
	const bundle = require('../dist/vue-ssr-server-bundle.json');
	// The client manifests are optional, but it allows the renderer
	// to automatically infer preload/prefetch links and directly add <script>
	// tags for any async chunks used during render, avoiding waterfall requests.
	const clientManifest = require('../dist/vue-ssr-client-manifest.json');
	renderer = createRenderer(bundle, {
		template,
		clientManifest
	});
} else {
	// In development: setup the dev server with watch and hot-reload,
	// and create a new renderer on bundle / index template update.
	readyPromise = require('../build/setup-dev-server')(
		app,
		templatePath,
		(bundle, options) => {
			renderer = createRenderer(bundle, options);
		}
	)
}

// Express Config
app.use(express.static('dist'));
// TODO: PWA Manifest
// app.use(express.static('/manifest.json'));

function render (req, res) {
	console.log('---------> rendering server');
	const s = Date.now();

	res.setHeader("Content-Type", "text/html");

	const handleError = err => {
		if (err.url) {
			res.redirect(err.url);
		} else if(err.code === 404) {
			res.status(404).send('404 | Page Not Found');
		} else {
			// Render Error Page or Redirect
			res.status(500).send('500 | Internal Server Error');
			console.error(`error during render : ${req.url}`);
			console.error(err.stack);
		}
	}

	const context = {
		title: 'Kiva.org', // default title
		url: req.url
	};

	renderer.renderToString(context, (err, html) => {
		if (err) {
		return handleError(err)
		}
		res.send(html);
		if (!isProd) {
			console.log(`whole request: ${Date.now() - s}ms`);
		}
	});
}

app.get('*', isProd ? render : (req, res) => {
	readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
