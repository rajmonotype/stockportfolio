const {
    managePortfolio,
} = require('../portfolio');
const { v4: uuid } = require('uuid');

const TRADES_SUPPORTED = new Set(['buy', 'sell']);

function fetchTrade(app, requestFields) {
        const existingTradeData = app.get('trades') || {};

        if (Object.keys(existingTradeData).length === 0) {
            return {
                isValid: false,
                errorMessage: 'Data not exist',
                statusCode: 404,
                data: [],
            };
        }

        return {
            isValid: true,
            errorMessage: '',
            statusCode: 200,
            data: existingTradeData,
        };
}

function manangeTrade(app, requestFields) {
    const {
        tickerId,
        avgPrice,
        qty,
        type,
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

    const existingPortfolioData = app.get('portfolio') || {};

    if (!existingPortfolioData[tickerId]) {
        return {
            isValid: false,
            errorMessage: 'Security not exist',
            statusCode: 409,
            data: [],
        };
    }
    const { lastTxnId, } = existingPortfolioData[tickerId];
    const existingTradeData = app.get('trades') || {};
    const existingTradeDataOfSecurity = existingTradeData[tickerId] || {};

    const updatedTradeDataOfSecurity = {
        [lastTxnId]: {
            tickerId,
            avgPrice,
            qty,
            type,
            ts: new Date(),
        },
        ...existingTradeDataOfSecurity,
    };

    existingTradeData[tickerId] = updatedTradeDataOfSecurity;

    // Save
    app.set('trades', existingTradeData);

    return {
        isValid: true,
        errorMessage: '',
        statusCode: 201,
        data: existingTradeData,
    };
}

function addTrade(app, requestFields) {
    return manangeTrade(app, requestFields);
}

// TODO:: Some confusion abt modify api, seems that same constraints and functionality of add api are followed is in modify api
function modifyTrade(app, requestFields) {
    return manangeTrade(app, requestFields);
}

function cancelTrade(app, requestFields) {
    const {
        tickerid,
    } = requestFields;

    const existingPortfolioData = app.get('portfolio') || {};

    if (!existingPortfolioData[tickerid]) {
        return {
            isValid: false,
            errorMessage: 'Security is not traded or already cancelled',
            statusCode: 404,
            data: [],
        };
    }

    const { lastTxnId, avgPrice,  } = existingPortfolioData[tickerid];

    const existingTradeData = app.get('trades') || {};

    if (!existingTradeData[tickerid]) {
        return {
            isValid: false,
            errorMessage: 'Security is not traded or already cancelled',
            statusCode: 404,
            data: [],
        };
    }

    const uniqueId = uuid();

    existingTradeData[tickerid][uniqueId] = {};
    existingTradeData[tickerid][uniqueId].tickerId = tickerid;
    existingTradeData[tickerid][uniqueId].avgPrice = avgPrice;
    existingTradeData[tickerid][uniqueId].qty = 0;
    existingTradeData[tickerid][uniqueId].type = 'cancelled';
    existingTradeData[tickerid][uniqueId].ts = new Date();

    // Manage Trades data
    app.set('trades', existingTradeData);

    return {
        isValid: true,
        errorMessage: '',
        statusCode: 201,
        data: existingTradeData[tickerid][uniqueId],
    };
}

module.exports = {
    fetchTrade,
    addTrade,
    modifyTrade,
    cancelTrade,
}
