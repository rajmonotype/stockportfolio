const routerTrade = require('./v1/trade');
const routerPortfolio = require('./v1/portfolio');

function createRouter(app) {
    app.get('/', (req, res) => {
        return res.send('Route not defined. Please choose another route');
    });

    routerTrade.initialize(app);
    routerPortfolio.initialize(app);
}

module.exports = { createRouter };
