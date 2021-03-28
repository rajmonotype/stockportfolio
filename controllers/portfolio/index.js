const { v4: uuid } = require('uuid');

const TRADES_SUPPORTED = new Set(['buy', 'sell']);
const CURRENT_PRICE = 100;

function fetchPortfolio(app) {
        const existingPortfolioData = app.get('portfolio') || {};

        if (Object.keys(existingPortfolioData).length === 0) {
            return {
                isValid: false,
                errorMessage: 'Portfolio not exist',
                statusCode: 404,
                data: [],
            };
        }

        const securitiesWithValidQuantity = {};

        Object.keys(existingPortfolioData).forEach((security) => {
            if (existingPortfolioData[security].qty > 0) {
                securitiesWithValidQuantity[security] = existingPortfolioData[security];
            }
        });

        return {
            isValid: true,
            errorMessage: '',
            statusCode: 200,
            data: securitiesWithValidQuantity,
        };
}

function fetchPortfolioReturns(app) {
    const existingPortfolioData = app.get('portfolio') || {};

    if (Object.keys(existingPortfolioData).length === 0) {
        return {
            isValid: false,
            errorMessage: 'Portfolio not exist',
            statusCode: 404,
            data: [],
        };
    }

    const securitiesWithValidQuantity = {};

    Object.keys(existingPortfolioData).forEach((security) => {
        if (existingPortfolioData[security].qty > 0) {
            securitiesWithValidQuantity[security] = existingPortfolioData[security];
        }
    });

    let sum = 0;

    Object.keys(securitiesWithValidQuantity).forEach((security) => {
        sum += (CURRENT_PRICE - securitiesWithValidQuantity[security].avgPrice) * securitiesWithValidQuantity[security].qty;
    });

    return {
        isValid: true,
        errorMessage: '',
        statusCode: 200,
        data: { total: sum },
    };
}

function managePortfolio(app, requestFields) {
    const {
        tickerId,
        avgPrice,
        qty,
        type
    } = requestFields;

    // Sanitize checks
    if (!tickerId
        || !avgPrice
        || avgPrice <= 0
        || !qty
        || qty <= 0
        || !TRADES_SUPPORTED.has(type)) {

        return {
            isValid: false,
            errorMessage: 'Bad request',
            statusCode: 400,
            data: [],
        };
    }

    let portfolioData = app.get('portfolio') || {};

    if (type === 'buy') {
        //If security not exist
        if (!portfolioData[tickerId]) {
            portfolioData[tickerId] = {
                tickerId,
                avgPrice,
                qty,
                lastTxnId: uuid(), // last txn id
                ts: new Date(),
            };
        } else {
            //If security exist
            const updatedQty = portfolioData[tickerId].qty + qty;
            const updatedAvgPrice = ((portfolioData[tickerId].avgPrice * portfolioData[tickerId].qty) + (avgPrice * qty)) / updatedQty;
            portfolioData[tickerId].qty = updatedQty;
            portfolioData[tickerId].avgPrice = updatedAvgPrice;
            portfolioData[tickerId].lastUpdatedTs = new Date();
            portfolioData[tickerId].lastTxnId = uuid();
        }
    } else if (type === 'sell') {
        const portfolioData = app.get('portfolio') || {};
        //If security not exist
        if (!portfolioData[tickerId]) {
            return {
                isValid: false,
                errorMessage: 'Security not exist to sell',
                statusCode: 404,
                data: [],
            };
        } else {
            if (qty > portfolioData[tickerId].qty) {
                return {
                    isValid: false,
                    errorMessage: 'Selling Quantity is more than inventory to sell',
                    statusCode: 404,
                    data: [],
                };
            }

            const updatedQty = portfolioData[tickerId].qty - qty;
            portfolioData[tickerId].qty = updatedQty;
            portfolioData[tickerId].lastUpdatedTs = new Date();
            portfolioData[tickerId].lastTxnId = uuid();
        }
    }

    // Save
    app.set('portfolio', portfolioData);

    return {
        isValid: true,
        errorMessage: '',
        statusCode: 200,
        data: portfolioData,
    };
}

function removeSecurityFromPortfolio(app, requestFields) {
    const {
        tickerid,
    } = requestFields;

    // Sanitize checks
    if (!tickerid) {
        return {
            isValid: false,
            errorMessage: 'Bad request',
            statusCode: 400,
            data: [],
        };
    }

    const tradeData = app.get('trades') || {};
    const portfolioData = app.get('portfolio') || {};

    //If security not exist
    if (!portfolioData[tickerid] || !tradeData[tickerid]) {
        return {
            isValid: false,
            errorMessage: 'Security not exist to cancel',
            statusCode: 404,
            data: [],
        };
    }

    if (portfolioData[tickerid].qty === 0) {
        return {
            isValid: false,
            errorMessage: 'Already deleted or not existed',
            statusCode: 200,
            data: [],
        };
    }

    const updatedQty = 0;
    portfolioData[tickerid].qty = updatedQty;
    portfolioData[tickerid].lastUpdatedTs = new Date();

    // Save
    app.set('portfolio', portfolioData);

    return {
        isValid: true,
        errorMessage: '',
        statusCode: 200,
        data: portfolioData,
    };
}

module.exports = {
    fetchPortfolio,
    fetchPortfolioReturns,
    managePortfolio,
    removeSecurityFromPortfolio,
}
