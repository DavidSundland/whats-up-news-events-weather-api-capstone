// TO-DO:  GET RID OF UNNECESSARY PUSH.  CLEAN UP DATES.  CONSOLIDATE FUNCTIONS.  FURTHER CLEAN-UP OF EVENTFUL* (INCLUDING DOING SOMETHING WITH 'NULL' RESULTS, POSSIBLY SKIPPING CRAP RESULTS, AND ADJUSTING NUMBER OF RESULTS).  MAKE SURE "net::ERR_CONNECTION_TIMED_OUT" IS NOT A CONTINUING PROBLEM. REARRANGE PAGE ORDER.
// *EVENTFUL NOTE - EVENTS DO HAVE UNIQUE ID AND URL.  COULD RUN WITH 4 MILE (OR WHATEVER) DISTANCE, SEE IF THERE ARE ENOUGH RESULTS, AND IF NOT, RUN AGAIN, AVOIDING REDUNCANCIES LIKE IN DC SCRAPING....
// EVENTFUL - IF DESCRIPTION AND TITLE NULL (OR REDUNDANT), IMMEDIATELY RETURN, WITH A VALUE LIKE 'SKIP' FOR EASY CULLING LATER





// JavaScript file for Thinkful Capstone 1

// https://www.w3schools.com/jsref/prop_win_innerheight.asp - BROWSER WINDOW WIDTH

const NEWSURL = 'https://newsapi.org/v2/everything';
const NEWSAPI = '5fbeb324e35042e09cc7df22185fe8e6';
const EVENTFULURL = 'http://api.eventful.com/json/events/search';
const HOLIDAYURL = 'https://holidayapi.com/v1/holidays';
const WEATHERURL = 'http://api.geonames.org/findNearByWeatherJSON';
const WEATHERFORECASTURL = 'http://api.openweathermap.org/data/2.5/forecast';
const MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHNAMES = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

function getDate(country) {
    let today = new Date();
    let headingDate;
    if (country === 'us' || country === 'US') {
        headingDate = MONTHNAMES[today.getMonth()] + " " + today.getDate().toString() + ", " + today.getFullYear();
    } else {
        headingDate = today.getDate().toString() + " " + MONTHNAMES[today.getMonth()] + " " + today.getFullYear();
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

function getLatLongFromAddress() { // UPDATE FUNCTION TO BE PROMPTED FROM USER ENTRY AND COLLECT INFORMATION FROM WEB PAGE **********************************
    var geocoder = new google.maps.Geocoder();
    var address = "3645 13th st nw washington dc";

    geocoder.geocode({
        'address': address
    }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            alert("Lat: " + latitude + ", Long: " + longitude);
        }
    });
}

function getNews() {
    //    console.log("In getNewsApi");
    let searchTerm = ''; // Don't need to have a search term; may consider creating one... (users will have option of entering one)
    let today = new Date();
    let endDate = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString(); // getMonth returns month value from 0 to 11...
    let before = new Date(today);
    let beforeDifference = 0; // TEST PAGE WITH RESULTS FROM TODAY ONLY; IF NOT ENOUGH RESULTS, CHANGE INCREMENT
    before.setDate(today.getDate() - beforeDifference);
    let startDate = before.getFullYear().toString() + '-' + (before.getMonth() + 1).toString() + '-' + before.getDate().toString();
    let newsSources = 'the-washington-post,associated-press,al-jazeera-english,bbc-news,the-new-york-times,politico,the-economist';
    let numNewsArts = 3;
    getTheNews(newsSources, searchTerm, startDate, endDate, "News", numNewsArts);
    let sportsSources = 'talksport,bleacher-report,nfl-news,nhl-news,the-sport-bible';
    let numSportsArts = 2;
    getTheNews(sportsSources, searchTerm, startDate, endDate, "Sports", numSportsArts);
    let entertainmentSources = 'entertainment-weekly,mtv-news';
    let numEntertainmentArts = 2;
    getTheNews(entertainmentSources, searchTerm, startDate, endDate, "Entertainment", numEntertainmentArts);
    let financialSources = 'financial-post,financial-times,fortune,business-insider';
    let numFinancialArts = 2;
    getTheNews(financialSources, searchTerm, startDate, endDate, "Financial", numFinancialArts);
}

function getTheNews(sources, searchTerm, startDate, endDate, section, numArts) {
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
            $('.' + section).html(`<h2>${section}</h2>`);
            for (i = 0; i < numArts; i++) {
                $('.' + section).append(results[i][0]);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//function displayNews(data) {
//    console.log("In displayNews");
//    console.log(data);
//    const results = data.articles.map((item, index) => renderNews(item));
//    console.log("News Results:", results);
//}

function renderNews(result, section) {
    //    console.log("In renderNews");
    let returnArray = [];
    if (result["author"] === null) {
        result["author"] = result["source"]["name"];
    }
    result["author"] = titleCase(result["author"]); // A lot of author names are all caps; correct that offense.
    returnArray.push(`<div class="row"><div class="col-5"><img src='${result["urlToImage"]}'></div><div class="col-7"><span class="title"><a href='${result["url"]}' target='_blank'>${result["title"]}</a></span>, by <span class="author">${result["author"]}</span?>. <span class="description">${result["description"]}.</span>`); // AVAILABLE INFO INCLUDES:  (author), description, (publishedAt (time)), (source[id]), source[name] (publication name), url, urlToImage
    return returnArray;
}

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
    let eventfulDate = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString() + "00"; // getMonth returns month value from 0 to 11...
    eventfulDate = eventfulDate + '-' + eventfulDate; // eventful date range format is:  YYYYMMDD00-YYYYMMDD00
    let distance = 4; // Initial search distance for Eventful (4 miles - a reasonable distance for a big city)
    let counter = 1;
    let maxCount = 6; // Maximum number of times to run testEventfulApi
    distance = testEventfulApi(userLat, userLong, distance, eventfulDate, counter, maxCount);
    getEventfulApi(userLat, userLong, distance, eventfulDate);
    //    $.getJSON // Get the user's country code; use that to pull holidays & determine whether to use metric or outdated measurements for weather
    //    (
    //        'http://ws.geonames.org/countryCode', {
    //            lat: userLat,
    //            lng: userLong,
    //            username: 'dsundland',
    //            type: 'JSON'
    //        },
    //        function (result) {
    //            getHolidaysApi(result.countryCode)
    //            getDate(result.countryCode);
    //            getWeatherAPI(userLat, userLong, result.countryCode); // http://api.geonames.org/findNearByWeatherJSON?lat=43&lng=-2&username=demo
    //            getWeatherForecastApi(userLat, userLong, result.countryCode);
    //        }
    //    );
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& &&&&&&&&&&&&&&&&&&&&&&&&& &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& &&&&&&&&&&&&&&&&&&&&&&&&&&&&& DON'T FORGET TO REINSTATE ABOVE CODE!!!!!!!!!!!!!!!!!!!!!!! #################################### ##############################################################################################################################################################################
}

function testEventfulApi(lat, long, distance, eventDate, counter, maxCount) { // Since Eventful might not pull many results within 4 miles, test to determine necessary distance
    let query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        location: lat + ',' + long,
        //        location: "39.597462" + ',' + "-111.439893",  // FOR TESTING - LOCATION IN REMOTE PART OF UTAH
        //        keywords: 'happiness',
        date: eventDate, // Could be This%20Week, Future, Today, or date in form YYYYMMDD00-YYYYMMDD00
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

function getEventfulApi(lat, long, distance, eventDate) {
    //    console.log("In getEventfulApi, eventDate = ", eventDate);
    var query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        // keywords: 'concert',  // Filter events, or just return all?  Can have user enter keyword... (Keyword is optional.)
        location: lat + ',' + long,
        date: eventDate, // Could be This%20Week, Future, Today, or date in form YYYYMMDD00-YYYYMMDD00
        page_size: 5,
        // page_number: 2,  // Can get additional results by iterating page_number
        ex_category: 'other,sales,business',
        sort_order: 'date',
        sort_direction: 'descending',
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
    //    console.log(results);
    for (i = 0; i < results.length; i++) {
        $('#events').append(results[i]);
    }
} // ############################################################## ############################################################# ####################################################### ############################### ########################################################################## DON'T FORGET TO MODIFY FUNCTIONS TO SKIP THE WHOLLY UNNECESSARY 'PUSH' BIT ####################################################################### ########################### ######################################################################################## ###################################################################################

function renderEventful(result) {
    //    console.log("In renderEventful");
    //    let returnArray = [];
    let maxDescription = 200;
    let maxTitle = 150;
    let killSpaces;
    if (result["title"] === null) {
        maxDescription += 50; // If there is no title, allow longer description
    }
    if (result["description"] === null) { // ****************************** IF TITLE AND DESCRIPTION NULL, SKIP? IF ONE NULL, REPLACE WITH "".  IF DESC BUT NO TITLE, SKIP, OR SWAP TITLE W/ DESC?
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
    //    let returnHtml = `<p>TITLE: ${result["title"]}. DESCRIPTION: ${result["description"]}. VENUE URL: ${result["venue_url"]}. VENUE NAME: ${result["venue_name"]}. START TIME: ${result["start_time"]}</p><hr>`;
    //    console.log(returnHtml);
    //    return returnHtml;
    return `<p><a href='${result.url}' target='_blank'>${result.title}</a>. ${result.description} At ${result.venue_name} - ${result.venue_address}, ${result.city_name}, ${result.region_abbr}.  Start time: ${time}. Date: ${date}.`;
    //    return returnArray;
}

function getHolidaysApi(countryCode) {
    //    console.log("In getHolidaysApi");
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
            //            console.log("done result = ", result);
            displayHolidays(result);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log("jqXHR:", jqXHR);
            console.log("error:", error);
            console.log("errorThrown:", errorThrown);
        });
}

function displayHolidays(data) {
    //    console.log("In displayHolidays");
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
        // I am not listing dates, since free API cannot be used for upcoming holidays.  So I am linking to a Google search for the holiday name.
    }
}

function getWeatherAPI(lat, long, country) {
    //    console.log("In getWeatherAPI");
    const query = {
        lat: lat,
        lng: long,
        username: 'dsundland'
    };
    var result = $.ajax({
            url: WEATHERURL,
            data: query,
            dataType: "jsonp",
            type: "GET"
        })
        .done(function (result) {
            //            console.log("done result = ", result);
            displayWeather(result, country);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeather(data, country) // FOR INFO ABOUT WEATHER RESULTS: http://forum.geonames.org/gforum/posts/list/28.page
{
    //    console.log("In displayWeather");
    //    console.log(data);
    let windSpeed;
    let windDirection;
    let temperature;
    let weatherCollectionDate;
    let weatherCollectionDateTime = new Date(data.weatherObservation.datetime + " UTC");
    let timeZone = /(\([A-Za-z\s]+\))/.exec(weatherCollectionDateTime.toString());
    if (timeZone === null) {
        timeZone = "";
    }
    let weatherCollectionTime = weatherCollectionDateTime.getHours() + ":" + weatherCollectionDateTime.getMinutes() + " " + timeZone[0]; // timeZone is returning an array, so get first element
    console.log("timeZone: ", timeZone, weatherCollectionTime);
    if (data.weatherObservation.weatherCondition === "n/a" && data.weatherObservation.clouds === "n/a") {
        data.weatherObservation.weatherCondition = "Clear skies";
    } else if (data.weatherObservation.weatherCondition === "n/a") {
        data.weatherObservation.weatherCondition = data.weatherObservation.clouds;
    }
    if (data.weatherObservation.windSpeed === "00") {
        windDirection = "";
        windSpeed = "No wind";
    } else {
        windDirection = degreesToCardinal(Number(data.weatherObservation.windDirection));
        if (country === 'us' || country === 'US' || country === 'gb' || country === 'GB') {
            windSpeed = (Math.round(Number(data.weatherObservation.windSpeed) * .621)).toString() + " mph from the ";
        } else {
            windSpeed = data.weatherObservation.windSpeed + " kph from the ";
        }
    }
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(data.weatherObservation.temperature) * 9 / 5) + 32).toString() + " °F";
        weatherCollectionDate = MonthNames[weatherCollectionDateTime.getMonth()] + " " + weatherCollectionDateTime.getDate;
    } else {
        temperature = data.weatherObservation.temperature + " °C";
        weatherCollectionDate = weatherCollectionDateTime.getDate + " " + MonthNames[weatherCollectionDateTime.getMonth()];
    }
    console.log("data.weatherObservation.temperature: ", data.weatherObservation.temperature, "temperature", temperature, "data.weatherObservation.windSpeed", data.weatherObservation.windSpeed, "windSpeed", windSpeed);
    $("#weather").html(`<div id="tempBox" class="col-4"><span id="temperature">${temperature}</span></div><div class="col-8"><p id="weatherCondition">${titleCase(data.weatherObservation.weatherCondition)}</p><p>Wind <span id="windSpeed">${windSpeed}</span> from the <span id="windDirection">${windDirection}</span>.</p><p>Humidity: ${data.weatherObservation.humidity}%</p></div>`);
    $("#stationName").html(data.weatherObservation.stationName);
    $("#weatherDateTime").html(weatherCollectionTime);
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
    //    console.log("In getWeatherForecastApi");
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
            //            console.log("done result = ", result);
            displayWeatherForecast(result, country);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeatherForecast(data, country) {
    //    console.log("In displayWeatherForecast");
    //    console.log(data);
    const results = data.list.map((item, index) => renderWeatherForecast(item, country));
    //    console.log("Forecast results:", results);
    //    $('.' + section).html(`<h2>${section}</h2>`);
    $("#forecast").html("");
    for (i = 0; i < results.length; i++) {
        $("#forecast").append(results[i][0]);
    }
}

function renderWeatherForecast(result, country) {
    //    console.log("In renderWeatherForecast");
    let returnArray = [];
    let temperature;
    let weatherDate;
    let weatherDateTime = new Date(result.dt_txt + " UTC");
    let weatherTime = weatherDateTime.getHours() + ":" + weatherDateTime.getMinutes();
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(result.main.temp - 273.15) * 9 / 5 + 32)).toString() + " °F";
        weatherDate = MonthNames[weatherDateTime.getMonth()] + " " + weatherDateTime.getDate();
    } else {
        temperature = (Math.round(Number(result.main.temp) - 273.15)).toString() + " °C";
        weatherDate = weatherDateTime.getDate() + " " + MonthNames[weatherDateTime.getMonth()];
    }
    weatherDate = weatherDateTime.toLocaleDateString();
    weatherTime = weatherDateTime.toLocaleTimeString();
    let description = result["weather"]["0"]["description"];
    //    console.log("WHAT IS GOING ON WITH WEATHER DATE?", weatherDate, "###", MonthNames[weatherDateTime.getMonth()], "###", weatherDateTime.getMonth(), "###", weatherDateTime.getDate);
    returnArray.push(`<p>${weatherDate} at ${weatherTime}: ${temperature} with ${description}</p>`);
    // console.log("renderWeatherForecast Array: ", returnArray);
    return returnArray;
}

$(getNews);
$(getPlaceBased);
$(getLatLongFromAddress);
