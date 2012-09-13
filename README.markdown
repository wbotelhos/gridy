# jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy

jQuery Gridy is a plugin that generates a highly customizable grid using templates.

## Version

	@version        1.0.0
	@since          2011.06.03
	@author         Washington Botelho
	@documentation  wbotelhos.com/gridy
	@twitter        twitter.com/wbotelhos

## Required Files

+ jquery.gridy.js
+ jquery.gridy.css
+ icons.png
+ loading.png
+ refresh.png

## Default values

	Ajax Options:

	always            : undefined                               // Function executed when the grid finish the request.
	cache             : undefined                               // Enables the ajax cache.
	contentType       : undefined                               // The content type of the ajax request.
	dataType          : 'json'                                  // The data type of the ajax request.
	done              : undefined                               // Function executed when the grid loads successfully.
	fail              : undefined                               // Function executed when occurs an error.
	jsonp             : undefined                               // Override the callback function name in a jsonp request.
	jsonpCallback     : undefined                               // Specify the callback function name for a JSONP request.
	page              : 1                                       // The number of the page to be displayed.
	params            : {}                                      // A hash of parameters to be added to the query string.
	paramsElements    : []                                      // Array of selectors of field to use the name and value as parameter.
	sortName          : ''                                      // Name of the default column sorted.
	sortOrder         : 'asc'                                   // Order of classification.
	type              : 'get'                                   // Type of the HTTP request.
	url               : '/gridy'                                // URL to request the data.

	Callback Options:

	before            : undefined                               // Function executed before the grid call the request.
	filter            : undefined                               // Function executed when the data is returned from request.

	Content Options:

	columns           : []                                      // Array of objects that represents the columns with name, value, width and clazz.
	scroll            : false                                   // Enables the display of the grid with scroll.
	style             : 'table'                                 // Change between table and free style of template.
	width             : undefined                               // Width of the grid.

	Design Options:

	evenOdd           : false                                   // Enables the even odd row style.
	resize            : true                                    // Apply the same width of the content to the other wrappers.
	separate          : true                                    // Change the style of the first line on grid.
	skin              : 'gridy'                                 // Name of the root class name style "CSS prefix".

	Effect Options:

	clickFx           : false                                   // Enables rows selection with different style on click.
	hoverFx           : false                                   // Enables highlight rows on mouseover.

	Find Options:

	find              : ''                                      // Name of the column where research will be done.
	finds             : []                                      // List of objects with the name and value representing the avaliable columns for search.
	findTarget        : undefined                               // Selector of the place where the "find" element will be appended.

	Header Options:

	arrowDown         : 'gridy-arrow-down'                      // Class with background used as icon on the descending sort.
	arrowNone         : 'gridy-arrow-none'                      // Class with background used as icon when there is no sort by especific field.
	arrowUp           : 'gridy-arrow-up'                        // Class with background used as icon on the ascending sort.
	headers           : []                                      // Array of objects that represents each header columns of the grid with name, value, width and clazz.

	Page Options:

	buttonBackTitle   : '&lsaquo; Back'                         // Title of the navigation button back.
	buttonMax         : 10                                      // Number of paging buttons visible.
	buttonNextTitle   : 'Next &rsaquo;'                         // Title of the navigation button next.
	buttonOption      : true                                    // Shows the pagination buttons.
	buttonTitle       : 'Page'                                  // Text prepended in the button title with it number.

	JSON Options:

	listPath          : 'list'                                  // The JSON root name.
	totalPath         : 'total'                                 // Path of the total element.
	template          : 'template'                              // The ID of the script template loaded.
	Loading Options   : 'gridy-loading'                         // Name of the class used as a loading icon.
	loadingOption     : true                                    // Enables the presentation of the loading message.
	loadingText       : 'Loading...'                            // Text that will appear during the loading.

	Message Options:

	messageOption     : false                                   // Enables the display of messages about the grid.
	messageTimer      : 4000                                    // Time in milliseconds in which the messages will remain on the screen.

	Other Options:

	debug             : false                                   // Shows details of the grid request.

	Refresh Options:

	refreshIcon       : 'gridy-button-refresh'                  // Button to refresh the data of the grid.
	refreshOption     : true                                    // Enables the refresh button.
	refreshTarget     : undefined                               // Enables the refresh button.

	Result Options:

	firstQuery        : true                                    // Choose if the grid will do a first query when loaded on page.
	noFirstQueryText  : 'No search was performed yet!'          // Message displayed when the first query is blocked.
	noResultText      : 'No item was found!'                    // Text shown when no result is found for the search.
	resultOption      : true                                    // Enables the presentation of details of the result.

	Row Options:

	rows              : 10                                      // Number of rows displayed on each page.
	rowsNumber        : [5, 10, 25, 50, 100]                    // List with the numbers of lines that should be displayed. 
	rowsTarget        : undefined                               // Selector of the place where the "rows" element will be appended.

	Search Options:

	search            : ''                                      // Default term to be consulted. 
    searchButtonLabel : 'search'                                // Value of the search button.
    searchButtonTitle : 'Start the search'                      // Title of the search button.
	searchFocus       : true                                    // Enables the automatic focus in the search field.
	searchOption      : true                                    // Enables the search field.
	searchTarget      : undefined                               // Selector of the place where the "search" element will be appended.
	searchText        : ''                                      // Text displayed in the search field.

	Status Options:

	statusOption      : true                                    // Enables the status information text.
	statusText        : 'Displaying {from} - {to} of {total} items' // Enables the status information text.

## Usage with default values

	$('#grid').gridy({ url: '/gridy' });
	
	<table id="grid"></table>
	
	<script id="template" type="text/x-jquery-tmpl">
	   <tr>
	      <td>${name}</td>
	      <td>${email}</td>
	   </tr>
	</script>

## Public functions
	
	$('#grid').gridy('reload');                // Reload the grid with the current filter configuration.

	$('#grid').gridy('set', { scroll: true }); // Reload the grid setting new configurations.

## Contributors

+ Gabriel Benz
+ Makoto Hashimoto

## Licence

The MIT License

Copyright (c) 2011 Washington Botelho

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Buy me a coffee

You can do it by [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=X8HEP2878NDEG&item_name=jQuery%20Gridy). Thanks! (:
