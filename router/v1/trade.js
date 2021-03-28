const {
    controllerAddTrade,
    controllerModifyTrade,
    controllerCancelTrade,
    controllerFetchTrade,
    controllerRemoveSecurityFromPortfolio,
    controllerManagePortfolio,
} = require('../../controllers');

function initialize(app) {
    app.get('/v1/trades/:action', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const action = req.params.action;

        if(action !== 'fetch') {
            return res.send(JSON.stringify({
                errorMessage: 'Bad request',
                statusCode: 400,
                data: [],
            }));
        }
        // Get data after Sanitize in controller
        const tradeData = controllerFetchTrade(app);

        if(!tradeData.isValid) {
            return res.send(JSON.stringify({
                errMessage: tradeData.errorMessage,
                statusCode: tradeData.statusCode,
                data: tradeData.data,
            }));
        }

        return res.send(JSON.stringify({
            errMessage: tradeData.errorMessage,
            statusCode: tradeData.statusCode,
            data: tradeData.data,
        }));
    });

    app.post('/v1/trades/:action', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const action = req.params.action;
        const data = req.body;

        if(action !== 'add') {
            return res.send(JSON.stringify({
                errorMessage: 'Bad request',
                statusCode: 400,
                data: [],
            }));
        }

        // Update data after Sanitize in portfolio controller
        const responsePortfolioController = controllerManagePortfolio(app, data);

        if(!responsePortfolioController.isValid) {
            return res.send(JSON.stringify({
                errMessage: responsePortfolioController.errorMessage,
                statusCode: responsePortfolioController.statusCode,
                data: responsePortfolioController.data,
            }));
        }

        // Update data after Sanitize in trade controller
        const responseTradeController = controllerAddTrade(app, data);

        if(!responseTradeController.isValid) {
            return res.send(JSON.stringify({
                errMessage: responseTradeController.errorMessage,
                statusCode: responseTradeController.statusCode,
                data: responseTradeController.data,
            }));
        }

        return res.send(JSON.stringify({
            errMessage: responseTradeController.errorMessage,
            statusCode: responseTradeController.statusCode,
            data: responseTradeController.data,
        }));
    });

    app.put('/v1/trades/:action', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        const action = req.params.action;
        const data = req.body;

        if(action !== 'modify') {
            return res.send(JSON.stringify({
                errorMessage: 'Bad request',
                statusCode: 400,
                data: [],
            }));
        }

        const responsePortfolioController = controllerManagePortfolio(app, data);

        if(!responsePortfolioController.isValid) {
            return res.send(JSON.stringify({
                errMessage: responsePortfolioController.errorMessage,
                statusCode: responsePortfolioController.statusCode,
                data: responsePortfolioController.data,
            }));
        }

        const responseTradeController = controllerModifyTrade(app, data);

        return res.send(JSON.stringify({
            errMessage: responseTradeController.errorMessage,
            statusCode: responseTradeController.statusCode,
            data: responseTradeController.data,
        }));
    });

    app.delete('/v1/trades/:action', (req, res) => {
        const action = req.params.action;
        const data = req.query;

        res.setHeader('Content-Type', 'application/json');

        if(action !== 'cancel') {
            return res.send(JSON.stringify({
                errorMessage: 'Bad request',
                statusCode: 400,
                data: [],
            }));
        }

        const responsePortfolioController = controllerRemoveSecurityFromPortfolio(app, data);

        if(!responsePortfolioController.isValid) {
            return res.send(JSON.stringify({
                errMessage: responsePortfolioController.errorMessage,
                statusCode: responsePortfolioController.statusCode,
                data: responsePortfolioController.data,
            }));
        }

        const responseTradeController = controllerCancelTrade(app, data);

        if(!responseTradeController.isValid) {
            return res.send(JSON.stringify({
                errMessage: responseTradeController.errorMessage,
                statusCode: responseTradeController.statusCode,
                data: responseTradeController.data,
            }));
        }

        return res.send(JSON.stringify({
            errMessage: responseTradeController.errorMessage,
            statusCode: responseTradeController.statusCode,
            data: responseTradeController.data,
        }));
    });
}

module.exports = { initialize };
