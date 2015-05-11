var gulp    = require("gulp"),
    webpack = require("gulp-webpack");

var packageInfo = require("./package.json");
var banner      = "milktea\n\
copyright (c) 2015 Susisu | MIT License\n\
https://github.com/susisu/milktea";

gulp.task("webpack", function () {
    return gulp.src("./lib/milktea.js")
        .pipe(webpack({
            "output": {
                "libraryTarget": "var",
                "library"      : "milktea",
                "sourcePrefix" : "    ",
                "filename"     : "milktea." + packageInfo.version + ".js"
            },
            "externals": {
                "loquat": true
            },
            "plugins": [
                new webpack.webpack.BannerPlugin(
                    banner,
                    { "entryOnly": true }
                )
            ]
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("webpack-min", function () {
    return gulp.src("./lib/milktea.js")
        .pipe(webpack({
            "output": {
                "libraryTarget": "var",
                "library"      : "milktea",
                "sourcePrefix" : "    ",
                "filename"     : "milktea." + packageInfo.version + ".min.js",
            },
            "externals": {
                "loquat": true
            },
            "plugins": [
                new webpack.webpack.optimize.UglifyJsPlugin(),
                new webpack.webpack.BannerPlugin(
                    banner,
                    { "entryOnly": true }
                )
            ]
        }))
        .pipe(gulp.dest("./build"));
});

gulp.task("build", ["webpack", "webpack-min"]);

gulp.task("default", ["build"]);
