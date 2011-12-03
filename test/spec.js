describe('style option layout', function() {

	beforeEach(function() {
		$('body').append('<div id="grid"></div>');

		var data = "{\"entityList\": [{\"id\": 1, \"username\": \"ajose\", \"name\": \"Arlindo José\"},{\"id\": 2, \"username\": \"wbotelhos\", \"name\": \"Washington Botelho\"},{\"id\": 3, \"username\": \"zbotelho\", \"name\": \"Zilda Botelho\"}], \"total\": 3}";

		spyOn($, 'ajax').andCallFake(function(params) {
			params.success(data);
		});
	});

	afterEach(function() {
		$('#grid').parent().remove();
	});

	it('should chainable', function() {
		// given
		var $grid		= $('#grid'),
			className	= 'my-class';

		// when
		$grid.gridy({
			style:	'div',
			url:	'/gridy'
		}).addClass(className);

		// then
	    expect($grid).toHaveClass(className);
	});

	it('should set wrapper element', function() {
		// given
		var $grid = $('#grid');

		// when
		$grid.gridy({
			style:	'div',
			url:	'/gridy'
		});

		// then
	    expect($grid.parent()).toHaveClass('gridy-default');
	    expect($grid.parent()).toHaveId('grid-wrapper');
	});

});
