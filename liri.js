
// all these files are required so needed to be installed using npm install
const dotenv = require("dotenv").config();
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const inquirer = require("inquirer");
const keys = require("./keys.js");
const fs = require("file-system");
// const fs = require('fs');

// keys.spotify have id and secrets in it. It will fetch them from keys.js filr and store them in variable spotify
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
startApp();

// this is a function to ask user for his choice and iot has switch cases to take user to specific function
function startApp() {
	inquirer.prompt([
		{
			type: "list",
			message: "Welcome to Liri! Please select an option:",
			choices: ["my-tweets", "spotify-this-song", "movie", "do-what-it-says", "quit"],
			name: "userSelection"
		}
	])
		.then(data => {
			console.log("good");
			var app = data.userSelection;
			switch (app) {
				// case 1 for twitter
				case "my-tweets":
					tweets();
					break;
				// case 2 for spotify and it will ask for user input to enter name of song
				case "spotify-this-song":
					inquirer.prompt([
						{
							type: "input",
							message: "Enter name of the song",
							name: "songChoice"
						}
					]).then(data => {
						spotifySong(data.songChoice)
					}).catch(err => {
						spotifySong("The Ace");
					});
					break;
				// case 3 is for movie and it will ask user for its input to enter name of movie
				case "movie":
					inquirer.prompt([
						{
							type: "input",
							message: "Enter name of movie",
							name: "movieChoice"
						}
					]).then(data => {
						if (!data.movieChoice) {
							movie("Mr Nobody");
						} else {
							movie(data.movieChoice);
						}
					});
					break;
				// case 4 is for spotify again
				case "do-what-it-says":
					doThis();
					break;
				// case 5 is to quit and print thankyou
				case "quit":
					console.log("Thank you for using Liri!");
					break;
			}
		});
}

function spotifySong(song) {
	const params = {
		type: "track",
		query: song
	};
	spotify.search(params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			// console.log(data.tracks.items[0]);
			let artist = data.tracks.items[0].artists[0].name;
			let album = data.tracks.items[0].album.name;
			let preview = data.tracks.items[0].preview_url;
			console.log("SONG: " + song);
			console.log("ARTIST: " + artist);
			console.log("ALBUM: " + album);
			console.log("PREVIEW URL: " + preview);
		}
	});
}

function tweets() {
	console.log("INCOMMING TWEETS!");
	console.log("======================");
	const params = {
		screen_name: "BangaRuby",
		count: 20
	};
	client.get("statuses/user_timeline", params, function (err, tweets, response)
   {
		if (err) {
			console.log(err);
		} else {
			//  console.log(tweets)
			tweets.forEach(tweet => {
			  console.log("DATE CREATED: " + tweet.created_at);
			  console.log(tweet.text);
			console.log("====================================");
			});
		}

	});
}
function movie(movie) {
			let key = "&apikey=51495eba";
			let query = "http://www.omdbapi.com/?t=" + movie + key;

			request(query, function (err, res, body) {

				console.log(res.statusCode);

				if (!err && res.statusCode === 200) {
					let data = JSON.parse(body);
					console.log("TITLE: " + data.Title);
					console.log("YEAR: " + data.Year);
					console.log("IMDB RATING: " + data.Ratings[0].Value);
					console.log("ROTTEN TOMATOES RATING: " + data.Ratings[1].Value);
					console.log("COUNTRY: " + data.Country);
					console.log("LANGUAGE: " + data.Language);
					console.log("PLOT: " + data.Plot);
					console.log("ACTORS: " + data.Actors);
				}
				startApp();
			});
		}


function doThis() {
			fs.readFile("random.txt", "UTF-8", function (err, data) {
				if (err) {
					console.log(err);
				} else {
					spotifySong(data);
				}
			});
		}