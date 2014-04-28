
angular.module('developheure').controller('NewSessionController', function ($scope, $location, locationParser, SessionResource ) {
    $scope.disabled = false;
    $scope.$location = $location;
    $scope.session = $scope.session || {};
    

    $scope.save = function() {
        var successCallback = function(data,responseHeaders){
            var id = locationParser(responseHeaders);
            $location.path('/Sessions/edit/' + id);
            $scope.displayError = false;
        };
        var errorCallback = function() {
            $scope.displayError = true;
        };
        SessionResource.save($scope.session, successCallback, errorCallback);
    };
    
    $scope.cancel = function() {
        $location.path("/Sessions");
    };
});