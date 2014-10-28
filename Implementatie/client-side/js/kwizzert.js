/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute', 'colorpicker.module']).
    config(['$routeProvider',
        function($routeProvider){
            $routeProvider.
                when("/home", {
                    templateUrl: "templates/home.html"
                }).
                when("/speler", {
                    templateUrl: "templates/speler-auth.html"
                }).
                when("/speler-start", {
                    templateUrl: "templates/speler-start.html"
                }).
                when("/speler-vraag", {
                    templateUrl: "templates/speler-vraag.html"
                }).
                when("/meester", {
                    templateUrl: "templates/meester-start.html",
                    controller: "startKwizzert"
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
                when("/meester-end" , {
                    templateUrl: "templates/meester-end.html"
                }).
                when("/beamer-start", {
                    templateUrl: "templates/beamer-start.html"
                }).
                when("/beamer", {
                    templateUrl: "templates/beamer.html"
                }).
                when("/beamer-antw", {
                    templateUrl: "templates/beamer-antw.html"
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

theApp.controller("startKwizzert", function ($scope, $location, $http) {
    var generateRandomCode = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 10; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode()
        };

        $http.post("/api/kwizzUitvoering", kwizzUitvoering)
            .success(function() {
                console.log("kwizzUitvoering succesfully saved.")
            })
            .error(function(data,status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering",status,data);
            });
    }
});