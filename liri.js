require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var axios = require("axios");
var moment = require('moment'); moment().format();


var input1 = process.argv[2];
var input2 = process.argv[3];

UserInputs(input1, input2);


function UserInputs(input1, input2) {

    switch (input1) {
        case "spotify-this-song":
            spotify(input2);
            break;

        case "movie-this":
            movieThis(input2);
            break;

        case "concert-this":
            concertThis(input2);
            break;

        case "do-what-it says":
            doit(input2);
            break;
        default:
            console.log("Please enter a valid search term, such as {concert-this},");
            console.log("{spotify-this-song}, {movie-this}, or {do-what-it-says}");
            break;
    }
}

function spotify(input2) {

    var spotify = new Spotify(keys.spotify);
    if (!input2) {
        input2 = "The Sign";
    }
    spotify.search({ type: "track", query: input2 },
        function (err, data) {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            var songs = data.tracks.items;
            console.log("Artist: " + songs[0].artists[0].name);
            console.log("Song name: " + songs[0].name);
            console.log("Preview song: " + songs[0].preview_url);
            console.log("Album: " + songs[0].album.name);
            console.log("---------Thank you Denver, you've been a great audience!--------------");
        });
}


function movieThis(input2) {
    if (!input2) {
        input2 = "Mr. Nobody"
        console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("----------------el fin----------------");
        }
    )
}

function concertThis(input2) {

    if (!input2) {
        input2 = "New Kids on the Block";
    }
    axios.get("https://rest.bandsintown.com/artists/" + input2 + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i < 3; i++) {

                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date of the Event: " + moment(response.data[i].datetime).format("L"));
                console.log("----------------------------------------");
            }
        });
}

function doit() {
    fs.readFile("random.txt", "utf8", function (err, data) {

        if (err) {
            console.log(err);
        }

        var readArray = data.split(",");

        input2 = readArray[1];

        spotifyThis(input2);
    })
};


