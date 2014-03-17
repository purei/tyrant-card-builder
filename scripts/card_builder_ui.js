cards = {}
names = []
down = null

$.getScript("scripts/canvastool.pngencoder.min.js")

$.getMatch = function(name) {
	reg = new RegExp('^'+name+'$', 'i')
	for(var i in names)
		if(names[i].match(reg))
			return names[i]
	return false
}

custom_card = { id: 0, name : "", wait : null, description : null, skills : [ {str:"", icon:null}, {str:"", icon:null}, {str:"",icon:null}], attack : null, health : null, background:"images/CardBlankStyle.png", upgrade:0, rarity:1, image:null, icon:null, setIcon:null }

function share() {
	try {
		//var fullimg = canvas_large.toDataURL()
		var pe = new CanvasTool.PngEncoder(canvas_large)
		pe.Y = {O:'json', text:JSON.stringify(custom_card), g:0}
		var img = btoa(pe.convert())
		//var img = fullimg.split(',')[1]
		var fullimg = "data:image/png;base64," + img
	} catch(e) {
		console.log(e)
		$.facebox("Error preparing image.")
		return;
	}
	
	$.facebox(function() {
		$.ajax({
			url: 'https://api.imgur.com/3/upload.json',
			beforeSend: function(request) {
				// get your key here, quick and fast http://imgur.com/register/api_anon
				request.setRequestHeader("Authorization", 'Client-ID b3d2c555d37943a')
			},
			type: 'POST',
			data: {
				type: 'base64',
				name: (($(".name.text")[0].value === "") ? "no_name" : $(".name.text")[0].value.replace(" ","_")) + ".png",
				title: $(".name.text")[0].value,
				description: navigator.userAgent || "",
				image: img,
				album_id: 'WVjs32zXH6diLko'
			},
			dataType: 'json'
		}).success(function(data) {
		$.facebox('<div style="display:inline-block;width:170px;margin-left:auto;margin-right:auto;float:left"><img src="' + data.data.link + '"/></div><div style="float:right;overflow:none; width:200px;">Direct Link <input onclick="this.select();" style="width:150px;" type="text" value="' + data.data.link + '"></input><hr />Copy to Kong Forums <input onclick="this.select();" style="width:150px;" type="text" value="<img src=\'' + data.data.link + '\' title=\'Created with Tyrant Card Creator by catepillar\'></img>"</input></div>');
		}).error(function(jqXHR, textStatus, errorThrown) {
		$.facebox('<div style="display:inline-block;width:170px;margin-left:auto;margin-right:auto;float:left"><img src="' + fullimg + '"/></div><div style="float:right;overflow:none; width:200px;">Upload Failed!<br><span style="font-style:italic">Imgur is either temporarily down or unavailable to you.</span><br><span style="font-weight:normal">Right-click the image and save it to your computer, then upload it manually to another free image host:<ul><li><a href="http://tinypic.com">TinyPic</a></li><li><a href="http://postimage.org">postimage.org</a></li><li><a href="http://www.freeimagehosting.net">Free Image Hosting</a></li></ul></span></div>');
		})
	})
}

function refresh_card() {
	canvas_large = get_large_card(custom_card,function() { $('#large_img').attr("src", canvas_large.toDataURL()) } )
	canvas_small = get_small_card(custom_card,function() { $('#small_img').attr("src", canvas_small.toDataURL()) } )
}

function load() {
	$('.button.upload').click(function() {
		share()
	})

	// Populate Card Background section
	var background = $('.background.body')
	background.append(($('<div></div>').addClass("background option").css("background-image","url('images/CardBlankStyle.png')")).append($("<span></span>").text("Blank")))
	for(var i in cards.unitType)
		if(cards.unitType[i].image)
			background.append(($('<div></div>').addClass("background option").css("background-image","url('images/" + cards.unitType[i].image + ".png')")).append($("<span></span>").text(cards.unitType[i].name)))
	background.append(($('<div></div>').addClass("background custom")).append($("<span></span>").text("Custom")))

	var types = ["Assault","Commander","Structure","Action"]
	var rarities = ["Reg","Silver","Gold","Legendary"]
	var print = ["Common", "Uncommon", "Rare", "Legendary"]
	for(var i in types)
		for(var j in rarities)
			if(types[i] != "Commander" || rarities[j] != "Legendary")
				$('.icon.body').append($("<div>").addClass("icon option").css("background-image","url('images/" + types[i] + rarities[j] + "Icon.png')").append($("<span>").text(print[j] + " " + types[i])))
	$('.icon.body').append($("<div>").addClass("icon custom").append($("<span>").text("Custom")))

	var seticon = $('.setIcon.body')
	seticon.append($('<div></div>').addClass("setIcon none selected").append($("<span></span>").text("None")))
	for(var i in cards.cardSet)
		seticon.append(($('<div></div>').addClass("setIcon option").css("background-image","url('images/" + cards.cardSet[i].icon + ".png')")).append($("<span></span>").text(cards.cardSet[i].name)))
	seticon.append(($('<div></div>').addClass("setIcon custom")).append($("<span></span>").text("Custom")))

	var skills = []
	var skillIcons = []
	for(var i in cards.skillType) {
		if(cards.skillType[i].icon && cards.skillType[i].desc && -1 === $.inArray(cards.skillType[i].icon, skillIcons)) {
			skills.push(cards.skillType[i])
			skillIcons.push(cards.skillType[i].icon)
		}
	}
	skills.sort(function(a, b) {
		if(a.name > b.name) return 1
		if(a.name < b.name) return -1
		return 0
	})
	// Populate skills section
	var skbody = $(".skills1.body, .skills2.body, .skills3.body")
	skbody.append($("<span>").addClass("skillIcon none selected").text("None"))
	for(var i in skills)
		skbody.append($("<span>").addClass("skillIcon option").css('background-image',"url('images/" + skills[i].icon + ".png')").attr('title',skills[i].name).text("\u00A0"))
	skbody.append($("<span>").addClass("skillIcon custom").text("Custom")).append($("<input>").attr("type","text").addClass("text skillIcon"))

	skopts = $(".skills1 > .skillIcon.option, .skills1 > .skillIcon.custom, .skills1 > .skillIcon.none, .skills1 > text")
	skopts.addClass("skills1")
	skopts = $(".skills2 > .skillIcon.option, .skills2 > .skillIcon.custom, .skills2 > .skillIcon.none, .skills2 > text")
	skopts.addClass("skills2")
	skopts = $(".skills3 > .skillIcon.option, .skills3 > .skillIcon.custom, .skills3 > .skillIcon.none, .skills3 > text")
	skopts.addClass("skills3")
	$('.header').click(function() {
		$('.body').slideUp()
		$('.header').removeClass("hsel")
		if($(this).attr("class").match(/\b(background|icon|name|image|attack|health|wait|setIcon|description|upgrade|skills1|skills2|skills3)\b/)[0] != down) {
			$(this).next().slideToggle(function() {
				if($(this).attr("class").match(/\b(name|image|attack|health|wait|description)\b/) !== null)
					$("." + $(this).attr("class").match(/\b(name|image|attack|health|wait|description)\b/)[0] + ".text").focus()
			})
			down = $(this).attr("class").match(/\b(background|icon|name|image|attack|health|wait|setIcon|description|upgrade|skills1|skills2|skills3)\b/)[0]
			$(this).addClass("hsel")
		}
		else
			down = null
	})
	$("#right").width('400px').height("100%").removeClass("hidden").css('position','relative')
	$('.option').click(function() {
		var class_name = $(this).attr("class").match(/\b(background|icon|image|setIcon|upgrade)\b/)[0]
		$("." + class_name + ".selected").removeClass("selected")
		if(class_name == "upgrade")
			custom_card[class_name] = $(this).index()
		else
			custom_card[class_name] = this.style.backgroundImage.replace(/(^url\(["']?)|['"]?\)$/g,"")
		$(this).addClass("selected")
		refresh_card()
	})

	$('.custom').click(function() {
		var class_name = $(this).attr("class").match(/\b(background|icon|image|setIcon)\b/)[0]
		if(class_name == "image")
				$(".image.container").removeClass("hidden")
		$("." + class_name + ".file").click()
	})
	$('.none').click(function() {
		var class_name = $(this).attr("class").match(/\bsetIcon\b/)[0]
		custom_card[class_name] = null
		$("." + class_name + ".selected").removeClass("selected")
		$(this).addClass("selected")
		refresh_card()
	})
	$('.skillIcon').unbind('click')
	$('.skillIcon.option').click(function() {
		var skill_num = $(this).attr("class").match(/\bskills(\d)\b/)[1]
		reg = new RegExp('^'+$(".skills" + skill_num + ".selected").attr("title"))
		$(".skills" + skill_num + ".selected").removeClass("selected")
		custom_card.skills[skill_num-1].icon = this.style.backgroundImage.replace(/(^url\(["']?)|['"]?\)$/g,"")
		$(this).addClass("selected")

		var askill = $(".skills" + skill_num + " > input.skillIcon")
		if(askill.val() === "")
			askill.val(this.title)
		else if(askill.val().match(reg) !== null)
			askill.val($(".skills" + skill_num + " > input.skillIcon").val().replace(reg,this.title))
		custom_card.skills[skill_num-1].str = askill.val()
		refresh_card()
	})
	$('.skillIcon.none').click(function() {
		var skill_num = $(this).attr("class").match(/\bskills(\d)\b/)[1]
		$(".skills" + skill_num + ".selected").removeClass("selected")
		custom_card.skills[skill_num-1].icon = null
		$(this).addClass("selected")
		refresh_card()
	})

	$('.skillIcon.custom').click(function() {
		var skill_num = $(this).attr("class").match(/\bskills(\d)\b/)[1]
		$(".skills" + skill_num + ".selected").removeClass("selected")
		num = skill_num
		$(".skills" + skill_num + ".file").click()
	})

	$('.file').change(function(e) {
		var class_name = $(this).attr("class").match(/\b(background|icon|image|setIcon|skills1|skills2|skills3)\b/)[0]
		var reader = new FileReader()
		reader.onload = function(event) {
			var img = new Image()
			img.onload = function() {
				if(class_name == "image") {
					$('.imagesSuggestion').remove()
					$(".image.container").removeClass("hidden").append($('<div>').addClass("image option selected").css('background-image','url("' + img.src + '")' ).click(function() {
						$(".image.selected").removeClass("selected")
						custom_card.image = this.style.backgroundImage.replace(/(^url\(["']?)|['"]?\)$/g,"")
						$(this).addClass("selected")
						refresh_card()
					}))
				}
				else
					$("." + class_name + ".custom").css('background-image','url("' + img.src + '")' )
				custom_card[class_name] = img.src
				refresh_card()
			}
			img.src = event.target.result
			image_file = event.target.result
		}
		reader.readAsDataURL(e.target.files[0])
		$("." + class_name).removeClass("selected")
		if(class_name != "image")
			$("." + class_name + ".custom").addClass("selected")
	})
	$('.skills1 > .file, .skills2 > .file, .skills3 > .file').unbind("change").change(function(e) {
		var skill_num = $(this).attr("class").match(/\bskills(\d)\b/)[1]
		var reader = new FileReader()
		reader.onload = function(event) {
			var img = new Image()
			img.onload = function() {
				custom_card.skills[skill_num-1].icon = img.src
				$(".skills" + skill_num + ".custom").after($("<span>").addClass("skillIcon option selected skills" + skill_num).css('background-image',"url('" + img.src + "')").text("\u00A0"))
				refresh_card()
			}
			img.src = event.target.result
		}
		reader.readAsDataURL(e.target.files[0])
		$(".skills" + skill_num + ".selected").removeClass("selected")
	})
	$('.text').bind('textchange',function(e) {
		var class_name = $(this).attr("class").match(/\b(name|image|attack|health|wait|description|skills1|skills2|skills3)\b/)[0]
		if(class_name =="image") {
			$(".image.selected").removeClass("selected")
			$('.suggestions').remove()
			match = $.getMatch(this.value)
			if(match !== false) {
				if(cards.unit[match].length === 1) {
					custom_card.image = "images/"+cards.unit[match][0]
					refresh_card()
				}
				else {
					images_sug = $('<div>').addClass("imagesSuggestion").appendTo($(".image.body"))
					for(var i in cards.unit[match]) {
						images_sug.append($("<img>").attr("src","images/"+cards.unit[match][i]))
					}
					$(".imagesSuggestion > img").removeClass("selected").click(function() {
						$(".imagesSuggestion > img").removeClass("selected")
						$(this).addClass("selected")
						custom_card.image = this.src
						refresh_card()
					})
				}
				$('.suggestions').remove()
			}
			else
				$(".imagesSuggestion").remove()
			matches = []
			reg = new RegExp('^'+this.value, 'i')
			var container = $('<div>').addClass("suggestions").appendTo($('body'))
			var imgtxt = $('.image.text')
			container.css('top',(imgtxt.offset().top+imgtxt.height()+14) + "px").css('left',imgtxt.offset().left).css('width',imgtxt.width()+"px")
			for(var i in names) {
				if(names[i].match(reg) !== null) {
					container.append($('<div>').text(names[i]))
				}
			}
			$('.suggestions > *').mousedown(function() {
				$('.image.text').val($(this).text())
				$('.image.text').trigger('textchange')
				$('.suggestions').remove()
			})
			imgtxt.blur(function() {
				$('.suggestions').remove()
			})
		}
		if(class_name == "attack" || class_name == "health" || class_name == "wait") {
			this.value = this.value.replace(/\D/g,'')
			custom_card[class_name] = this.value
			if(this.value === "")
				custom_card[class_name] = null
			refresh_card()
		}
		if(class_name == "name" || class_name == "description") {
			custom_card[class_name] = this.value
			if(this.value === "")
				custom_card[class_name] = null
			refresh_card()
		}
	})
	$('.skills1 > .text, .skills2 > .text, .skills3 > .text').unbind("textchange").bind("textchange", function() {
		var skill_num = $(this).parent().attr("class").match(/\bskills(\d)\b/)[1]
		custom_card.skills[skill_num-1].str = this.value
		refresh_card()
	})
}

var bit = 0

$(document).ready(function() {
	load_font = $('<canvas>')[0].getContext('2d')
	load_font.font = '14pt Optimus'
	load_font.fillText("asdf",0,0)

	$.getJSON('cards.json', function(data) {
		cards = data
		names = Object.keys(cards.unit)
		load()
		$(".background.option")[0].click()
		$(".icon.option")[0].click()
	})

	$(document).keydown(function(e) {
		if(e.which == 9) {
			var bodies = $('.body')
			for(var i = 0; i < bodies.length; i++) {
				if($(bodies[i]).css("display") != "none") {
					class_name = bodies[0].className.replace(/\s*body\s*/,"")
					if(i < bodies.length-1)
						class_name = bodies[i+1].className.replace(/\s*body\s*/,"")
					$(".header." + class_name).click()
					return false
				}
			}
			$(".background.header").click()
			return false
		}
		

		if($('.text').is(":focus"))
			return
		switch(e.which) {
			case 66: $('.background.header').click()
				break
			case 73: $('.icon.header').click()
				break
			case 78: $('.name.header').click()
				break
			case 77: $('.image.header').click()
				break
			case 65: $('.attack.header').click()
				break
			case 72: $('.health.header').click()
				break
			case 87: $('.wait.header').click()
				break
			case 83: $('.setIcon.header').click()
				break
			case 68: $('.description.header').click()
				break
			case 49: $('.skills1.header').click()
				break
			case 50: $('.skills2.header').click()
				break
			case 51: $('.skills3.header').click()
				break
			case 85: $('.upgrade.header').click()
				break
			default: return // exit this handler for other keys
			}
			e.preventDefault()
	})
})
