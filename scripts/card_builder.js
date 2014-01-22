function fillText (ctx, text, left, top, shadow) {
	if (shadow) {
		ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1; ctx.shadowBlur = 2;
	}
	ctx.fillText(text, left, top);
	if (shadow) {
		ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowBlur = 0;
	}
}

function get_large_card(card, callback) {
	var canvas = document.createElement("canvas")
	elements = $.getElements(card)
	canvas.width = 160;
	canvas.height = 220;

	var interval = setInterval(function() {
		if(elements.elements_loaded < elements.num_elements)
			return;
		else
			window.clearInterval(interval);
		canvas.width = 160;
		canvas.height = 220;
		var ctx = canvas.getContext('2d');

		name_size = 121;
		ctx.drawImage(elements.background, 0, 0, 160, 220);
		if(elements.card.image != null) {
				ctx.drawImage(elements.image, 0, 12, elements.image.width*148/150, elements.image.height*120/150, 6, 24, 148, 120);
		}
		ctx.drawImage(elements.icon, 5, 2, 24, 24);
		ctx.font = '14pt Optimus';
		ctx.fillStyle = 'white';
		ctx.shadowColor = 'black';
		if(elements.card.wait != null) {
			ctx.font = 'bold 16pt Optimus';
			ctx.drawImage(elements.wait, 122, 6, 32, 32);
			name_size = 94;
			fillText(ctx, elements.card.wait, 138-ctx.measureText(elements.card.wait).width/2, 29, true)
			ctx.font = '14pt Optimus';
		}
		if(elements.card.attack != null) {
			ctx.drawImage(elements.attack, 2, 200);
			fillText(ctx,elements.card.attack, 24, 215, true);
		}
		if(elements.card.health != null) {
			ctx.drawImage(elements.health, 138, 200);
			fillText(ctx, elements.card.health, 136-ctx.measureText(elements.card.health).width, 215, true);
		}
		if(elements.card.setIcon != null) {
			ctx.drawImage(elements.setIcon, 134, 146, 24, 24)
		}	
		if(elements.card.upgrade > 0) {
			ctx.drawImage(elements.upgrade1, 66, 204)
			ctx.drawImage(elements.upgrade2, 82, 204)
		}
		ctx.fillStyle = 'white';
		if(elements.card.description != null) {
			size = 9;
			ctx.font = size + 'pt EnigmaU';
			ctx.drawImage(elements.description, 6, 127, 148, 20);
			while(ctx.measureText(elements.card.description).width > 140) {
				size--;
				ctx.font = size + 'pt EnigmaU';
			}
			fillText(ctx, elements.card.description, 12, 144, true);
		}
		if(elements.card.name != null) {
			size = 10;
			ctx.font = size + 'pt EnigmaU';
			while(ctx.measureText(elements.card.name).width > name_size) {
				size--;
				ctx.font = size + 'pt EnigmaU';
			}
			fillText(ctx, elements.card.name, 30, 18, true);
		}
		for(var i in elements.card.skills) {
			if(elements.card.skills[i].icon != null) {
				var smax = 9;
				size = smax;
				ctx.font = size + 'pt EnigmaU';
				ctx.drawImage(elements.skills[i], 8, 150 + 16.5*i, 16, 16);
				var max_slen = 127;
				if (elements.card.setIcon != null && i == 0)
					max_slen = 106;
				while(ctx.measureText(elements.card.skills[i].str).width > max_slen){
					size--;
					ctx.font = size + 'pt EnigmaU';
				}
				fillText(ctx,elements.card.skills[i].str, 28, 163+(size-smax)/2+16.5*i, true);
			}
		}
		callback();
	}, 50);
	return canvas;
}

function get_small_card(card,callback) {
	var canvas = document.createElement("canvas")
	elements = $.getElements(card)
	canvas.width = 80;
	canvas.height = 110;

	var interval = setInterval(function() {
		if(elements.elements_loaded < elements.num_elements)
			return;
		else   
			window.clearInterval(interval);

		var ctx = canvas.getContext('2d');
		ctx.drawImage(elements.background, 0, 0, 80, 110);
		if(elements.card.image != null) {
			ctx.drawImage(elements.image, 0, 10, elements.image.width*148/150, elements.image.height*120/150, 3, 12, 74, 60);
		}
		ctx.drawImage(elements.icon, 2, 2, 12, 12);
		ctx.font = '10pt Optimus';
		ctx.fillStyle = 'white';
		if(elements.card.wait != null) {
			ctx.drawImage(elements.wait, 61, 3, 16, 16);
			fillText(ctx, elements.card.wait, 69-ctx.measureText(elements.card.wait).width/2, 15, true);
		}
		if(elements.card.attack != null) {
			ctx.drawImage(elements.attack, 1, 97, 12, 12);
			fillText(ctx, elements.card.attack, 14, 107, true);
		}
		if(elements.card.health != null) {
			ctx.drawImage(elements.health, 67, 97, 12, 12);
			fillText(ctx, elements.card.health, 66-ctx.measureText(elements.card.health).width, 107, true);
		}
		if(elements.card.setIcon != null) {
			ctx.drawImage(elements.setIcon, 65, 73, 13, 13)
		}	
	
		for(var i in elements.card.skills) {
			if(elements.card.skills[i].icon != null) {
				ctx.drawImage(elements.skills[i], 6+18*i, 75, 16, 16);
			}
		}
		if(elements.card.upgrade > 0) {
			ctx.drawImage(elements.upgrade1, 32, 99, 9, 9)
			ctx.drawImage(elements.upgrade2, 42, 99, 9, 9)
		}
		callback();
	},50);
	return canvas;
}

$.getElements = function(card) {
	var cardElements = { 
		card:card, 
		background : new Image,
		image : new Image,
		icon : new Image,
		wait : new Image,
		attack : new Image,
		health : new Image,
		setIcon : new Image,
		skills : [new Image, new Image, new Image],
		description : new Image,
		upgrade1 : new Image,
		upgrade2 : new Image,
		num_elements : 0,
		elements_loaded : 0
	}

	cardElements.num_elements++;
	cardElements.background.src = card.background
	cardElements.background.onload = function() {
		cardElements.elements_loaded++;
	}
	if(card.icon == null || card.icon == "")
		cardElements.icon.src = "images/AssaultRegIcon.png"
	else
		cardElements.icon.src = card.icon;
	cardElements.num_elements++;
	cardElements.icon.onload = function() {
		cardElements.elements_loaded++;
	}
	if(card.image != null) {
		cardElements.num_elements++;
		cardElements.image.src = card.image;
		cardElements.image.onload = function() {
			cardElements.elements_loaded++;
		}
	}

	if(card.wait != null) {
		cardElements.num_elements++;
		cardElements.wait.src = "images/ClockIcon.png"
		cardElements.wait.onload = function() {
			cardElements.elements_loaded++;
		}
	}

	if(card.attack != null) {
		cardElements.num_elements++;
		cardElements.attack.src = "images/AttackIcon.png"
		cardElements.attack.onload = function() {
			cardElements.elements_loaded++;
		}
	}
	
	if(card.health != null) {
		cardElements.num_elements++;
		cardElements.health.src = "images/HealthIcon.png"
		cardElements.health.onload = function() {
			cardElements.elements_loaded++;
		}
	}

	if(card.setIcon != null) {
		cardElements.setIcon.src = card.setIcon;
		cardElements.num_elements++;
		cardElements.setIcon.onload = function() {
			cardElements.elements_loaded++;
		}
	}
	if(card.description != null) {
		cardElements.description.src = "images/card_description.png"
		cardElements.num_elements++;
		cardElements.description.onload = function() {
			cardElements.elements_loaded++;
		}
	}

	for(var i in card.skills) {
		if(card.skills[i].icon != null) {
			cardElements.num_elements++;
			cardElements.skills[i].src = card.skills[i].icon;
			cardElements.skills[i].onload = function() {
				cardElements.elements_loaded++;
			}
		}
	}
	if(card.upgrade == 1) {
		cardElements.num_elements+=2;
		cardElements.upgrade1.src = "images/upgrade_icon.png"
		cardElements.upgrade1.onload = function() {
			cardElements.elements_loaded++;
		}
		cardElements.upgrade2.src = "images/unupgrade_icon.png"
		cardElements.upgrade2.onload = function() {
			cardElements.elements_loaded++;
		}
	}
	else if(card.upgrade == 2) {
		cardElements.num_elements+=2;
		cardElements.upgrade1.src = "images/upgrade_icon.png"
		cardElements.upgrade1.onload = function() {
			cardElements.elements_loaded++;
		}
		cardElements.upgrade2.src = "images/upgrade_icon.png"
		cardElements.upgrade2.onload = function() {
			cardElements.elements_loaded++;
		}	
	}
	return cardElements;
}