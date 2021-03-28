const {
    addTrade,
    fetchTrade,
    cancelTrade,
    modifyTrade,
} = require('./trade');

const {
    fetchPortfolio,
    fetchPortfolioReturns,
    managePortfolio,
    removeSecurityFromPortfolio,
} = require('./portfolio');


module.exports = {
    controllerAddTrade: addTrade,
    controllerModifyTrade: modifyTrade,
    controllerCancelTrade: cancelTrade,
    controllerFetchTrade: fetchTrade,
    controllerManagePortfolio: managePortfolio,
    controllerFetchPortfolio: fetchPortfolio,
    controllerFetchPortfolioReturns: fetchPortfolioReturns,
    controllerRemoveSecurityFromPortfolio: removeSecurityFromPortfolio,
};
