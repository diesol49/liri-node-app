// List all the variables we will need for our API's to work(after installing
// them through npm install)
require("dotenv").config();
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

// user commands and input to our bash
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");

// Divider for logging our information to the log.txt file
var divider = "\n------------------------------------------------------------\n\n";

// making switch-case statements to run our functions inside the terminal
function userInput(command, input) {
    switch (command) {
        case "concert-this":
            concertThis(input);
            break;
        case "spotify-this-song":
            spotifyThis(input);
            break;
        case "movie-this":
            movieThis(input);
            break;
        case "do-what-it-says":
            doThis();
            break;
    }
};
// call the function
userInput(command, input);

// FUNCTION TO RUN SPOTIFY API
function spotifyThis(input) {
    console.log(`\n~~~~~~~\nSearching For: "${input}"`);
    // Using spotify's search method from the npm api & 
    // running a function that grabs the data or displays
    // an error if nothing was returned
    spotify.search({
        type: 'track',
        query: input,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        // making a variable to save time having to time out the entire path
        var spotifyArray = data.tracks.items;
        // run a for loop that grabs the data we need within the arrays from the api
        for (var i = 0; i < spotifyArray.length; i++) {
            console.log(`\nArtist: ${spotifyArray[i].album.artists[0].name}
            \nSong: ${spotifyArray[i].name}
            \nAlbum: ${spotifyArray[i].album.name}
            \nSpotify link: ${spotifyArray[i].external_urls.spotify}
            \n~~~~~~~~`)
        };
    });
}

// FUNCTION TO RUN OMDB API
function movieThis(input) {
 
        if (!input) {
            input = "Mr. Nobody";
        };
 
        axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
                console.log("\n~~~~~~~~\n");
                console.log("Title: " + response.data.Title);
                console.log("Year Released" + response.data.Released);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                console.log("\n~~~~~~~~\n");


                fs.appendFile("log.txt", divider + response.data.Title, function (error) {
                    if (error) throw err;
                    console.log(input);
                });
            }

            
        );
 
    
 }

function concertThis(input) {
    var artist = input;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
        console.log(queryUrl);
    axios.get(queryUrl).then(function(response){
        var dataBand= response.data;
        if (!dataBand.length) {
            console.log("Couldn not find that band; Try Again");
            return;
            }
            else {
                for (var i = 0; i < dataBand.length; i++) {
                    var shows = dataBand[i];

                    console.log("Venue: " + shows.venue.name);
                    console.log("\nLocation: " + shows.venue.city);
                    console.log("\nDate: " + moment(shows.datetime).format("MM/DD/YYYY"));
                    console.log("~~~~~~~~");

                  
                }
            }
        
        });
        
    }

function doThis() {
    // We're calling our random.txt file by linking it using the fs.readFille. This is also known as the file system path.
        fs.readFile("./random.txt", "utf8", function(error, data) {
            console.log(data);
            var dataArr = data.split(",");

            if (error) {
                return console.log(error);
            }

            if (dataArr.length === 2) {
                process.argv[2] = dataArr[0];
                process.argv[3] = dataArr[1];
                spotifyThis(process.argv[3]);
            } else if (dataArr.length === 1) {
                process.argv[3] = dataArr[0];
                spotifyThis(process.argv[3]);
            }

            fs.appendFile("log.txt", data + divider, function (error) {
                if (error) throw err;
                console.log(data);
            });
        });
    }


