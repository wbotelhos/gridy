describe('param settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('param receive default', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search == '').toBeTruthy();
			expect(params.data.page == 1).toBeTruthy();
			expect(params.data.sortName == '').toBeTruthy();
			expect(params.data.sortOrder == 'asc').toBeTruthy();
			expect(params.data.find == '').toBeTruthy();
			expect(params.data.rows == 10).toBeTruthy();
		});

		// when
		$grid.gridy({ url: '/gridy' });

		// then check spyOn
		
	});

	it ('param receive custom', function() {
		// given
		var $grid = $('#grid');

		spyOn($, 'ajax').andCallFake(function(params) {
			expect(params.data.search == 'search').toBeTruthy();
			expect(params.data.page == 2).toBeTruthy();
			expect(params.data.sortName == 'id').toBeTruthy();
			expect(params.data.sortOrder == 'desc').toBeTruthy();
			expect(params.data.find == 'find').toBeTruthy();
			expect(params.data.rows == 3).toBeTruthy();
		});

		// when
		$grid.gridy({
			search:		'search',
			page:		2,
			sortName:	'id',
			sortOrder:	'desc',
			find:		'find',
			rows:		3,
			url:		'/gridy'
		});

		// then check spyOn
		
	});

});



describe('global settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		var data = "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}";

		spyOn($, 'ajax').andCallFake(function(params) {
			params.success(data);
			params.complete();
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('chain should be chainable', function() {
		// given
		var $grid		= $('#grid'),
			className	= 'my-class';

		// when
		$grid.gridy({ url: '/gridy' }).addClass(className);

		// then
	    expect($grid).toHaveClass(className);
	});

	it ('hidden field should have custom IDs', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({ url: '/gridy' });

		var $wrapper = $grid.parent();

		// then
	    expect($wrapper).toContain('input#grid-current-page');
	    expect($wrapper).toContain('input#grid-current-sort-name');
	    expect($wrapper).toContain('input#grid-current-sort-order');
	});

});



describe('div style', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		var data = "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}";

		spyOn($, 'ajax').andCallFake(function(params) {
			params.success(data);
			params.complete();
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('wrapper should be set', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
	    expect($grid.parent()).toHaveClass('gridy-default');
	    expect($grid.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		// then
		expect($grid).toContain('.gridy-content');
	});

	it ('content should has height and width as auto', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $content = $grid.children('.gridy-content');

		// then
	    expect($content).toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('column should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children('div:first').children('div');

		// then
	    expect($columns.length == 4).toBeTruthy();
	});

	it ('row should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children('div');

		// then
	    expect($columns.length == 3).toBeTruthy();
	});

	it ('row should have right class', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-row');
	    expect($columns.eq(1)).toHaveClass('gridy-row');
	    expect($columns.eq(2)).toHaveClass('gridy-row');
	});

	it ('row should have separate class on the first one', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:		'div',
			template:	'template-div',
			url:		'/gridy'
		});

		var $columns = $grid.children('.gridy-content').children();

		// then
	    expect($columns.eq(0)).toHaveClass('gridy-separate');
	});

});



describe('Using table style', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		var data = "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}";

		spyOn($, 'ajax').andCallFake(function(params) {
			params.success(data);
			params.complete();
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('wrapper should be set', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		// then
	    expect($grid.parent()).toHaveClass('gridy-default-table');
	    expect($grid.parent()).toHaveId('grid-wrapper');
	});

	it ('content should be created', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		// then
		expect($grid).toContain('tbody.gridy-content');
	});

	it ('content should NOT has height and width as auto', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $content = $grid.children('tbody.gridy-content');

		// then
	    expect($content).not.toHaveAttr('style', 'height: auto; width: auto;');
	});

	it ('row should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $rows = $grid.children('tbody.gridy-content').children('tr');

		// then
	    expect($rows.length == 3).toBeTruthy();
	});

	it ('column should have the right count', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $columns = $grid.children('tbody.gridy-content').children('tr:first').children('td');

		// then
	    expect($columns.length == 4).toBeTruthy();
	});

	it ('row should NOT set class but use CSS by tr identification', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $rows = $grid.children('tbody.gridy-content').children();

		// then
	    expect($rows.eq(0)).not.toHaveAttr('class');
	    expect($rows.eq(1)).not.toHaveAttr('class');
	    expect($rows.eq(2)).not.toHaveAttr('class');
	});

	it ('row should have separate class on the first tds', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			url:	'/gridy'
		});

		var $row = $grid.children('.gridy-content').children('tr:first');

		// then
	    expect($row.children('td')).toHaveClass('gridy-separate');
	});

});


// TODO for message timer fadeout

describe('error settings', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it ('message should be displayed with responseText error', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { responseText: '(responseText)',  statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr);
		});

		// when
		$grid.gridy({ url: '/gridy' });

		var $message = $grid.parent().find('.gridy-message');

		// then
		expect($message).toBeVisible(); 
		expect($message).toHaveText('responseText'); 
	});

	it ('message should be displayed with full statusText error when there is no responseText', function() {
		// given
		var $grid	= $('#grid'),
			xhr		= { statusText: 'statusText' };

		spyOn($, 'ajax').andCallFake(function(params) {
			params.error(xhr);
		});

		// when
		$grid.gridy({ url: '/gridy' });

		var $message = $grid.parent().find('.gridy-message');

		// then
		expect($message).toBeVisible(); 
		expect($message).toHaveText('statusText'); 
	});

});
