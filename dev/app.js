'use strict'

import request from 'sync-request'

const scrape = {

	constructURL: function(base, title, limit) {
		return base+title+'&rvlimit='+limit
	},

	fetchJSON: function(url) {
		let res = request('GET', url)
		return JSON.parse(res.getBody('utf-8'))
	},

	fetchDates: function(json) {
		let key = Object.keys(json["query"]["pages"])
		if (key in json["query"]["pages"]) {
			return(json["query"]["pages"][key]["revisions"])
		} else {
			console.log("I can't parse this schema!")
			return false
		}
	}
}

let baseURL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=timestamp&titles='
let url = scrape.constructURL(baseURL, 'Donald_Trump', 500)
let dates = scrape.fetchDates(scrape.fetchJSON(url))
console.log(dates)