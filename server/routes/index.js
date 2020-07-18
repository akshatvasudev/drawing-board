const pageRoutesWrapper = require('./pages');
const authRoutesWrapper = require('./auth');
const store = require('data-store')('drawings');

exports.pageRoutes = (() => { return pageRoutesWrapper(store) })()
exports.authRoutes = (() => { return authRoutesWrapper(store) })()