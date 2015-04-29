angular.module("application").service("application.service.window", [

    "$http",
    "$q",

    function ($http, $q) {

        "use strict";

        var deferred = $q.defer();

        $http.get("windows.json").success(function (response) {
            deferred.resolve(response);
        });

        this.list = function () { return deferred.promise; };
    }
]);