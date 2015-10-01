// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }

// =================================================
// Esty API Key: 3601iprtf5l3jbpbwg37ughm
// =================================================
// 
// // ===SEARCHBAR===

var searchKeyword = function(event){
		if (event.keyCode == 13){
			var searchbar = event.target
			var keyword = searchbar.value
			searchbar.value = ""
			location.hash = `search/${keyword}`
		}
	}

$('input').keypress(searchKeyword)

var goHome = function(){
	location.hash = 'home'
}

$('#logo').click(goHome)



// 
// ===ARROW EVENT LISTENERS===
// 

var navLeft = $('#navLeft')[0]
var navRight = $('#navRight')[0]

var test = function(){
	console.log('IT WORKED')
}

var matchId = function(){
	itemArray.forEach(function(item){
			if (item.listing_id == singleViewId){
				console.log("FOUND A MATCH")
				var itemMatch = item,
					singleMainImage = itemMatch.Images[0].url_570xN,
					singleDescription = itemMatch.description,
					singlePrice = itemMatch.price,
					singleState = itemMatch.state,
					singleTitle = itemMatch.title,
					singleQuantity = itemMatch.quantity,
					singleIndex = itemArray.indexOf(itemMatch)
					// singleAddImageOne = itemMatch.Images[1].url_170x135,
					// singleAddImageTwo = itemMatch.Images[2].url_170x135,
					// singleAddImageThree = itemMatch.Images[3].url_170x135,
					// singleAddImageFour = itemMatch.Images[4].url_170x135

				console.log(itemMatch)
				console.log(singleIndex)
				self.$el.html(`\
								<div id='singleMainImage'>\
									<img src = ${singleMainImage}>\
								</div>\
								<div id='singleTitle'>\
									<p> ${singleTitle}\
									</p>\
								</div>\
								<div id='singlePrice'>\
									<p> ${singlePrice}\
									</p>\
								</div>\
								<div id='singleState'>\
									<p> ${singleState.toUpperCase()}\
									</p>\
								</div>\
								<div id='singleQuantity'>\
									<p> ${singleQuantity}\
									</p>\
								</div>\
								<div id='singleDescription'>\
									<p> ${singleDescription}\
									</p>\
								</div>\
								<button type="button" id="navLeft" data-id=${singleViewId}>\
									<\
								</button>\
								<button type="button" id="navRight" data-id=${singleViewId}>\
									>\
								</button>\
								`)
			}
		})
}




// === COLLECTION ===
// 

var EtsyCollection = Backbone.Collection.extend({

	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo',

	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage&callback=',

	// url: 'http://openapi.etsy.com/v2/shops/:shop_id/listings/active?method=GET&api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage',

	// api_key: '3601iprtf5l3jbpbwg37ughm',

	parse: function(responseData){
		console.log(responseData)
		return responseData
	}

})


// === VIEWS ===

var GroupView = Backbone.View.extend({

	el: '#container',

	events: {
		'click img': 'showSingle',
		'click #itemTitle': 'showSingle'
	},

	displayGroup: function(){
		console.log('running displayGroup')
		var htmlString_Group = ''
		var itemArray = this.collection.models[0].attributes.results
		var self = this
		itemArray.forEach(function(item){
			var price = item.price,
				title = item.title,
				userId = item.user_id,
				listingId = item.listing_id,
				itemViews = item.views,
				listingImage = item.Images[0].url_170x135
				// listingIndex = item.indexOf()
			
			
			//checking to see if it has image. if it does not, it does not display the record. need to go in and refactor this.
			if(listingImage.length > 0){

				// If statement cuts off display title if its length is longer than 35 characters and adds ellipsis as needed. 
								
				if(title.length > 35){

					htmlString_Group += `<span id='listingBox'><div id='itemImage'><img data-id=${listingId} src=${listingImage}></div><div id='itemTitle'><p data-id=${listingId}>${title.slice(0,35)}...</p></div><div id ='itemPrice'><p>$${price}</p></div><div id='itemViews'><p>Views: ${itemViews}</p></div></span>`
										//the slice(0,35) above cuts the title so that it displays only the first 35 characters
				}

				else{
					htmlString_Group += `<span id='listingBox'><div id='itemImage'><img data-id=${listingId} src=${listingImage}></div><div id='itemTitle'><p data-id=${listingId}>${title}</p></div><div id ='itemPrice'><p>$${price}</p></div><div id='itemViews'><p>Views: ${itemViews}</p></div></span>`
				}
			}
		})

		self.$el.html(htmlString_Group)

	},

	showSingle: function(event){
		
		console.log('Clicked!')
		var imageClicked = event.target,
			listingHashId = imageClicked.getAttribute('data-id')
		location.hash = `listingDetail/${listingHashId}`
	},

	render: function(){
		console.log('GV rendering')
		console.log(this.collection)
		this.displayGroup()
	},
	

	initialize: function(){
		console.log('GV initialized')
		this.listenTo(this.collection, 'sync', this.render)

	}
	
})

var SingleView = Backbone.View.extend({

	el: '#container',

	events: {
		'click #navLeft':'displayPrevious',
		'click #navRight': 'displayNext'
	},

	displayNext: function(event){
		console.log('it worked right')
		var thisItemId = event.target.getAttribute('data-id'),
			itemArray = this.collection.models[0].attributes.results
		itemArray.forEach(function(item){
			if (item.listing_id == thisItemId){
				var itemMatch = item,
					thisItemIndex = itemArray.indexOf(itemMatch),
					nextItem = itemArray[thisItemIndex+1],
					nextItemId = nextItem.listing_id
				console.log(nextItemId)
				location.hash = `listingDetail/${nextItemId}`

			}
		})

	},

	displayPrevious: function(event){
		console.log('it worked right')
		var thisItemId = event.target.getAttribute('data-id'),
			itemArray = this.collection.models[0].attributes.results
		itemArray.forEach(function(item){
			if (item.listing_id == thisItemId){
				var itemMatch = item,
					thisItemIndex = itemArray.indexOf(itemMatch),
					nextItem = itemArray[thisItemIndex-1],
					nextItemId = nextItem.listing_id
				console.log(nextItemId)
				location.hash = `listingDetail/${nextItemId}`

			}
		})

	},
	
	displaySingle: function(){
		console.log('Running displaySingle')
		console.log(this.singleViewId)
		console.log(this)
		var singleViewId = this.singleViewId,
			itemArray = this.collection.models[0].attributes.results,
			itemMatch = '',
			self = this

		// search array of items to find the one that matches the hash listing id. then put that item's info in the el html.

		itemArray.forEach(function(item){
			if (item.listing_id == singleViewId){
				console.log("FOUND A MATCH")
				var itemMatch = item,
					singleMainImage = itemMatch.Images[0].url_570xN,
					singleDescription = itemMatch.description,
					singlePrice = itemMatch.price,
					singleState = itemMatch.state,
					singleTitle = itemMatch.title,
					singleViews = itemMatch.views,
					singleQuantity = itemMatch.quantity,
					singleIndex = itemArray.indexOf(itemMatch)
					// singleAddImageOne = itemMatch.Images[1].url_170x135,
					// singleAddImageTwo = itemMatch.Images[2].url_170x135,
					// singleAddImageThree = itemMatch.Images[3].url_170x135,
					// singleAddImageFour = itemMatch.Images[4].url_170x135

				console.log(itemMatch)
				console.log(singleIndex)
				self.$el.html(`\
								<div id='singleMainImage'>\
									<img src = ${singleMainImage}>\
								</div>\
								<div id='singleTitle'>\
									<p> ${singleTitle}\
									</p>\
								</div>\
								<div id='singlePrice'>\
									<p> $${singlePrice}\
									</p>\
								</div>\
								<div id='singleState'>\
									<p> ${singleState.toUpperCase()}\
									</p>\
								</div>\
								<div id='singleQuantity'>\
									<p> Quantity: ${singleQuantity}\
									</p>\
								</div>\
								<div id='singleViews'>\
									<p> Views: ${singleViews}\
									</p>\
								</div>\
								<div id='singleDescription'>\
									<p> ${singleDescription}\
									</p>\
								</div>\
								<button type="button" id="navLeft" data-id=${singleViewId}>\
									<\
								</button>\
								<button type="button" id="navRight" data-id=${singleViewId}>\
									>\
								</button>\
								`)
			}
		})
		
	},

	render: function(){
		console.log('SV rendering')
		this.displaySingle()
	},

	initialize: function(){
		console.log('SV initialized')
		// this.listenTo(this.collection, 'change', this.render)
	}

})


// === ROUTING ===


var EtsyRouter = Backbone.Router.extend({

	routes: {
			'listingDetail/:listingHashId': 'goSingleView',
			'search/:keyword': 'goKeywordSearch',
			'home':'goBackHome'
	},

	goSingleView: function(listingHashId){
		// var sv = new SingleView({collection:this.ec});
		this.sv.singleViewId = listingHashId
		this.sv.render();				
	},

	goBackHome: function(){
		var self = this
		// this.ec = new EtsyCollection();
		// this.gv = new GroupView({collection:this.ec});
		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				includes: 'Images'
			}
		}).done(function(){
			console.log('Fetch is done')
			})
	},

	goKeywordSearch: function(keyword){
		// this.search_ec = new EtsyCollection();
		// this.search_gv = new GroupView({collection:this.search_ec})
		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				keywords: keyword,
				includes: 'Images'
			}
		})

	},

	initialize: function() {
		var self = this
		this.ec = new EtsyCollection();
		this.gv = new GroupView({collection:this.ec});
		this.sv = new SingleView({collection:this.ec});
		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				includes: 'Images'
			}
		}).done(function(){
			console.log('Fetch is done')
			})
		Backbone.history.start()
	}

})

var er = new EtsyRouter();
















