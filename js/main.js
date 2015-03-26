(function movingTiles (){
	
	var $tiles = $('.tiles'),
	$allitems = $tiles.find('.item-content'),
	itemWidth,
	itemHeight;

function calcWidthHeight () {
	for(var i=0,j=$allitems.length; i<j; i++){
		if (!$($allitems[i]).hasClass("large")) {
			itemWidth = $($allitems[i]).outerWidth();
			itemHeight = $($allitems[i]).outerHeight();			
			break;
		};
	};
};	

function tilePosInit () {
	$tiles.each(function(){
		var noLargeYet = true,
			$items = $(this).find('.item-content');
		
		for(var i=0,j=$items.length; i<j; i++){
			var tileData = $($items[i]).data(),
				odd = ( i & 1 ),
				largeIndex;
			
			if (noLargeYet){
				tileData.x = Math.floor(i/2);
			
				if ($($items[i]).hasClass("large")) {
					tileData.y = 0;
					noLargeYet = false;
					largeIndex = i;
					
					if (odd){
						$($items[i-1]).data("x", Math.round(i/2) + 1);	
					};			
				} 
				else{
			  		tileData.y = (odd) ? 1 : 0;
				};
			}
			else {
				if (largeIndex & 1) {
					tileData.x = Math.round(i/2) + 1;
				} 
				else{
					tileData.x = Math.ceil(i/2) + 1;
				};
				
				tileData.y = (odd) ? 0 : 1;
			};	  	
		};
		
		setTilePos($items);
	});
};


function setTilePos (items) {
  items.each(function(i) {
  	$(this).css({"left" : $(this).data("x") * itemWidth, "top" : $(this).data("y") * itemHeight});
  });
		
};

function resetTileData () {
	// add class transitions to tile if doesn't already exist
	if (!$allitems.hasClass('transitions')) {
		$allitems.addClass('transitions');
	};
	
  	var $items = $(this).parent().children('.item-content'),
  		prevLargeX = $items.filter('.large').data('x'),
  		targetPosX = $(this).data('x'),
  		relativeXPos = (prevLargeX > targetPosX) ? 'left': 'right',
  		targetPosY = $(this).data('y'),
  		$otherTiles = $(this).siblings(); 	
	
	//if it is not already the large tile
	if (!$(this).hasClass('large')){
		
		// set the new x and y positions
		if (relativeXPos == 'right') {
			//if trigger object to the right of the previous large tile, move 1 space to left 
			$(this).data('x', targetPosX - 1);
			//move previous large tile down one space if the target is on the bottom row
			if(targetPosY == 1){
				$items.filter('.large').data('y', 1);
			};
			
			//loop through the other tiles
			$otherTiles.each(function () {
				
				//if the x pos is between the previous large tile's x pos and the target's new x pos, move left 
				if ($(this).data('x') <= targetPosX && $(this).data('x') > prevLargeX){
					//if the target is on the top row
					if(targetPosY == 0){	
						//and this tile is on the top row 
						if ($(this).data('y') == 0) {
							//move left by 1 space
							$(this).data('x', $(this).data('x') - 1);
						} 
						else{
							//move left by 2 spaces in on bottom row
							$(this).data('x', $(this).data('x') - 2);							
						};
					}
					//if target is on the bottom row
					else {
						//and this tile is on the top row 
						if ($(this).data('y') == 0) {
							//move left by 1 space
							$(this).data('x', $(this).data('x') - 2);
						} 
						else{
							//move left by 2 spaces in on bottom row
							$(this).data('x', $(this).data('x') - 1);							
						};
					};
				};
			});
		} 
		else{
			//move previous large tile right one space
			$items.filter('.large').data('x', $items.filter('.large').data('x') + 1);
			//and down one space if the target is on the bottom row
			if(targetPosY == 1){
				$items.filter('.large').data('y', 1);
			};
			
			//loop through the other tiles and if they have the same x position as the trigger tile, move right
			$otherTiles.each(function () {
				
				//if the x pos is between the previous large tile's x pos and the target's new x pos, move right 
				if ($(this).data('x') >= targetPosX && $(this).data('x') < prevLargeX){
					
					//if the target is on the top row
					if(targetPosY == 0){	
						//and this tile is on the top row 
						if ($(this).data('y') == 0) {
							//move right by 1 space
							$(this).data('x', $(this).data('x') + 1);
						} 
						else{
							//move right by 2 spaces in on bottom row
							$(this).data('x', $(this).data('x') + 2);							
						};
					}
					//if target is on the bottom row
					else {
						//and this tile is on the top row 
						if ($(this).data('y') == 0) {
							//move left by 2 spaces
							$(this).data('x', $(this).data('x') + 2);
						} 
						else{
							//move left by 1 spaces in on bottom row
							$(this).data('x', $(this).data('x') + 1);							
						};
					};				
				};
			});
		};
		
					
  		//set target to new large tile
		$otherTiles.removeClass('large'); 	
		$(this).addClass('large');
					
		
		//setting the y positions
		//trigger object to top row if currently in bottom row
		if (targetPosY == 1){
			$(this).data('y', 0); 	
		}
		
		
		setTilePos($items);
	}
};

//Initialize functions to be called on page load
calcWidthHeight ();
tilePosInit ();

//bind events
$(".tiles").on('mouseenter', '.item-content', resetTileData);
	
})();