const {
    controllerFetchPortfolio,
    controllerFetchPortfolioReturns,
} = require('../../controllers');


function initialize(app) {
    app.get('/v1/portfolio/:action', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const action = req.params.action;

        if (action === 'fetchportfolio') {
            const response = controllerFetchPortfolio(app);

            if(response.isValid) {
                return res.send(JSON.stringify({
                    errMessage: response.errorMessage,
                    statusCode: response.statusCode,
                    data: response.data,
                }));
            }
        }

        if (action === 'fetchportfolioreturns') {
            const response = controllerFetchPortfolioReturns(app);

            if(response.isValid) {
                return res.send(JSON.stringify({
                    errMessage: response.errorMessage,
                    statusCode: response.statusCode,
                    data: response.data,
                }));
            }
        }

        return res.send(JSON.stringify({
            errorMessage: 'Bad request',
            statusCode: 400,
            data: [],
        }));
    });
}

module.exports = { initialize };
