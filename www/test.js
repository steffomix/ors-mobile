function PromiseCtrl($scope, $q, $timeout) {
    // Our promise function with its delay as argument
    var getPromise = function(delay) {
        // Creates a Deferred object
        var deferred = $q.defer();
                       
        $timeout(function() {
            // Resolve the promise at the end of the delay if said delay was > 0
            if(delay > 0) {
                deferred.resolve("Success");
            } else {
                deferred.reject("Fail");
            }
        }, delay);
        
        // The promise of the deferred task
        return deferred.promise;
    };
    
    // Init
    $scope.result = "Waiting";
    
    /*
	 * Combines multiple promises into a single promise
     * that will be resolved when all of the input promises are resolved
	 */
    $q.all([
            getPromise(1000),
            getPromise(2000),
            getPromise(3000) // <--- Try something less than 0
        ]).then(function(value) {
        // Success callback where value is an array containing the success values
        $scope.result = value;       
    }, function(reason) {
        // Error callback where reason is the value of the first rejected promise
        $scope.result = reason;
    });
}
