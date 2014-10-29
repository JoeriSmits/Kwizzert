/**
 * Created by Israpil on 16.10.2014.
 */

var theApp = angular.module("kwizzertApp", ['ngRoute', 'colorpicker.module']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when("/home", {
                    templateUrl: "templates/home.html"
                }).
                when("/speler", {
                    templateUrl: "templates/speler.html",
                    controller: "kwizzSpeler"
                }).
                when("/meester", {
                    templateUrl: "templates/meester.html",
                    controller: "kwizzMeester"
                }).
                when("/beamer", {
                    templateUrl: "templates/beamer.html",
                    controller: "kwizzBeamer"
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);

theApp.controller("kwizzertController", function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        var s = false;
        if ($location.path().indexOf(viewLocation) != -1) {
            s = true;
        }
        return s;
    };
});

theApp.controller("kwizzMeester", function ($scope, $http) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    function generateRandomCode() {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            code += possible.charAt(Math.floor(Math.random() * possible.length));

        return code;
    }

    $scope.saveKwizzUitvoering = function () {
        var kwizzUitvoering = {
            teams: [],
            password: generateRandomCode()
        };

        $http.post("/api/kwizzUitvoeringen", kwizzUitvoering)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + kwizzUitvoering.password)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
        $scope.myCode = kwizzUitvoering.password;
        $scope.screen = "auth";
    };

    // delete a team in the authentication screen
    $scope.deleteTeam = function (teamName) {
        $http.delete("/api/kwizzUitvoeringen/" + $scope.myCode + "/teams/" + teamName)
            .success(function () {
                //Get all the teams for the kwizzUitvoering
                $http.get("/api/teams/" + $scope.myCode)
                    .success(function (data) {
                        $scope.teams = data.doc.teams;
                    });
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    };

    $scope.checkTeams = function () {
        if ($scope.teams.length >= 2 && $scope.teams.length <= 6) {
            $scope.setScreen('catg');
        }
        else {
            $scope.showError = true;
        }
    };

    // Getting all the individual categories
    $http.get("/api/vragen")
        .success(function (data) {
            var buffer, i;
            var categorieArray = [];
            buffer = data.doc[0].categorie;
            for (i = 0; i < data.doc.length; i = i + 1) {
                if (buffer !== data.doc[i].categorie) {
                    categorieArray.push(data.doc[i].categorie);
                }
                buffer = data.doc[i].categorie;
            }
            $scope.categories = categorieArray;
        });

    $scope.rondeCategorieen = [];

    $scope.addRondeCategorie = function (categorie) {
        if ($scope.rondeCategorieen.length < 3) {
            $scope.rondeCategorieen.push(categorie);
            $scope.categories.splice($scope.categories.indexOf(categorie), 1);
        }
    };

    $scope.removeRondeCategorie = function (categorie) {
        $scope.categories.push(categorie);
        $scope.rondeCategorieen.splice($scope.rondeCategorieen.indexOf(categorie), 1);
    };
});

theApp.controller("kwizzBeamer", function ($scope) {
    $scope.screen = "start";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };
});

theApp.controller("kwizzSpeler", function ($scope, $http) {
    $scope.screen = "start";
    $scope.validationState = "error";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    $scope.kwizzListPassword = '020fyGeuvP';

    $scope.authPwd = function () {

        $http.get("/api/kwizzUitvoeringen/")      //GET alle kwizz uitvoeringen
            .success( function(data) {

                console.log("Pwd database: " + data.doc.password);
                console.log("Input field: " + $scope.kwizzListPassword);

                    if (data.doc.password === $scope.kwizzListPassword) {
                        $scope.screen = "start";
                        console.log("Code Valid");
                    } else {
                        alert("There is no such code. Please try again.");
                    }

            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzSpeler Error", status, data);
            });
        $scope.screen = "start";
    };

    $scope.teamRegister = function () {
        var Team = {
            name: '',
            teamColor: ''
        };

        $scope.teamNameInput = '';

        $http.get("/teams/:uitvoeringCode")
            .success ( function () {

            if (Team.name !== $scope.teamNameInput) {

                $http.post("/teams/:uitvoeringCode", Team)
                    .success ( function() {

                    console.log("Success! Team registered");
                })

            } else {
                alert("Team name is already in use. Please try again");
            }

        })
        .error(function (data, status) {
            alert("AJAX ERROR");
            console.log("ERROR: submit kwizzUitvoering", status, data);
        });
    }


});