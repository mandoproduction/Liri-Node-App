require('dotenv').config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var appCommand = process.argv[2];

var userSearch = process.argv.slice(3).join("");

function liriRun(appCommand, userSearch) {
    console.log(appCommand);
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsinTown(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;
        case "do-what-it-says":
            getRandom();
            break;

        //if appCommand is left blank return a default message.

        default:
            console.log("please enter one of the commands: 'concert-this','spotify-this-song','movie-this','do-what-it-says")
    }

}


//function to search spotify API
function getSpotify(songName) {
    //var for secret ids for spotify.
    var spotify = new Spotify(keys.spotify);
    //console.log(songName);

    //console.log("Spotify key: " + spotify);

    if (!songName) {
        songName = "yesterday";
    }
    //console.log("songName if not a song name:" + songName);
    console.log(songName);
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
            //console.log("Data for search song: " + data.tracks.items[0]);
            // line break when begin search
            console.log("===================");
            //return artist(s)
            console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
            //return song's name
            console.log("song Name: " + data.tracks.items[0].name + "\r\n");
            //return a preview link of the song from spotify
            console.log("song Preview Link: " + data.tracks.items[0].href + "\r\n");
            //return the album that the song is from
            console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

            });
}
//bands in town API function
function getBandsinTown(userSearch) {
    var artist = userSearch;
    console.log(artist);
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response) {
            console.log(response);
            //putting a line break
            console.log("=====================");
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue location: " + response.data[0].venue.city + "\r\n");
            console.log("Date of event: " + moment(response.data[0].datatime).format("MM-DD-YYYY") + "\r\n");
        });
    }; 
            
       //getting the function OMDB
            function getOMDB(movie) {
                if (!movie) {
                    movie = "Mr. Nobody";
                }
                var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
                //console.log(movieQueryUrl);;

                axios.request(movieQueryUrl).then(
                    function (response) {
                        console.log(response);
                        console.log("===========");
                        console.log("* Title: " + response.data.Title + "\r\n");
                        console.log("* Year Released:" + response.data.Year + "\r\n");
                        console.log("* IMOB Rating: " + response.data.imdbRating + "\r\n");
                        console.log("* Rotton Tomatos Rating:" + response.data.Rating[1].Value + "\r\n");
                        console.log("* Country Where Produced: " + response.data.Country + "\r\n");
                        console.log("* Language:" + response.data.Language + "\r\n");
                        console.log("* Plot: " + response.data.Plot + "\r\n");
                        console.log("* Actor:" + response.data.Actor + "\r\n");

                        //logResults(response);
                        var logMovie = "=======Begin Movie Log Entry=====" + "\nMovie title: " + response.data.Title + "\nYear Release" 
                        fs.appendFile("log.txt", logMovie, function (err) {
                            if (err) throw err;
                        });
                    });
            };

            function getRandom() {
                fs.readFile("random.txt", "utf8", function (error, data) {
                    if (error) {
                        return console.log(error);
                    }  else {
                        console.log(data);
                        var randomData = data.split(",");
                        liriRun(randomData[0], randomData[1]);
                    }
                });
            };
            //logging results fro the other function
            function logResults(data) {
                fs.appendFile("log.txt", data, function (err) {
                    if (err) throw err;
                });
            };

liriRun(appCommand, userSearch);
