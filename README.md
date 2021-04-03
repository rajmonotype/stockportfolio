Application Requirements:

Portfolio tracking API which allows adding/deleting/updating trades. Assume there is only one user who can have single portfolio. 

Basic functionality includes:
Adding trades for a security: Remember trade can be of 2 types - BUY or SELL.

Updating a trade**: All the fields of a given trade can be updated including trade type.

Removing a trade**: A trade of a security can be removed from the portfolio reverting the changes it had when it was added.

Fetching trades: Response should include all the securities and trades corresponding to it.

Fetching portfolio: It is an aggregate view of all securities in the portfolio with its final quantity and average buy price.

Fetching returns: This is something new which needs explanation. Please refer to the final table above after we place sell orders for WIPRO. This API call should respond with cumulative returns at any point of time of a particular portfolio. 

Formula for calculating cumulative returns is SUM((CURRENT_PRICE[ticker] - AVERAGE_BUY_PRICE[ticker]) * CURRENT_QUANTITY[ticker]) So in the example, cumulative returns will be, (1843.45 - 1833.45) * 5 + (329.25 - 319.25) * 5 + (535.00 - 438.57) * 7 = Rs. 775.01. Since in API you don’t have access to current price of any security, please assume current price is always Rs. 100 for any security.

Small stock portfolio sample code written in NodeJs and express

Solution with routes:

Base url: localhost:8080

// 1********* Fetch all trades resp to their tickerids **************

/v1/trades/fetch


"ril": {
	"txnid": {
		"tickerId": "ril",
		"avgPrice": 23.1,
		"qty": 1,
		"type": "buy",
		"ts": "2021-03-17T04:56:23.382Z"
	}
}

// 1*****************************************************************


// 2********* Add trade resp to their tickerid **********************

/v1/trades/add

// body sample in JSON

{
	"tickerId": "ril",
	"avgPrice": 23,
	"qty": 1,
	"type": "buy"
}

// 2*****************************************************************


// 3********* Modify trade resp to their tickerid *******************

/v1/trades/modify

{
	"tickerId": "ril",
	"avgPrice": 23,
	"qty": 1,
	"type": "buy"
}

// 3*****************************************************************


// 4********* Cancel trade resp to their tickerid *******************

/v1/trades/cancel?tickerid={tickerId}

tickerId - ex ril, tata

// 4*****************************************************************


// 5********* Fetch portfolio *******************

/v1/portfolio/fetchportfolio

// Get portfolio of user


"ril": {
	"tickerId": "ril",
	"avgPrice": 23.1,
	"qty": 1,
	"lastTxnId": "ade93c2b-7aa8-40d4-9440-b55aad891847",
	"ts": "2021-03-17T04:56:23.382Z"
}

// 5*****************************************************************


// 6********* Fetch portfolio returns *******************

/v1/portfolio/fetchportfolioreturns

// Get current amount of user's portfolio


{
    "total": 76.9
}

// 6*****************************************************************



Testing environments:

Node: v12.14.1

Database: in-Memory (persist till app lives)
