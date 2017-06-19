app.controller('solrCtrl', function($scope, solrService, rx) {

	const pageBy = 10;
	var start = 0;

	$scope.autocompleteTerm = '';
	$scope.numFound = '';
	$scope.results = [];
	$scope.searchTerm = '';

	function search(term, start) {
		var queryParams = {
			q: term,
			start: start,
			rows: '10',
			wt: 'json'
		};

		return solrService.search(queryParams);
	}

	function suggest(term) {
		var queryParams = {
			q: term,
			wt: 'json',
			indent: true,
			debugQuery: true
		};

		return solrService.suggest(queryParams);
	}
	
	$scope
		.$toObservable('autocompleteTerm')
		.debounce(300)
		.map(function(data) { return data.newValue; })
		.distinctUntilChanged()
		.flatMapLatest(function(term) { return suggest(term); })	
		.subscribe(function(val) { 
			$scope.suggestions = val; 
			$scope.$apply();
		});

	$scope
		.$createObservableFunction('clickSearch')
		.map(function(term) { return term.trim(); })
		.map(function(term) { return term.replace(/"/g,''); })
		.flatMapLatest(function(term) { return search(term, '0');})
		.subscribe(function(results) {
			$scope.results = results.docs;
			$scope.numFound = results.numFound;
			$scope.$apply();
		});
});
