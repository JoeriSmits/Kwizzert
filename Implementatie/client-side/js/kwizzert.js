/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute']).
    config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
                when("/speler", {
                    templateUrl: "templates/speler.html",
//                    controller: ""
                }).
                when("/meester-start", {
                    templateUrl: "templates/meester-start.html"
                }).
                when("/meester-auth" , {
                    templateUrl: "templates/meester-auth.html"
                }).
                when("/meester-catg" , {
                    templateUrl: "templates/meester-catg.html"
                }).
                when("/meester-vraag" , {
                    templateUrl: "templates/meester-vraag.html"
                }).
                when("/meester-antw" , {
                    templateUrl: "templates/meester-antw.html"
                }).
                when("/beamer", {
                    templateUrl: "templates/beamer.html"
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);

theApp.controller("kwizzertController", function($scope, $location){
    $scope.isActive = function (viewLocation) {
        var s = false;
        if($location.path().indexOf(viewLocation) != -1){
            s = true;
        }
        return s;
    };

    $scope.go = function ( path ) {
        $location.path( path );
    };
});