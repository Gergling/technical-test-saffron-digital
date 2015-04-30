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
            },
            maxDays = 0,
            Win = function (data) {
                var style = { },
                    start = new Date(data.start),
                    end = new Date(data.end),
                    diff = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24,
                    colourCode = 0,
                    red,
                    green,
                    blue;

                // Find number of days
                maxDays = Math.max(diff, maxDays);

                // Get a colour according to the window name
                data.name.split("").forEach(function (character, idx) {
                    var code = character.charCodeAt(0);
                    colourCode += code * (data.name.length - idx);
                });
                blue = colourCode % 256;
                green = (blue >> 8) % 256;
                red = (green >> 8) % 256;
                style['background-color'] = 'rgb(' + [ red, green, blue ].join(",") + ')';

                this.data = data;
                this.remove = function () { };
                this.style = function () {
                    return angular.extend({
                        width: (diff * 100 / maxDays) + '%'
                    }, style);
                };
            };

        $scope.fields = [
            field("name"),
            field("start"),
            field("end")
        ];

        $scope.windows = [ ];

        windows.list().then(function (response) {
            response.forEach(function (win) {
                $scope.windows.push(new Win(win));
            });
        });
    }
]);
