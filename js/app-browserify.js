// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	Parse = require('parse'),
	React = require('react')

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

// ===== PARSE initialize =====

var APP_ID = 'kZfMFDyMl0wmoibO915tIHco0zUBk80Ssw2p98SK',
	JS_KEY = 'FUMUfRZjafTmcwUt8klfoACUyuugQNJAObqgSD0S',
	REST_API_KEY = '1m0jJfZipYjFwoDHmjKluAytzCcmp7mT7F4tGp0M'

Parse.initialize(APP_ID,JS_KEY)


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

// === RETURN TO HOMEPAGE ===

var goHome = function(){
	location.hash = 'home'
}

$('#logo').click(goHome)


// === GO TO FAVORITES ===

var viewFavorites = function(){
	location.hash = 'favorites'
}

$('#favoritesTab').click(viewFavorites)


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



// === MODELS ===
// 


var EtsyModel = Backbone.Model.extend({

	// url: 'https://openapi.etsy.com/v2/listings/' + showSingle() +'.js?api_key=aavnvygu0h5r52qes74x9zvo',

	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage&callback=',

	// url: 'http://openapi.etsy.com/v2/shops/:shop_id/listings/active?method=GET&api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage',

	// api_key: '3601iprtf5l3jbpbwg37ughm',

	parse: function(responseData){
		console.log('Fetch is done')
		return responseData
	}

})

var FavModel = Backbone.Model.extend({
	url: "https://api.parse.com/1/classes/FavItem",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	}
})


// === COLLECTIONS ===
// 

var EtsyCollection = Backbone.Collection.extend({

	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo',

	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage&callback=',

	// url: 'http://openapi.etsy.com/v2/shops/:shop_id/listings/active?method=GET&api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage',

	// api_key: '3601iprtf5l3jbpbwfg37ughm',

	parse: function(responseData){
		return responseData
	}

})

var StoreCollection = Backbone.Collection.extend({

	parse: function(responseData){
		console.log('store fetch done')
		return responseData
	}

})

var FavCollection = Backbone.Collection.extend({
	url: "https://api.parse.com/1/classes/FavItem",

	parseHeaders: {
		"X-Parse-Application-Id": APP_ID,
		"X-Parse-REST-API-Key": REST_API_KEY
	},

	model: FavModel,

	parse: function(responseData){
		return responseData.results
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
		console.log(this)
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
		return listingHashId
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

var StoreView = Backbone.View.extend({

	el: '#container',

	events: {
		'click img': 'showSingle',
		'click #itemTitle': 'showSingle'
	},

	displayStore: function(){
		console.log('running displayStore')
		console.log(this)
		var htmlString_Group = ''
		var itemArray = this.collection.models[0].attributes.results[0].Listings
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
		console.log('Store rendering')
		console.log(this.collection)
		this.displayStore()
	},
	

	initialize: function(){
		console.log('GV initialized')

	}
	
})

var SingleView = Backbone.View.extend({

	el: '#container',

	events: {
		'click #navLeft':'displayPrevious',
		'click #navRight': 'displayNext',
		'click #storeIcon' : 'goDisplayStore',
		'click #storeName': 'goDisplayStore',
		'click img': 'goDisplayMore',
		'click #moreItemOneName' : 'goDisplayMore',
		'click #moreItemTwoName': 'goDisplayMore',
		'click #favoriteButton': 'makeFavorite',
	},

	goDisplayMore: function(event){
		var itemClicked = event.target.getAttribute('data-id')
		location.hash = 'listingDetail/' + itemClicked
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

		// ===== PARSE OBJECTS =====

	makeFavorite: function(){


		var singleViewId = this.singleViewId,
			thisItem = this.model.attributes.results[0],
			singleSmallImage = thisItem.Images[0].url_170x135,
			singleLargeImage = thisItem.Images[0].url_570xN,
					singleDescription = thisItem.description,
					singlePrice = thisItem.price,
					singleState = thisItem.state,
					singleTitle = thisItem.title,
					singleViews = thisItem.views,
					singleQuantity = thisItem.quantity

		var FavItem = Parse.Object.extend({
			className: 'FavItem'
		})

		var favItem = new FavItem()

		favItem.save({
			itemTitle: singleTitle,
			itemPrice: singlePrice,
			itemImage: singleSmallImage,
			itemId: singleViewId,
			itemViews: singleViews

		}).then(function(){alert('This item has been added to your favorites.')})
	},

// ==== end PARSE object ====
	
	displaySingle: function(){
		console.log('Running displaySingle')
		console.log(this)
		console.log(this.model.attributes)
		var shopId = this.model.attributes.results[0].Shop.shop_id

		var self = this

		var singleViewId = this.singleViewId,
			thisItem = this.model.attributes.results[0],
			singleMainImage = thisItem.Images[0].url_570xN,
					singleDescription = thisItem.description,
					singlePrice = thisItem.price,
					singleState = thisItem.state,
					singleTitle = thisItem.title,
					singleViews = thisItem.views,
					singleQuantity = thisItem.quantity
					// singleIndex = itemArray.indexOf(itemMatch)
					// singleAddImageOne = itemMatch.Images[1].url_170x135,
					// singleAddImageTwo = itemMatch.Images[2].url_170x135,
					// singleAddImageThree = itemMatch.Images[3].url_170x135,
					// singleAddImageFour = itemMatch.Images[4].url_170x135


		// ACCESS STORE INFO
		var storeName = thisItem.Shop.shop_name,
			storeIcon = thisItem.Shop.icon_url_fullxfull,
			storeWelcome = thisItem.Shop.policy_welcome

		if (storeIcon === null){
			storeIcon = 'images/avatar.png'
		}


		// ACCESS ADDITIONAL STORE LISTINGS
		var moreFromStore = this.collection.models[0].attributes.results[0].Listings

		console.log('more from store:')
		console.log(moreFromStore)

		this.$el.html(`\
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
						<button id='favoriteButton' type='button'>Favorite</button>
						<hr>\
						<div id='storeSection'>\
							<p>VISIT THE SHOP\
							</p>\
						</div>\
						<div id='storeIcon'>\
							<img src='${storeIcon}'>\
						</div>\
						<div id='storeName'>\
							<p>${storeName}\
							</p>\
						</div>\
						<hr>\
						<div id='moreFromSeller'>\
							<p>MORE ITEMS FROM THIS SHOP\
							</p>\
						</div>\
						<div id = 'moreItems'>\
							<div id= 'moreItemOne'>\
							<img src = '${moreFromStore[1].Images[0].url_170x135}' data-id='${moreFromStore[1].listing_id}'>
							</div>\
							<div data-id='${moreFromStore[1].listing_id}'>\
								<p id= 'moreItemOneName' data-id='${moreFromStore[1].listing_id}'> ${moreFromStore[1].title}
								</p>
							</div>
							<div id= 'moreItemTwo'>\
							<img src = '${moreFromStore[2].Images[0].url_170x135}' data-id='${moreFromStore[2].listing_id}'>
							</div>\
							<div  data-id='${moreFromStore[2].listing_id}'>\
								<p id= 'moreItemTwoName' data-id='${moreFromStore[2].listing_id}'> ${moreFromStore[2].title}
								</p>
							</div>
						</div>\
						
						`)
		
						// <button type="button" id="navLeft" data-id=${singleViewId}>\
						// 	<\
						// </button>\
						// <button type="button" id="navRight" data-id=${singleViewId}>\
						// 	>\
						// </button>\
						
				
	},

	goDisplayStore: function(event){
		console.log('store clicked')
		console.log(this)
		location.hash = 'shop/' + this.shopId
	},

	render: function(){
		console.log('SV rendering')
		console.log(this)
		// this.storeTest()
		this.displaySingle()
	},

	initialize: function(){
		console.log('SV initialized')
		this.listenTo(this.collection, 'sync', this.render)
	}

})


var FavView = React.createClass({

	_clickHandler: function(event){
		itemClicked = event.target
		var itemClickedId = itemClicked.dataset.id
		location.hash = 'listingDetail/' + itemClickedId
	},

	_formatFavs: function(favThing){
		console.log('ok, here is format')
		console.log(favThing)
		return(
			<div id='favListItem'>
				<img id='favItemImage' data-id={favThing.attributes.itemId} onClick={this._clickHandler} src={favThing.attributes.itemImage}></img>
				<p id='favItemTitle' data-id={favThing.attributes.itemId} onClick={this._clickHandler}>{favThing.attributes.itemTitle}</p>
				<p id='favItemPrice'>${favThing.attributes.itemPrice}</p>
			</div>
			)
			
	},

	render: function(){

		var favThings = this.props.favThings

		return(
			<div id='favList'>
				<h1>Favorites</h1>
				{favThings.map(this._formatFavs)}
			</div>
			)
		}
	
})

// var FavView = Backbone.View.extend({

// 	el: '#container',

// 	formatFavs: function(result){
// 		console.log('ok, here is format')
// 		console.log(result)
// 		return <p>{result.attributes.itemTitle}</p>
			
// 	},

// 	showFavs: function(){
// 		console.log('Here is showFavs:')
// 		console.log(this)

// 		var self = this

// 		this.$el.html(`\
// 			${self.collection.models.map(self.formatFavs)}\
// 			`)
// 	},

// 	render: function(){
// 		console.log('FavView is rendering')
// 		this.showFavs()
// 	}


// })


// === ROUTING ===


var EtsyRouter = Backbone.Router.extend({

	routes: {
			'listingDetail/:listingHashId': 'goSingleView',
			'search/:keyword': 'goKeywordSearch',
			'home':'goBackHome',
			'shop/:shopId': 'goFullShop',
			'favorites':'goFavorites'
	},

	goSingleView: function(listingHashId){

		this.sv.singleViewId = listingHashId
		console.log(this)
		
		var self = this
		this.em.fetch({
			url: 'https://openapi.etsy.com/v2/listings/' + listingHashId +'.js?api_key=aavnvygu0h5r52qes74x9zvo',
			processData: true,
			dataType: 'jsonp',
			data:{
				includes: 'Images,Shop'
			}
		}).done(function(){
			var shopId = self.sv.model.attributes.results[0].Shop.shop_id
			console.log('shop id:')
			self.sv.shopId = shopId
			console.log(shopId)

			self.storeCollection.fetch({
				url: 'https://openapi.etsy.com/v2/shops/' + shopId +'.js?api_key=aavnvygu0h5r52qes74x9zvo',
				processData: true,
				dataType: 'jsonp',
				data:{
					includes: 'Listings/Images,Shop'
				}
		})}).done(function(){
				self.sv.render()
			})
	},

	goFullShop: function(shopId){
		console.log('starting gofullshop')
		var self = this
		this.storeCollection.fetch({
				url: 'https://openapi.etsy.com/v2/shops/' + shopId +'.js?api_key=aavnvygu0h5r52qes74x9zvo',
				processData: true,
				dataType: 'jsonp',
				data:{
					includes: 'Listings/Images'
				}
		}).done(function(){
			self.storeView.render()
		})
	},

	goBackHome: function(){
		var self = this

		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				includes: 'Images,Shop'
			}
		}).done(function(){
			console.log('Fetch is done')
			})
	},

	goKeywordSearch: function(keyword){

		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				keywords: keyword,
				includes: 'Images,Shop'
			}
		})

	},


	// The below worked:
	// goFavorites: function(){
	// 	var query = new Parse.Query('FavItem')
	// 	query.find().then(function(results){
	// 		results.forEach(function(result){
	// 			console.log(result.get('itemTitle'))
	// 		})}
	// 		)

	// },
	// 
	// 
	goFavorites: function(){
		var self = this
		this.fc.fetch({
			headers: this.fc.parseHeaders
		}).done(function(){
			React.render(<FavView favThings = {self.fc} />, document.querySelector('#container')) 
		})

	},

	initialize: function() {
		var self = this
		this.ec = new EtsyCollection();
		this.em = new EtsyModel();
		this.fc = new FavCollection();
		this.fm = new FavModel();
		this.storeCollection = new StoreCollection();
		this.gv = new GroupView({collection:this.ec});
		this.sv = new SingleView({model:this.em, collection:this.storeCollection});
		this.storeView = new StoreView({collection:this.storeCollection})
		this.favView = new FavView({model: this.fv, collection:this.fc})
		this.ec.fetch({
			processData: true,
			dataType: 'jsonp',
			data:{
				includes: 'Images,Shop'
			}
		}).done(function(){
			console.log('Fetch is done')
			})
		Backbone.history.start()
	}

})


var er = new EtsyRouter();

















