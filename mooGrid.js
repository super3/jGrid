/* By XoDG */
(function()
{
	// Our "virtual" private datastore
	var heap = {};
	
	// We use 'this' to expose the MooGrid class to the Global namespace
	this.MooGrid = new Class({
		
		Implements: [Options],
		
		options:
		{
			container: 'mooGrid',
			
			cols: 5,
			rows: 6,
			
			clickOnce: true,
			
			onCellClick: Function.from(),
			onCellMouseover: Function.from(),
			onCellMouseout: Function.from()
		},
		
		// Constructor
		initialize: function(options)
		{
			this.setOptions(options);
			this.options.uniqid = String.uniqueID();
			
			heap[this.options.uniqid] = { lastCell: null, grid: [] }
		},
		
		/**
		 * public draw()
		 *
		 * Draws the grid within the container specified in this.options above
		 *
		 * TODO: Make each cell itself an objet instantiated from a class, and
		   abstract away some functionality.
		 *
		 * Returns a reference to this object on success, otherwise returns NULL.
		**/
		draw: function()
		{
			var container = $(this.options.container);
			if(!container) return null;
			
			// Empty the container and grid heap storage
			container.empty();
			heap[this.options.uniqid].grid.empty();
			
			// Used for width/heigth calculations later on
			var containerSize 	= container.getSize(),
				cellHeight 		= containerSize.y / this.options.rows,
				cellWidth  		= containerSize.x / this.options.cols,
				that = this;
			
			// O(n^2) complexity lolol
			for(var i=0; i<this.options.rows; ++i)
			{
				var h = heap[this.options.uniqid];
				h.grid[i] = [];
				
				for(j=0; j<this.options.cols; ++j)
				{
					var cell = new Element('div.mooGrid-cell',
					{
						styles:
						{
							width: 0,
							height: 0
						},
						
						events:
						{
							click: function(e)
							{
								if(!that.options.clickOnce || h.lastCell != this)
								{
									that.options.onCellClick(e, this);
									h.lastCell = this;
								}
							},
							
							mouseover: function(e){ that.options.onCellMouseover(e, this); },
							mouseout:  function(e){ that.options.onCellMouseout(e, this); }
						}
					});
					
					h.grid[i][j] = cell;
					container.grab(cell);
					
					// For reverse lookups in other class methods
					cell.store('x', j);
					cell.store('y', i);
					
					/* We do this down here so that the browser has a chance to
					   apply any CSS styles to the element container just grabbed
					 */
					var cellSize = cell.getSize();
					
					cell.setStyles({
						
						// Accounts for borders and padding and what not
						width: cellWidth-cellSize.x,
						height: cellHeight-cellSize.y,
						
						top: cellHeight*i,
						left: cellWidth*j
					});
				}
			}
			
			return this;
		},
		
		/**
		 * public changeCellColor(int row, int column, string color)
		 * public changeCellColor(element cell, string color)
		 *
		 * Changes a cell to a specific string or hex (prefaced with #) color.
		 * Accepts either row, column, and a color string OR an element reference and a color string
		 *
		 * Returns true on success, otherwise returns false.
		**/
		changeCellColor: function()
		{
			// TODO: Coming soon!
			return true;
		},
		
		/**
		 * public swapCells(int row, int column, int row, int column)
		 * public swapCells(element cell1, element cell2)
		 *
		 * Swaps one whole cell with another.
		 * Accepts either row or column coordinates (zero indexed) or two element references to swap.
		 *
		 * Returns true on success, otherwise returns false.
		**/
		swapCells: function()
		{
			// TODO: Coming soon!
			return true;
		},
		
		/**
		 * public getCell(int row, int column)
		 *
		 * Returns a reference to a cell when passed the row and column (zero indexed).
		 *
		 * Returns an element on success, otherwise returns NULL.
		**/
		getCell: function(row, column)
		{
			var h = heap[this.options.uniqid].grid;
			
			if(h[row] && h[row][column])
				return h[row][column];
			else return null;
		},
		
		/**
		 * public getCellPos(element cell)
		 *
		 * Returns the row and column (zero indexed) of the cell element passed.
		 *
		 * Returns an array of two numbers in the form of [row, column] on success, otherwise returns NULL.
		**/
		getCellPos: function(cell)
		{
			if(cell.getParent() == $(this.options.container))
				return [cell.retrieve('y'), cell.retrieve('x')];
			return null;
		}
	});
}());