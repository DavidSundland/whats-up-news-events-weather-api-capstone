// TO-DO:  GET RID OF UNNECESSARY PUSH.  CLEAN UP DATES.  CONSOLIDATE FUNCTIONS.  FURTHER CLEAN-UP OF EVENTFUL* (INCLUDING DOING SOMETHING WITH 'NULL' RESULTS, POSSIBLY SKIPPING CRAP RESULTS, AND ADJUSTING NUMBER OF RESULTS).  MAKE SURE "net::ERR_CONNECTION_TIMED_OUT" IS NOT A CONTINUING PROBLEM. REARRANGE PAGE ORDER.  ADD FOOTER
// *EVENTFUL NOTE - EVENTS DO HAVE UNIQUE ID AND URL.  COULD RUN WITH 4 MILE (OR WHATEVER) DISTANCE, SEE IF THERE ARE ENOUGH RESULTS, AND IF NOT, RUN AGAIN, AVOIDING REDUNCANCIES LIKE IN DC SCRAPING....
// EVENTFUL - IF DESCRIPTION AND TITLE NULL (OR REDUNDANT), IMMEDIATELY RETURN, WITH A VALUE LIKE 'SKIP' FOR EASY CULLING LATER
// LOOK AT DARK SKY API


// CHECK SECURITY STATUS VIA GIT.  GET RID OF HOLIDAYS?  CLEAN UP HTML STRUCTURE.  KILL UNNECESSARY HTML ONCE STRUCTURE CLEAN.  SHRINK WEATHER DISPLAY, MAKE SURE RESPONSIVE.

// git add . ; git commit -m 'REPLACE-ME'; git pull origin master; git push --set-upstream origin master


// JavaScript file for Thinkful Capstone 1

// https://www.w3schools.com/jsref/prop_win_innerheight.asp - BROWSER WINDOW WIDTH

const NEWSURL = 'https://newsapi.org/v2/everything';
const NEWSAPI = '5fbeb324e35042e09cc7df22185fe8e6';
const EVENTFULURL = 'https://api.eventful.com/json/events/search';
const HOLIDAYURL = 'https://holidayapi.com/v1/holidays';
const WEATHERURL = 'https://api.geonames.org/findNearByWeatherJSON';
const WEATHERFORECASTURL = 'https://api.openweathermap.org/data/2.5/forecast';
const MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHNAMES = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
let newsSources = 'the-washington-post,associated-press,al-jazeera-english,bbc-news,the-new-york-times,politico,the-economist';
let sportsSources = 'talksport,bleacher-report,nfl-news,nhl-news,the-sport-bible';
let entertainmentSources = 'entertainment-weekly,mtv-news';
let financialSources = 'financial-post,financial-times,fortune,business-insider';


function getDate(country) {
    let today = new Date();
    let headingDate;
    if (country === 'us' || country === 'US') {
        headingDate = MonthNames[today.getMonth()] + " " + today.getDate().toString() + ", " + today.getFullYear() + ",";
    } else {
        headingDate = today.getDate().toString() + " " + MonthNames[today.getMonth()] + " " + today.getFullYear() + ",";
    }
    $('.insert-date').html(headingDate);
    $('.insert-month').html(MonthNames[today.getMonth()]);
}

function titleCase(str) { // Capitalize first letter in every word of a string, make all others lowercase
    //    console.log(str);
    words = str.toLowerCase().split(' ');

    for (var i = 0; i < words.length; i++) {
        var letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
    }
    return words.join(' ');
}

function sentenceCase(str) { // Capitalize first letter in every sentence, make all others lowercase
    sentences = str.toLowerCase().split('. ');

    for (var i = 0; i < sentences.length; i++) {
        var letters = sentences[i].split('');
        letters[0] = letters[0].toUpperCase();
        sentences[i] = letters.join('');
    }
    return sentences.join('. ');
}

function getLatLongFromAddress() {
    console.log("getLatLongFromAddress started");
    var geocoder = new google.maps.Geocoder();
    let address;
    //    var address = "3645 13th st nw washington dc";
    $('.newLocation').submit(event => {
        console.log("New location submitted");
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        address = queryTarget.val();
        console.log("Location submitted: ", address);
        queryTarget.val(""); // clear out the input
        $("input").attr("placeholder", " Enter a new search address");
        geocoder.geocode({
            'address': address
        }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                console.log("Lat: " + latitude + ", Long: " + longitude);
                callPlaceBased(latitude, longitude);
            } else {
                alert("Uh-oh, something went wrong!");
            }
        });
    });
}


function querySubmit() {
    //    console.log("newsQuerySubmit");
    $('.newsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $("input").attr("placeholder", " Enter a new search item");
        getNews(searchTerm, newsSources, "News");
    });
    $('.sportsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $("input").attr("placeholder", " Enter a new search item");
        getNews(searchTerm, sportsSources, "Sports");
    });
    $('.entertainmentSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $("input").attr("placeholder", " Enter a new search item");
        getNews(searchTerm, entertainmentSources, "Entertainment");
    });
    $('.financialSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $("input").attr("placeholder", " Enter a new search item");
        getNews(searchTerm, financialSources, "Financial");
    });
}

function seeMore() {
    $("#moreNews").click(function () {
        $(".News").toggleClass("seeMore");
        if ($("#moreNews").html() === "See More") {
            $("#moreNews").html("Remove Scrollbar");
        } else {
            $("#moreNews").html("See More");
        }
    });
    $("#moreSports").click(function () {
        $(".Sports").toggleClass("seeMore");
        if ($("#moreSports").html() === "See More") {
            $("#moreSports").html("Remove Scrollbar");
        } else {
            $("#moreSports").html("See More");
        }
    });
    $("#moreEntertainment").click(function () {
        $(".Entertainment").toggleClass("seeMore");
        if ($("#moreEntertainment").html() === "See More") {
            $("#moreEntertainment").html("Remove Scrollbar");
        } else {
            $("#moreEntertainment").html("See More");
        }
    });
    $("#moreFinancial").click(function () {
        $(".Financial").toggleClass("seeMore");
        if ($("#moreFinancial").html() === "See More") {
            $("#moreFinancial").html("Remove Scrollbar");
        } else {
            $("#moreFinancial").html("See More");
        }
    });
    //    $("#moreWeather").click(function () {
    //        $("#weather").children(".mainInfo").toggleClass("seeMore");
    //        if ($("#moreWeather").html() === "Show More") {
    //            $("#moreWeather").html("Remove Scrollbar");
    //        } else {
    //            $("#moreWeather").html("Show More");
    //        }
    //    });
    $("#moreWeather").click(function () {
        $(".mainInfo").toggleClass("seeMore");
        if ($("#moreWeather").html() === "Show More") {
            $("#moreWeather").html("Remove Scrollbar");
        } else {
            $("#moreWeather").html("Show More");
        }
    });
    $("#moreForecast").click(function () {
        $("#forecast").toggleClass("seeMore");
        if ($("#moreForecast").html() === "Show More") {
            $("#moreForecast").html("Remove Scrollbar");
        } else {
            $("#moreForecast").html("Show More");
        }
    });

    //    $("#moreForecast").click(function () {
    //        $("#forecast").toggleClass("seeMore");
    //        if ($("#moreForecast").html() === "Show More") {
    //            $("#moreForecast").html("Remove Scrollbar");
    //        } else {
    //            $("#moreForecast").html("Show More");
    //        }
    //    });
}

function getNews(searchTerm, sources, category) {
    let today = new Date();
    let endDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString(); // getMonth returns month value from 0 to 11...
    let before = new Date(today);
    let beforeDifference = 0; // TEST PAGE WITH RESULTS FROM TODAY ONLY; IF NOT ENOUGH RESULTS, CHANGE INCREMENT
    before.setDate(today.getDate() - beforeDifference);
    let startDate = before.getFullYear().toString() + '-' + (before.getMonth() + 1).toString() + '-' + before.getDate().toString();
    getTheNews(sources, searchTerm, startDate, endDate, category);
}

function getTheNews(sources, searchTerm, startDate, endDate, section) {
    const query = {
        q: searchTerm,
        sources: sources,
        from: startDate,
        to: endDate,
        sortBy: 'popularity',
        language: 'en',
        apiKey: NEWSAPI
    };
    var result = $.ajax({
            url: NEWSURL,
            data: query,
            dataType: "json",
            type: "GET"
        })
        .done(function (result) {
            //            console.log(sources, "result = ", result);
            //            runFunction(result);
            const results = result.articles.map((item, index) => renderNews(item, section));
            $('.' + section).html(`<div class = "newsHeader"><h2>${section}</h2></div>`);
            for (i = 0; i < results.length; i++) {
                if (results[i] !== undefined) {
                    $('.' + section).append(results[i]);
                }
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function renderNews(result, section) {
    //    console.log("In renderNews");
    if (result["author"] === null) {
        result["author"] = result["source"]["name"];
    }
    try {
        result["author"] = titleCase(result["author"]); // A lot of author names are all caps; correct that offense.
    } catch (err) {
        console.log("Could not get titleCase for author - no author or source name?", err);
    }
    if (result["urlToImage"] === null || result["urlToImage"] === undefined || result["urlToImage"].length < 6) {
        return; // If no image, have empty return (don't bother printing to screen)
    }
    result["urlToImage"] = result["urlToImage"].replace("http:", "https:");
    return `<div class="row"><img src='${result["urlToImage"]}'><span class="title"><a href='${result["url"]}' target='_blank'>${result["title"]}</a></span>, by <span class="author">${result["author"]}</span?>. <span class="description">${result["description"]}</span></div>`;
}

//function displayNews(data) {
//    console.log("In displayNews");
//    console.log(data);
//    const results = data.articles.map((item, index) => renderNews(item));
//    console.log("News Results:", results);
//}

//function displaySports(data) {
//    console.log("In displaySports");
//    console.log(data);
//    const results = data.articles.map((item, index) => renderSports(item));
//    console.log("Sports Results:", results);
//}
//
//function renderSports(result) {
//    console.log("In renderSports");
//    let returnArray = [];
//    returnArray.push(`${result["title"]}'`); // OTHER AVAILABLE INFO:  (author), description, (publishedAt (time)), (source[id]), source[name] (publication name), url, urlToImage
//    return returnArray;
//}
//
//function displayEntertainment(data) {
//    console.log("In displayEntertainment");
//    console.log(data);
//    const results = data.articles.map((item, index) => renderEntertainment(item));
//    console.log("Entertainment Results:", results);
//}
//
//function renderEntertainment(result) {
//    console.log("In renderEntertainment");
//    let returnArray = [];
//    returnArray.push(`${result["title"]}'`); // OTHER AVAILABLE INFO:  (author), description, (publishedAt (time)), (source[id]), source[name] (publication name), url, urlToImage
//    return returnArray;
//}
//
//function displayFinancial(data) {
//    console.log("In displayFinancial");
//    console.log(data);
//    const results = data.articles.map((item, index) => renderFinancial(item));
//    console.log("News Results:", results);
//}
//
//function renderFinancial(result) {
//    console.log("In renderFinancial");
//    let returnArray = [];
//    returnArray.push(`${result["title"]}'`); // OTHER AVAILABLE INFO:  (author), description, (publishedAt (time)), (source[id]), source[name] (publication name), url, urlToImage
//    return returnArray;
//}

function getPlaceBased() {
    if (!navigator.geolocation) {
        navNoGo();
        return;
    }

    function error() {
        navNoGo();
        return;
    }

    function success(position) {
        let userLat = position.coords.latitude;
        let userLong = position.coords.longitude;
        callPlaceBased(userLat, userLong);
    }
    navigator.geolocation.getCurrentPosition(success, error);
}

function navNoGo() {
    let userLat = "38.89";
    let userLong = "-77.034";
    console.log("Geolocation is not supported by this browser.");
    callPlaceBased(userLat, userLong);
}

function callPlaceBased(userLat, userLong) {
    let today = new Date();
    let eventfulStartDate = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString() + "00"; // eventful date format is:  YYYYMMDD00
    let eventfulEndDate = eventfulStartDate; // for first call, only search for today
    let eventfulQuery = ""; // search all events initially
    let distance = 4; // Initial search distance for Eventful (4 miles - a reasonable distance for a big city)
    let counter = 1;
    let maxCount = 6; // Maximum number of times to run testEventfulApi
    distance = testEventfulApi(userLat, userLong, distance, eventfulStartDate, eventfulEndDate, counter, maxCount);
    getEventfulApi(userLat, userLong, distance, eventfulStartDate, eventfulEndDate, eventfulQuery, 1);
    //    try { Geonames site was yielding security issues, so went alternative route
    //        $.getJSON // Get the user's country code; use that to pull holidays & determine whether to use metric or outdated measurements for weather
    //        (
    //            '//ws.geonames.org/countryCode', {
    //                lat: userLat,
    //                lng: userLong,
    //                username: 'dsundland',
    //                type: 'JSON'
    //            },
    try {
        $.getJSON // Get the user's country code; use that to pull holidays & determine whether to use metric or outdated measurements for weather
        (
            'https://maps.googleapis.com/maps/api/geocode/json', {
                latlng: userLat + "," + userLong,
                key: "AIzaSyAa9jFz1GClkj8pW9ytY6tB70hVFj1RGYQ",
                sensor: false
            },
            function (result) {
                console.log("Google attempt: ", result);
                let countryCode;
                for (i = 0; i < result["results"][0]["address_components"].length; i++) {
                    if (result["results"][0]["address_components"][i]["types"][0] === "country") { // Location of country code in array varies, depending on amount of info about that location
                        countryCode = result["results"][0]["address_components"][i]["short_name"];
                        break;
                    }
                }
                //                getHolidaysApi(countryCode);
                getDate(countryCode);
                getWeatherAPI(userLat, userLong, countryCode); // //api.geonames.org/findNearByWeatherJSON?lat=43&lng=-2&username=demo
                getWeatherForecastApi(userLat, userLong, countryCode);
            }
        );
    } catch (err) {
        console.log("Geonames country code threw error: ", err);
        //        getHolidaysApi("US");
        getDate("US");
        getWeatherAPI(userLat, userLong, "US"); // //api.geonames.org/findNearByWeatherJSON?lat=43&lng=-2&username=demo
        getWeatherForecastApi(userLat, userLong, "US");
    }
}

function testEventfulApi(lat, long, distance, eventStartDate, eventEndDate, counter, maxCount) { // Since Eventful might not pull many results within 4 miles, test to determine necessary distance
    let query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        location: lat + ',' + long,
        //        location: "39.597462" + ',' + "-111.439893",  // FOR TESTING - LOCATION IN REMOTE PART OF UTAH
        //        keywords: 'happiness',
        date: eventStartDate + "-" + eventEndDate, // Could be This%20Week, Future, Today, or date in form YYYYMMDD00-YYYYMMDD00
        ex_category: 'other,sales,business', // Excluded categories
        within: distance
    };
    let result = $.ajax({
            url: EVENTFULURL,
            data: query,
            dataType: "jsonp",
            type: "GET"
        })
        .done(function (result) {
            if (result.events.event.length < 5 && counter < maxCount) {
                distance *= 2;
                counter++;
                testEventfulApi(lat, long, distance, eventDate, counter, maxCount);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
    return distance;
}


function getEventfulApi(lat, long, distance, eventStartDate, eventEndDate, query, pageNumber) {
    //    console.log("In getEventfulApi, eventDate = ", eventDate);
    var query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        keywords: query,
        location: lat + ',' + long,
        date: eventStartDate + "-" + eventEndDate, // Could be This%20Week, Future, Today, or date in form YYYYMMDD00-YYYYMMDD00
        page_size: 10,
        page_number: pageNumber,
        ex_category: 'other,sales,business',
        sort_order: 'date',
        sort_direction: 'descending', // Pull in descending date order to avoid events that have start and end dates that are months apart
        within: distance
    };
    var result = $.ajax({
            url: EVENTFULURL,
            data: query,
            dataType: "jsonp",
            type: "GET"
        })
        .done(function (result) {
            console.log("getEventfulApi done result = ", result);
            displayEventful(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayEventful(data) {
    //    console.log("In displayEventful");
    //    console.log(data);
    const results = data.events.event.map((item, index) => renderEventful(item));
    $('#events').html(""); // clear out old results, if applicable.
    //    console.log(results);
    for (i = 0; i < results.length; i++) {
        if (results[i] !== undefined) { // renderEventful will run an empty return if events are of too poor quality
            $('#events').append(results[i]);
        }
    }
}

function renderEventful(result) {
    //    console.log("In renderEventful");
    //    let returnArray = [];
    if ((result["title"] === null || result["title"].length < 5) && (result["description"] === null || result["description"].length < 5)) {
        return; // if there is no title or description, or if both are preposterously short, return with no value
    }
    let maxDescription = 200;
    let maxTitle = 150;
    let killSpaces;
    if (result["title"] === null) {
        maxDescription += 50; // If there is no title, allow longer description
    }
    if (result["description"] === null) {
        maxTitle += 50; // If there is no description, allow longer title
    } else {
        result["description"].replace(/\_+/g, '_'); // Remove abusive use of underscores
        result["description"].replace(/\-/g, '-'); // Remove abusive use of hyphens
        result["description"].replace(/\s+/g, ' '); // Remove abusive use of white space
        if (result["description"].length > maxDescription) {
            result["description"] = result["description"].substring(0, maxDescription) + "..."; // shorten excessive descriptions
        }
        killSpaces = result["description"].replace(/\s/g, ''); // Create copy of description w/ no white space...
        if (/[A-Z]{10,}/.exec(killSpaces)) // If result has 10 or more capital letters in a row, let's eliminate that ALL CAPS abuse
        {
            result["description"] = sentenceCase(result["description"]);
        }
    }
    if (result["title"] !== null) {
        if (result["title"].length > maxTitle) {
            result["title"] = result["title"].substring(0, maxTitle) + "..."; // shorten excessive titles
        }
        killSpaces = result["title"].replace(/\s/g, ''); // Create copy of title w/ no white space...
        if (/[A-Z]{10,}/.exec(killSpaces)) // If result has 10 or more capital letters in a row, let's eliminate that ALL CAPS abuse
        {
            result["title"] = titleCase(result["title"]);
        }
    }
    let dateTime = new Date(result.start_time);
    let date = dateTime.toLocaleDateString();
    let time = dateTime.toLocaleTimeString();
    return `<p><a href='${result.url}' target='_blank'>${result.title}</a>. ${result.description} At ${result.venue_name} - ${result.venue_address}, ${result.city_name}, ${result.region_abbr}.  Start time: ${time}. Date: ${date}.`;
}

function getHolidaysApi(countryCode) { // CAN'T USE?  API NOT SECURE
    var today = new Date();
    var month = today.getMonth() + 1; // getMonth returns month value from 0 to 11; Holidays API expects values from 1 to 12
    var year = today.getFullYear() - 1; // NOTE - must pay to get current and future holidays; past holidays are free
    var query = {
        country: countryCode,
        year: year,
        month: month,
        key: '20a52b19-23d9-494c-918d-9df670c747c4'
    };
    var result = $.ajax({
            url: HOLIDAYURL,
            data: query,
            dataType: "json",
            type: "GET"
        })
        .done(function (result) {
            displayHolidays(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log("jqXHR:", jqXHR);
            console.log("error:", error);
            console.log("errorThrown:", errorThrown);
        });
}

function displayHolidays(data) { // CAN'T USE?  API NOT SECURE
    let killMultiDay;
    let arrayNoDuplicates = []; // For multi-day holidays, Holiday API lists same holiday multiple times. Eliminate duplicates.
    data.holidays.forEach(function (oneHoliday) {
        killMultiDay = /[a-zA-Z]+\s+[Dd]ay\s+of\s+([a-zA-Z]+)/.exec(oneHoliday.name); // Use RegEx to eliminate multiple instances of holiday (First Day of..., etc.)
        if (killMultiDay !== null) {
            oneHoliday.name = killMultiDay[1];
        }
        if (arrayNoDuplicates.indexOf(oneHoliday.name) === -1) {
            arrayNoDuplicates.push(oneHoliday.name);
        }
    });
    for (i = 0; i < arrayNoDuplicates.length; i++) {
        $('.js-holiday-results').append(`<a href='https://www.google.fi/search?q=${arrayNoDuplicates[i]}' target='_blank'>${arrayNoDuplicates[i]}</a><br>`);
    }
}

function getWeatherAPI(lat, long, country) {
    console.log("in getWeatherAPI");
    var query = {
        lat: lat,
        lon: long,
        APPID: 'cc21048cfb33fe1fa22a186dd7158b89'
    };
    var result = $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather",
            data: query,
            dataType: "jsonp",
            type: "GET"
        })
        //    const query = {
        //        lat: lat,
        //        lng: long,
        //        username: 'dsundland'
        //    };
        //    var result = $.ajax({
        //            url: WEATHERURL,  // FOR INFO ABOUT WEATHER RESULTS: //forum.geonames.org/gforum/posts/list/28.page
        //            data: query,
        //            dataType: "jsonp",
        //            type: "GET"
        //        })
        .done(function (result) {
            displayWeather(result, country); // *MARK* NEED TO MODIFY DISPLAYWEATHER WITH NEW RESULTS; CONVERT FROM KELVIN, ETC.
            //            console.log(result, result.main.humidity, result.main.temp, result.wind.deg, result.wind.speed, result.weather[0].description);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeather(data, country) {
    console.log(data, country);
    let windSpeed;
    let windTest;
    let temperature;
    //    let weatherCollectionDate;
    //    let weatherCollectionDateTime = new Date(data.weatherObservation.datetime + " UTC");
    //    let timeZone = /(\([A-Za-z\s]+\))/.exec(weatherCollectionDateTime.toString());
    //    if (timeZone === null) {
    //        timeZone = "";
    //    }
    //    let weatherCollectionTime = weatherCollectionDateTime.getHours() + ":" + weatherCollectionDateTime.getMinutes() + " " + timeZone[0]; // timeZone is returning an array, so get first element
    //    console.log("timeZone: ", timeZone, weatherCollectionTime);
    //    if (data.weatherObservation.weatherCondition === "n/a" && data.weatherObservation.clouds === "n/a") {
    //        data.weatherObservation.weatherCondition = "Clear skies";
    //    } else if (data.weatherObservation.weatherCondition === "n/a") {
    //        data.weatherObservation.weatherCondition = data.weatherObservation.clouds;
    //    }
    let sunrise = new Date(data.sys.sunrise);
    let sunriseTime = sunrise.toLocaleTimeString();
    let sunset = new Date(data.sys.sunset);
    let sunsetTime = sunset.toLocaleTimeString();
    let windDirection = degreesToCardinal(Number(data.wind.deg));
    if (country === 'us' || country === 'US' || country === 'gb' || country === 'GB') {
        windTest = Math.round(Number(data.wind.speed) * .621);
        if (windTest === 0) {
            windDirection = "";
            windSpeed = "No wind";
        } else {
            windSpeed = windTest.toString() + " mph";
        }
    } else {
        windTest = Math.round(Number(data.wind.speed));
        if (windTest === 0) {
            windDirection = "";
            windSpeed = "No wind";
        } else {
            windSpeed = windTest.toString() + " kph";
        }
    }
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(data.main.temp - 273.15) * 9 / 5 + 32)).toString() + "°F";
        //        weatherCollectionDate = MonthNames[weatherCollectionDateTime.getMonth()] + " " + weatherCollectionDateTime.getDate;
    } else {
        temperature = (Math.round(Number(data.main.temp) - 273.15)).toString() + "°C";
        //        weatherCollectionDate = weatherCollectionDateTime.getDate + " " + MonthNames[weatherCollectionDateTime.getMonth()];
    }
    $("#weather").html(`
        <div class="weather">
            <div id="tempBox" class="col-5">
                <span id="temperature">${temperature}</span>
            </div>
            <div class="mainInfo col-7">
                <p>${titleCase(data.weather[0].description)}</p>
                <p>Wind ${windSpeed} from the ${windDirection}.</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Sunrise: ${sunriseTime}</p>
                <p>Sunset: ${sunsetTime}</p>
            </div>
        </div>
        `);
    //    $("#stationName").html(data.weatherObservation.stationName);
    //    $("#weatherDateTime").html(weatherCollectionTime);
}


function degreesToCardinal(windDir) {
    if (windDir >= 348.75 || windDir <= 11.25) {
        return "north";
    } else if (windDir <= 33.75) {
        return "NNE";
    } else if (windDir <= 56.25) {
        return "NE";
    } else if (windDir <= 78.75) {
        return "ENE";
    } else if (windDir <= 101.25) {
        return "east";
    } else if (windDir <= 123.75) {
        return "ESE";
    } else if (windDir <= 146.25) {
        return "SE";
    } else if (windDir <= 168.75) {
        return "SSE";
    } else if (windDir <= 191.25) {
        return "south";
    } else if (windDir <= 213.75) {
        return "SSW";
    } else if (windDir <= 236.25) {
        return "SW";
    } else if (windDir <= 258.75) {
        return "WSW";
    } else if (windDir <= 281.25) {
        return "west";
    } else if (windDir <= 303.75) {
        return "WNW";
    } else if (windDir <= 326.25) {
        return "NW";
    } else {
        return "NNW";
    }
}

function getWeatherForecastApi(lat, long, country) {
    var query = {
        lat: lat,
        lon: long,
        APPID: 'cc21048cfb33fe1fa22a186dd7158b89'
    };
    var result = $.ajax({
            url: WEATHERFORECASTURL,
            data: query,
            dataType: "jsonp",
            type: "GET"
        })
        .done(function (result) {
            displayWeatherForecast(result, country);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeatherForecast(data, country) {
    const results = data.list.map((item, index) => renderWeatherForecast(item, country));
    $("#forecast").html("");
    for (i = 0; i < results.length; i++) {
        if (results[i] !== undefined) {
            $("#forecast").append(results[i]);
        }
        //        console.log(results[i]);
    }
}

function renderWeatherForecast(result, country) {
    let temperature;
    let weatherDate;
    let weatherTime;
    let today = new Date();
    let weatherDateTime = new Date(result.dt_txt + " UTC");
    if (weatherDateTime.getHours() === 1 || weatherDateTime.getHours() === 4 || weatherDateTime.getHours() === 10 || weatherDateTime.getHours() === 16 || weatherDateTime.getHours() === 22) {
        return; // skip unwanted values; return undefined
    } else if (weatherDateTime.getHours() === 7) {
        weatherTime = "morn";
    } else if (weatherDateTime.getHours() === 13) {
        weatherTime = "noon";
    } else {
        weatherTime = "eve";
    }
    //    let weatherTime = weatherDateTime.getHours() + ":" + weatherDateTime.getMinutes();
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(result.main.temp - 273.15) * 9 / 5 + 32)).toString() + "°F";
        //        weatherDate = MonthNames[weatherDateTime.getMonth()] + " " + weatherDateTime.getDate();
    } else {
        temperature = (Math.round(Number(result.main.temp) - 273.15)).toString() + "°C";
        //        weatherDate = weatherDateTime.getDate() + " " + MonthNames[weatherDateTime.getMonth()];
    }
    if (weatherDateTime.getDate() === today.getDate()) { // Don't need to compare full date, because forecast is only for next 5 days
        weatherDate = "Today,";
    } else if (weatherDateTime.getDate() === today.getDate() + 1) {
        weatherDate = "Tomorrow";
    } else {
        weatherDate = weatherDateTime.toLocaleDateString() + ",";
    }
    //    let weatherTimeLong = weatherDateTime.toLocaleTimeString();
    //    let timeParts = weatherTimeLong.split(":");
    //    let weatherTime;
    //    if (weatherTimeLong.indexOf("M") === -1) { // if the time does not include "AM" or "PM"
    //        weatherTime = timeParts[0] + timeParts[1]; // get rid of secons
    //    } else {
    //
    //        weatherTime = timeParts[0] + ":" + timeParts[1] + timeParts[2].split(' ')[1] // Get rid of seconds, but keep AM or PM
    //    }
    let description = result["weather"]["0"]["description"];
    let returnHtml = `${weatherDate} ${weatherTime} - ${temperature}, ${description}<br>`;
    return returnHtml;
}

$(getNews("", newsSources, "News"));
$(getNews("", sportsSources, "Sports"));
$(getNews("", entertainmentSources, "Entertainment"));
$(getNews("", financialSources, "Financial"));
$(getPlaceBased);
$(querySubmit);
$(seeMore);
$(getLatLongFromAddress);
