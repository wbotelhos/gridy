# jQuery Gridy - A Grid Plugin - http://wbotelhos.com/gridy

### 0.3.0 (Development)

+ Now 'paramsElements' capture class elements as a array of parameter and other elements as simple value;
+ Now you can use table rather div if you have just tabulated data in a list format;
+ Now the component 'find' will be hanging on search container;
+ Now the 'params' option is sent as hash object intead a simple query string;
+ Now the 'paramsElements' option is sent as hash object intead a simple query string;
+ Now the 'debug' option was improved to show a better description;
+ Now the Gridy has a major wrapper to keep all the grid;
+ Now the 'success', 'error' and 'complete' callback receives the original $.ajax() parameters;
+ Now the 'success', 'error' and 'complete' callback has the 'this' as the Gridy context;
+ Now the defaults options that not belongs Gridy has it owner original value;
+ Now the options 'buttonsWidth' no more exists;
+ Now the callback 'before' receives the raw scope 'this' instead the jQuery selector;
+ Now the callback 'before' will be called as 'filter' to have an better semantics;

+ Changed the delegate() method to click() and die() to be able use on jQuery 1.4.x;
+ Changed the name of the 'templateStyle' option to 'skin';

+ Fixed gridy when search gets no result; (by Gabriel Benz)
+ Fixed the ID of hidden fields to not repeat when has more than one gridy on page;
+ Fixed the ID of search field to not repeat when has more than one gridy on page;
+ Fixed the separate class to not be applied on no result row;
+ Fixed undesired trigger on back and next button with NaN page;
+ Fixed the JSON return taked from the callback 'before';

+ Added 'resize' option to apply the same width of the content to the other wrappers;
+ Added 'evenOdd' option to enables the even odd row style;
+ Added 'paramsElements' option to choose an array of selectors of fields to be used it values as parameters;
+ Added 'listPath' option to choose the path of the list element like 'response.movie.list';
+ Added 'totalPath' option to choose the path of the total element like 'response.movie.total';
+ Added 'style' option to choose between table and div grid style;
+ Added 'separate' option to change the style of the first line on grid to separate visually the header;
+ Added 'refreshTarget' option to choose where the refresh button should appear;

+ Added function 'reload' to reload the grid with current filter configuration;
+ Added function 'set' to reload the grid with new options;

### 0.2.0

+ The 'rowsList'  renamed to 'rowsNumber';
+ The 'findList'  renamed to 'findsName';
+ The 'sortList'  renamed to 'sortersName';
+ The 'sortWidth' renamed to 'sorterWidth';

+ The parameter 'key' of the query string was renamed to 'search';

+ The 'findsName' will not more copy the sortersName values;

+ The 'find'     empty by default;
+ The 'sortName' empty by default;

+ The 'sortOption', 'rowsOption' and 'findOptions' will no longer be used:
    + All attribute that use list will be enabled when it has a element inside.

+ The 'sorterName', 'headersName' an 'findsName' now are a array of array:
    + The first element of the inner array is the name of the manipulated attribute; 
    + The second one, is the label that will be presented on the screen, but no used in query string. 

+ Added the attribute 'searchButtonLabel' to choose the label of the search button;
+ Added the attribute 'searchButtonTitle' to choose the title of the search button;

+ Created public function 'reload(id, settings)' to reload the grid;

+ Now the buttons page element has back and next navigation:
    + Use 'buttonBackTitle' to choose the title of the back button;
    + Use 'buttonNextTitle' to choose the title of the next button.

+ Now you can enable a header to the grid with sort option:
    + Use 'headersName' to indicate the name of the columns;
    + Use 'headersWidth' to indicate the width of the header.


### 0.1.0 (in this first version you can):

+ Choose class to be used as icon on the descending sort;
+ Choose class to be used as icon when there is no sort;
+ Choose class to be used as icon on the ascending sort;
+ Enables a function to be executed before the grid load;
+ Shows pagination buttons;
+ Choose alternative text to be prepended on the page buttons;
+ Choose width of the buttons wrapper;
+ Enables ajax cache;
+ Enables rows selection on click;
+ Set a list with the width of each column of the grid;
+ Enables a function to be executed when the grid load;
+ Choose the content type of the ajax request;
+ Choose the data type of the ajax request;
+ Shows details of the grid request;
+ Enables a function to be executed when occurs an error;
+ Choose the name of the column where research will be done;
+ Set a list with the name of the columns for research;
+ Choose the column to do the research;
+ Choose the height of the grid;
+ Enables highlight rows on mouseover;
+ Enables the JSONP content type;
+ Choose the name of the callback function for JSONP content type;
+ Choose the name of the class used as a loading icon;
+ Enables the presentation of the loading message;
+ Choose the text that will appear during the loading;
+ Enables the display of messages about the grid;
+ Choose the time in milliseconds to keep the messages on screen;
+ Enables the presentation of the no result message;
+ Choose the text shown when no result is found for the search;
+ Choose the number of the page to be displayed;
+ Set parameters to be added to the query string;
+ Enables the presentation of details of the result;
+ Choose the text displayed in the details of the result;
+ Choose the number of rows displayed on each page;
+ Set a list with the numbers of lines availables to choose;
+ Enable choose the number of rows displayed;
+ Choose the default term to be consulted;
+ Enables the automatic focus in the search field;
+ Enables the search field; 
+ Choose the text displayed in the search field;
+ Enables the display of the grid with height limit and scroll;
+ Set a List of the columns available for sorting;
+ Choose the name of the default column to be sorted;
+ Enables the option to sort results by column;
+ Choose the order of classification;
+ Choose the width of the sort columns wrapper;
+ Enables a function to be executed when the grid loads successfully;
+ Choose the ID of the script template to be loaded;
+ Choose the name of the template style "CSS prefix";
+ Choose the type of the HTTP request;
+ Choose the url to request the data;
+ Choose the width of the grid.
