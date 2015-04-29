angular.module('application').controller("application.controller.index", [

    "$rootScope",
    "application.service.window",

    function ($scope, windows) {

        "use strict";

        var field = function (name) {
            return {
                name: name,
                label: angular.uppercase(name.charAt(0)) + name.substring(1)
            };
        };

        $scope.fields = [
            field("name"),
            field("start"),
            field("end")
        ];

        windows.list().then(function (response) {
            $scope.windows = response;
        });
    }
]);
