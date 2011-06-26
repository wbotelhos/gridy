/*!
 * jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy
 * ---------------------------------------------------------------------------------
 *
 * jQuery Gridy is a plugin that generates a highly customizable grid automatically.
 *
 * Licensed under The MIT License
 *
 * @version         0.1.0
 * @since           06.03.2011
 * @author          Washington Botelho dos Santos
 * @documentation   wbotelhos.com/gridy
 * @twitter         twitter.com/wbotelhos
 * @license         opensource.org/licenses/mit-license.php MIT
 * @package         jQuery Plugins
 *
 * Default values:
 * --------------------------------------------------------------------------
 * arrowDown:       'arrow-down'                                // Class used as icon on the descending sort.
 * arrowNone:       'arrow-none'                                // Class used as icon when there is no sort.
 * arrowUp:         'arrow-up'                                  // Class used as icon on the ascending sort.
 * before:          null                                        // Function executed before the grid load.
 * buttonOption:    true                                        // Shows the pagination buttons.
 * buttonTitle:     'page'                                      // Alternative text prepended on the page buttons.
 * buttonsWidth:    'auto'                                      // Width of the buttons wrapper.
 * cache:           false                                       // Enables the ajax cache.
 * clickFx:         false                                       // Enables rows selection on click.
 * colsWidth:       []                                          // List with the width of each column of the grid.
 * complete:        nul                                         // Function executed when the grid load.
 * contentType:     'application/x-www-form-urlencoded; charset=utf-8' // The content type of the ajax request.
 * dataType:        'json'                                      // The data type of the ajax request.
 * debug:           false                                       // Shows details of the grid request.
 * error:           null                                        // Function executed when occurs an error.
 * find:            'id'                                        // Name of the column where research will be done.
 * findList:        []                                          // List with the name of the columns for research.
 * findOption:      true                                        // Enables you to choose the column to do the research.
 * height:          'auto'                                      // Height of the grid.
 * hoverFx:         false                                       // Enables highlight rows on mouseover.
 * jsonp:           false                                       // Enables the JSONP content type.
 * jsonpCallback:   'callback'                                  // Name of the callback function for JSONP content type.
 * loadingIcon:     'loading'                                   // Name of the class used as a loading icon.
 * loadingOption:   true                                        // Enables the presentation of the loading message.
 * loadingText:     Loading...                                  // Text that will appear during the loading.
 * messageOption:   true                                        // Enables the display of messages about the grid.
 * messageTimer:    4000                                        // Time in milliseconds to keep the messages on screen.
 * noResultOption:  true                                        // Enables the presentation of the no result message.
 * noResultText:    No results found!                           // Text shown when no result is found for the search.
 * page:            1                                           // Number o the page to be displayed.
 * params:          ''                                          // Further parameters to be added to the query string.
 * resultOption:    true                                        // Enables the presentation of details of the result.
 * resultText:      'Displaying {from} - {to} of {total} items' // Text displayed in the details of the result.
 * rows:            10                                          // Number of rows displayed on each page.
 * rowsList:        [5, 10, 25, 50, 100]                        // List with the numbers of lines availables to choose.
 * rowsOption:      true                                        // Enable choose the number of rows to be displayed.
 * search:          ''                                          // Default term to be consulted.
 * searchFocus:     true                                        // Enables the automatic focus in the search field.
 * searchOption:    true                                        // Enables the search field. 
 * searchText:      ''                                          // Text displayed in the search field.
 * scroll:          false                                       // Enables the display of the grid with scroll.
 * sortList:        []                                          // List of the columns available for sorting.
 * sortName:        'id'                                        // Name of the default column sorted.
 * sortOption:      true                                        // Enables the option to sort results by column.
 * sortOrder:       'asc'                                       // Order of classification.
 * sortWidth:       'auto'                                      // Width of the sort columns wrapper.
 * success:         null                                        // Function executed when the grid loads successfully.
 * template:        'template'                                  // The ID of the script template to be loaded.
 * templateStyle:   'gridy-default'                             // Name of the template style "CSS prefix".
 * type:            'get'                                       // Type of the HTTP request.
 * url:             '/gridy'                                    // Url to request the data.
 * width:           'auto'                                      // Width of the grid.
 *
 * Usage with default values:
 * ---------------------------------------------------------------------------------
 * $('#gridy').gridy({ url: 'url/gridy' });
 *
 * <div id="gridy"></div>
 *
 * <script id="template" type="text/x-jquery-tmpl">
 *    <div>
 *       <div>${name}</div>
 *       <div>${email}</div>
 *
 *       <div class="button">
 *          <a href="#">like</a>
 *       </div>
 *    </div>
 * </script>
 *
 */