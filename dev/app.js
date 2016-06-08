'use strict'

import request from 'sync-request'
import fs from 'fs'
import util from 'util'

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

const BASE_URL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=timestamp&titles='

function dateArrayFor(name) {
	let url = scrape.constructURL(BASE_URL, name, 10)
	return scrape.fetchDates(scrape.fetchJSON(url))
			.map( i => i.timestamp)
}

function save(arr) {
	let str = util.inspect(arr)
	let file = __dirname+'/data/dates.js'
	fs.writeFileSync(file, str)
}

let arr = [
	{ name: 'Clinton', dates: dateArrayFor('Hillary_Clinton') },
	{ name: 'Trump', dates: dateArrayFor('Donald_Trump') },
	{ name: 'Cruz', dates: dateArrayFor('Ted_Cruz') },
	{ name: 'Kasich', dates: dateArrayFor('John_Kasich') },
	{ name: 'Sanders', dates: dateArrayFor('Bernie_Sanders') }
]

save(arr)
