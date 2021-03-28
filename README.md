Small stock portfolio sample code written in NodeJs and express

Base url: localhost:8080
// ********* Fetch all trades resp to their tickerids **************
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
// *****************************************************************

// ********* Add trade resp to their tickerid **********************
/v1/trades/add
// body sample in JSON
{
	"tickerId": "ril",
	"avgPrice": 23,
	"qty": 1,
	"type": "buy"
}
// *****************************************************************

// ********* Modify trade resp to their tickerid *******************
/v1/trades/modify
{
	"tickerId": "ril",
	"avgPrice": 23,
	"qty": 1,
	"type": "buy"
}
// *****************************************************************

// ********* Cancel trade resp to their tickerid *******************
/v1/trades/cancel?tickerid={tickerId}
tickerId - ex ril, tata
// *****************************************************************

// ********* Fetch portfolio *******************
/v1/portfolio/fetchportfolio
// Get portfolio of user

"ril": {
	"tickerId": "ril",
	"avgPrice": 23.1,
	"qty": 1,
	"lastTxnId": "ade93c2b-7aa8-40d4-9440-b55aad891847",
	"ts": "2021-03-17T04:56:23.382Z"
}
// *****************************************************************

// ********* Fetch portfolio returns *******************
/v1/portfolio/fetchportfolioreturns
// Get current amount of user's portfolio

{
    "total": 76.9
}
// *****************************************************************


Testing environments:
Node: v12.14.1
Database: in-Memory (persist till app lives)
