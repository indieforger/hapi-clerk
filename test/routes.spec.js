'use strict';
// Test suite
const Hapi = require('hapi');
const Code = require('code');
const Hoek = require('hoek');
const Lab = require('lab');

// Helpers
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const before = lab.before;
const beforeEach = lab.beforeEach;
const afterEach = lab.afterEach;
const after = lab.after;
const it = lab.it;
const expect = Code.expect;

// Internals
const proxyquire = require('proxyquire').noCallThru();
const mockPluginOpts = {
	topics: [{
		code: 'tac',
		info: 'Terms and Conditions',
		required: false
	}]
}

// Locals
let subscriberStub = {};
let server;

before(function (next) {
	let Routes = proxyquire('../lib/subscriber/routes', { './model': subscriberStub });
	let routePlugin = function (srv, opts, next ) {
		srv.route(Routes);
		next();
	};
	routePlugin.attributes = { name: 'routes' };

	server = new Hapi.Server({ debug: false });
	server.connection( { labels: 'api' });
	server.register({ register: routePlugin, options: mockPluginOpts })

	next();
});

describe('GET /topics', function () {

	it('should reply (200) with subscription topics', (done) => {
			server.inject({ method: 'GET', url: '/topics' }, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.payload).to.exist();
				expect(res.result).to.exist();
				expect(res.result).to.equal(mockPluginOpts.topics);
				done();
			});
		});
});

describe('GET /user/{userId}/topics', function () {

	it('should reply (200) with subscription topics', (done) => {
		let userId = '123qwe123asd123zxc123';
		let topics = ['qwe', 'asd'];

		subscriberStub.findById = function () {
			return new Promise(function(resolve, reject) {
				resolve({ toObject: () => ({ topics: topics}) })
			});
		};

		server.inject({ method: 'GET', url: `/user/${userId}/topics` }, (res) => {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.exist();

			done();
		});
	});

	it('should reply (500) with implementation error', (done) => {
		let userId = '123qwe123asd123zxc123';

		subscriberStub.findById = function () {
			return new Promise(function(resolve, reject) {
				reject(new Error("Expected implementation error."))
			})
		}

		server.inject({ method: 'GET', url: `/user/${userId}/topics` }, (res) => {
			expect(res.statusCode).to.equal(500);
			done();
		});
	});


	it('should reply with 404 for invalid user', (done) => {
		let userId = '123qwe123asd123zxc123';
		let topics = ['qwe', 'asd'];

		subscriberStub.findById = function () {
			return new Promise(function(resolve, reject) {
				resolve(null);
			});
		};

		server.inject({ method: 'GET', url: `/user/${userId}/topics` }, (res) => {
			expect(res.statusCode).to.equal(404);

			done();
		});
	});

});

describe('PUT /user/{userId}/topics', function () {

	it('should reply (200) with subscription topics', (done) => {
		throw Error('Not implemented yet');
	});

	it('should reply with 404 for invalid user', (done) => {
		throw Error('Not implemented yet');
	});

});