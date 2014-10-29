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

    // Generating an code to link everyone to the right kwizzUitvoering
    function generateRandomCode() {
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            code += possible.charAt(Math.floor(Math.random() * possible.length));

        return code;
    }

    // Saving a new kwizzUitvoering
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

    // Check if the team amount is between 2 and 6
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

    // Adding new categories to the round with a max of 3
    $scope.addRondeCategorie = function (categorie) {
        if ($scope.rondeCategorieen.length < 3) {
            $scope.rondeCategorieen.push(categorie);
            $scope.categories.splice($scope.categories.indexOf(categorie), 1);
        }
    };

    // Deleting categories and add them to the general list.
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
    $scope.screen = "auth";
    $scope.validationState = "error";

    $scope.setScreen = function (target) {
        $scope.screen = target;
    };

    // Making a link with the right kwizzUitvoering
    $scope.authPwd = function (kwizzListPassword) {
        $scope.kwizzListPassword = kwizzListPassword;

        $http.get("/api/kwizzUitvoeringen/")
            .success(function (data) {
                var i, codeExist;
                // Check if the code exist in the database and if so, continue
                for (i = 0; i < data.doc.length; i = i + 1) {
                    if (data.doc[i].password === $scope.kwizzListPassword) {
                        $scope.screen = "start";
                        codeExist = true;
                    }
                }
                // If not show an error
                if (!codeExist) {
                    alert("code is fout");
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: kwizzSpeler Error", status, data);
            });
    };

    // Saving a team in the database with a reference to the right kwizzUitvoering
    $scope.teamRegister = function (teamInfo) {
        var Team = {
            name: teamInfo.name,
            teamColor: teamInfo.color
        };

        $http.get("api/teams/" + $scope.kwizzListPassword)
            .success(function (data) {
                // Checking if the team name is already in use
                var i, alreadyInUse;
                for (i = 0; i < data.doc.teams.length; i = i + 1) {
                    if (Team.name === data.doc.teams[i].name) {
                        alreadyInUse = true;
                    }
                }
                // If not then continue with team registration
                if (!alreadyInUse) {
                    $http.post("/teams/:uitvoeringCode", Team)
                        .success(function () {
                            console.log("Success! Team registered");
                        })
                }
                // Otherwise show an error
                else {
                    alert("Team name is already in use. Please try again");
                }
            })
            .error(function (data, status) {
                alert("AJAX ERROR");
                console.log("ERROR: submit kwizzUitvoering", status, data);
            });
    }


});