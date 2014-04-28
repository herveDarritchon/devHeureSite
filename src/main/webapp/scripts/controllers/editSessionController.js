

angular.module('developheure').controller('EditSessionController', function($scope, $routeParams, $location, SessionResource ) {
    var self = this;
    $scope.disabled = false;
    $scope.$location = $location;
    
    $scope.get = function() {
        var successCallback = function(data){
            self.original = data;
            $scope.session = new SessionResource(self.original);
        };
        var errorCallback = function() {
            $location.path("/Sessions");
        };
        SessionResource.get({SessionId:$routeParams.SessionId}, successCallback, errorCallback);
    };

    $scope.isClean = function() {
        return angular.equals(self.original, $scope.session);
    };

    $scope.save = function() {
        var successCallback = function(){
            $scope.get();
            $scope.displayError = false;
        };
        var errorCallback = function() {
            $scope.displayError=true;
        };
        $scope.session.$update(successCallback, errorCallback);
    };

    $scope.cancel = function() {
        $location.path("/Sessions");
    };

    $scope.remove = function() {
        var successCallback = function() {
            $location.path("/Sessions");
            $scope.displayError = false;
        };
        var errorCallback = function() {
            $scope.displayError=true;
        }; 
        $scope.session.$remove(successCallback, errorCallback);
    };
    
    
    $scope.get();
});