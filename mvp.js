// JavaScript file for Thinkful Capstone 1

// *EVENTFUL NOTE - EVENTS DO HAVE UNIQUE ID AND URL.  COULD RUN WITH 4 MILE (OR WHATEVER) DISTANCE, SEE IF THERE ARE ENOUGH RESULTS, AND IF NOT, RUN AGAIN, AVOIDING REDUNCANCIES LIKE IN DC SCRAPING....

// git add . ; git commit -m 'REPLACE-ME'; git pull origin master; git push --set-upstream origin master
// https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/

// file:///C:/Python27/MyPrograms/JavaScriptClass/DavidSundland/BrowserWidth.html

const NEWSURL = 'https://newsapi.org/v2/everything';
const NEWSAPI = '5fbeb324e35042e09cc7df22185fe8e6';
const EVENTFULURL = 'https://api.eventful.com/json/events/search';
const HOLIDAYURL = 'http://holidayapi.com/v1/holidays'; // NOT AVAILABLE AS HTTPS, UNFORTUNATELY
const WEATHERURL = 'https://api.geonames.org/findNearByWeatherJSON';
const WEATHERFORECASTURL = 'https://api.openweathermap.org/data/2.5/forecast';
const MonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let newsSources = 'the-washington-post,associated-press,al-jazeera-english,bbc-news,the-new-york-times,politico,the-economist';
let sportsSources = 'talksport,bleacher-report,nfl-news,nhl-news,the-sport-bible';
let entertainmentSources = 'entertainment-weekly,mtv-news';
let financialSources = 'financial-post,financial-times,fortune,business-insider';
//let GLOBALLAT = "38.89";
//let GLOBALLONG = "-77.034";
let TODAY = new Date();


function getDate(country) { // Displays today's date in header
    let headingDate;
    if (country === 'us' || country === 'US') {
        headingDate = MonthNames[TODAY.getMonth()] + " " + TODAY.getDate().toString() + ", " + TODAY.getFullYear();
    } else {
        headingDate = TODAY.getDate().toString() + " " + MonthNames[TODAY.getMonth()] + " " + TODAY.getFullYear();
    }
    $('.insert-date').html(headingDate);
    $('.insert-month').html(MonthNames[TODAY.getMonth()]);
}

function titleCase(str) { // Capitalize first letter in every word of a string, make all others lowercase
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

function textCleanup(text, maxLength) {
    text.replace(/\<p\>/g, " ").replace(/\<\/p\>/g, " ").replace(/\<br\>/g, "").replace(/\<hr\>/g, "").replace(/\<b\>/g, "").replace(/\<\/b\>/g, "").replace(/\<strong\>/g, "").replace(/\<\/strong\>/g, ""); // Remove HTML tags that are commonly found within results
    text.replace(/\_+/g, '_ ').replace(/[\_\s]+/g, '_ ').replace(/\-/g, '- ').replace(/[\-\s]/g, '- ').replace(/\s+/g, ' '); // Remove abusive use of underscores, hyphens, & white space
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + "..."; // shorten excessive descriptions
    }
    killSpaces = text.replace(/\s/g, ''); // Create copy of text w/ no white space...
    if (/[A-Z]{10,}/.exec(killSpaces)) // If result has 10 or more capital letters in a row, let's eliminate that ALL CAPS abuse
    {
        text = sentenceCase(text);
    }
    return text;
}

function getLatLongFromAddress() {
    var geocoder = new google.maps.Geocoder();
    let address;
    $('.newLocation').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        address = queryTarget.val();
        queryTarget.val(""); // clear out the input
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                getPlaceBased.lat = results[0].geometry.location.lat();
                getPlaceBased.lon = results[0].geometry.location.lng();
                $(".newLocation input").attr("placeholder", titleCase(address) + " submitted"); // Put address in search box as placeholder so search term is shown on page
                callWeather(getPlaceBased.lat, getPlaceBased.lon);
                callEvents(getPlaceBased.lat, getPlaceBased.lon, "");
            } else {
                alert("Uh-oh, Google did not like the address which you submitted!");
                $(".newLocation input").attr("placeholder", "Type a new location to snap");
            }
        });
    });
}

function querySubmit() { // For search term entered for any news feed
    $('.newsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".newsSearchForm input").attr("placeholder", titleCase(searchTerm) + " submitted");
        getNews(searchTerm, newsSources, "News", "relevancy", "first");
    });
    $('.sportsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".sportsSearchForm input").attr("placeholder", titleCase(searchTerm) + " submitted");
        getNews(searchTerm, sportsSources, "Sports", "relevancy", "first");
    });
    $('.entertainmentSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".entertainmentSearchForm input").attr("placeholder", titleCase(searchTerm) + " submitted");
        getNews(searchTerm, entertainmentSources, "Entertainment", "relevancy", "first");
    });
    $('.financialSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".financialSearchForm input").attr("placeholder", titleCase(searchTerm) + " submitted");
        getNews(searchTerm, financialSources, "Financial", "relevancy", "first");
    });
    $('.eventsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        eventfulQuery = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".events").html("Please wait a moment as the list of events is collected and tidied up.");
        $(".eventsSearchForm input").attr("placeholder", titleCase(eventfulQuery) + " submitted");
        callEvents(getPlaceBased.lat, getPlaceBased.lon, eventfulQuery);
    });
}

function seeMore() {
    $("#moreNews").click(function () {
        $(".News").toggleClass("seeMore");
        if ($("#moreNews").html() === "Scroll News") {
            $("#moreNews").html("Remove Scrolling");
        } else {
            $(".News").animate({
                scrollTop: $('#NewsTop')
            });
            $("#moreNews").html("Scroll News");
        }
    });
    $("#moreSports").click(function () {
        $(".Sports").toggleClass("seeMore");
        if ($("#moreSports").html() === "Scroll Sports") {
            $("#moreSports").html("Remove Scrolling");
        } else {
            $(".Sports").animate({
                scrollTop: $('#SportsTop')
            });
            $("#moreSports").html("Scroll Sports");
        }
    });
    $("#moreEntertainment").click(function () {
        $(".Entertainment").toggleClass("seeMore");
        if ($("#moreEntertainment").html() === "Scroll Entertainment") {
            $("#moreEntertainment").html("Remove Scrolling");
        } else {
            $(".Entertainment").animate({
                scrollTop: $('#EntertainmentTop')
            });
            $("#moreEntertainment").html("Scroll Entertainment");
        }
    });
    $("#moreFinancial").click(function () {
        $(".Financial").toggleClass("seeMore");
        if ($("#moreFinancial").html() === "Scroll Financial") {
            $("#moreFinancial").html("Remove Scrolling");
        } else {
            $(".Financial").animate({
                scrollTop: $('#FinancialTop')
            });
            $("#moreFinancial").html("Scroll Financial");
        }
    });
    $("#moreWeather").click(function () {
        $(".mainInfo").toggleClass("seeMore");
        if ($("#moreWeather").html() === "Scroll Weather") {
            $("#moreWeather").html("Remove Scrolling");
        } else {
            $("#moreWeather").html("Scroll Weather");
        }
    });
    $("#moreForecast").click(function () {
        $(".forecast").toggleClass("seeMore");
        if ($("#moreForecast").html() === "Scroll Forecast") {
            $("#moreForecast").html("Remove Scrolling");
        } else {
            $("#moreForecast").html("Scroll Forecast");
        }
    });
    $("#moreEvents").click(function () {
        $(".events").toggleClass("seeMore");
        if ($("#moreEvents").html() === "Scroll Events") {
            $("#moreEvents").html("Remove Scrolling");
        } else {
            $(".events").animate({
                scrollTop: $('#eventsTop')
            });
            $("#moreEvents").html("Scroll Events");
        }
    });
    $('.News').on('click', '#NewsNext', function () {
        $(".News").animate({
            scrollTop: $('#NewsTop')
        });
        getNews("", newsSources, "News", "", "next");
    });
    $('.Sports').on('click', '#SportsNext', function () {
        $(".Sports").animate({
            scrollTop: $('#SportsTop')
        });
        getNews("", sportsSources, "Sports", "", "next");
    });
    $('.Entertainment').on('click', '#EntertainmentNext', function () {
        $(".Entertainment").animate({
            scrollTop: $('#EntertainmentTop')
        });
        getNews("", entertainmentSources, "Entertainment", "", "next");
    });
    $('.Financial').on('click', '#FinancialNext', function () {
        $(".Financial").animate({
            scrollTop: $('#NewsTop')
        });
        getNews("", financialSources, "Financial", "", "next");
    });
    $('.News').on('click', '#NewsPrev', function () {
        $(".News").animate({
            scrollTop: $('#NewsTop')
        });
        getNews("", newsSources, "News", "", "prev");
    });
    $('.Sports').on('click', '#SportsPrev', function () {
        $(".Sports").animate({
            scrollTop: $('#SportsTop')
        });
        getNews("", sportsSources, "Sports", "", "prev");
    });
    $('.Entertainment').on('click', '#EntertainmentPrev', function () {
        $(".Entertainment").animate({
            scrollTop: $('#EntertainmentTop')
        });
        getNews("", entertainmentSources, "Entertainment", "", "prev");
    });
    $('.Financial').on('click', '#FinancialPrev', function () {
        $(".Financial").animate({
            scrollTop: $('#NewsTop')
        });
        getNews("", financialSources, "Financial", "", "prev");
    });
    $('.events').on('click', '#eventsPrev', function () {
        $(".events").html("Please wait as the information is collected and tidied.");
        getEventfulApi(getPlaceBased.lat, getPlaceBased.lon, callEvents.distance, callEvents.startDate, callEvents.endDate, "", "prev");
    });
    $('.events').on('click', '#eventsNext', function () {
        $(".events").html("Please wait as the information is collected and tidied.");
        getEventfulApi(getPlaceBased.lat, getPlaceBased.lon, callEvents.distance, callEvents.startDate, callEvents.endDate, "", "next");
    });
}

function getNews(searchTerm, sources, category, sortBy, call) {
    let endDate = TODAY.getFullYear().toString() + '-' + (TODAY.getMonth() + 1).toString() + '-' + TODAY.getDate().toString(); // getMonth returns month value from 0 to 11...
    let before = new Date(TODAY);
    let beforeDifference = 0; // Results from today only (future update of app could have option for multiple days)
    before.setDate(TODAY.getDate() - beforeDifference);
    let startDate = before.getFullYear().toString() + '-' + (before.getMonth() + 1).toString() + '-' + before.getDate().toString();
    getTheNews(sources, searchTerm, startDate, endDate, category, sortBy, call);
}

function getTheNews(sources, searchTerm, startDate, endDate, section, sortBy, call) { // Documentation - https://newsapi.org/docs
    if (getTheNews.pageNumber === undefined) { // if undefined, then first time function has been run
        getTheNews.pageNumber = 1;
        getTheNews.newsQuery = "";
        getTheNews.sportsQuery = "";
        getTheNews.financialQuery = "";
        getTheNews.entertainmentQuery = "";
        getTheNews.newsSort = "popularity";
        getTheNews.sportsSort = "popularity";
        getTheNews.financialSort = "popularity";
        getTheNews.entertainmentSort = "popularity";
    } else if (call === "first") {
        getTheNews.pageNumber = 1;
    } else if (call === "next") {
        getTheNews.pageNumber++;
    } else {
        getTheNews.pageNumber--;
    }
    if (searchTerm === "") { // if function called w/o new search term, load previous search term, if any
        if (section === "News") {
            searchTerm = getTheNews.newsQuery;
        } else if (section === "Sports") {
            searchTerm = getTheNews.sportsQuery;
        } else if (section === "Financial") {
            searchTerm = getTheNews.financialQuery;
        } else {
            searchTerm = getTheNews.entertainmentQuery;
        }
    } else { // store the search term for future use
        if (section === "News") {
            getTheNews.newsQuery = searchTerm;
        } else if (section === "Sports") {
            getTheNews.sportsQuery = searchTerm;
        } else if (section === "Financial") {
            getTheNews.financialQuery = searchTerm;
        } else {
            getTheNews.entertainmentQuery = searchTerm;
        }
    }
    if (sortBy === "") { // load previous sort by term, if any
        if (section === "News") {
            sortBy = getTheNews.newsSort;
        } else if (section === "Sports") {
            sortBy = getTheNews.sportsSort;
        } else if (section === "Financial") {
            sortBy = getTheNews.financialSort;
        } else {
            sortBy = getTheNews.entertainmentSort;
        }
    } else { // store the sort by for future use
        if (section === "News") {
            getTheNews.newsSort = sortBy;
        } else if (section === "Sports") {
            getTheNews.sportsSort = sortBy;
        } else if (section === "Financial") {
            getTheNews.financialSort = sortBy;
        } else {
            getTheNews.entertainmentSort = sortBy;
        }
    }
    const query = {
        q: searchTerm,
        sources: sources,
        from: startDate,
        to: endDate,
        sortBy: sortBy,
        page: getTheNews.pageNumber,
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
            console.log(section, " result = ", result);
            //            runFunction(result);
            jumpName = section + "Top";
            const results = result.articles.map((item, index) => renderNews(item, section));
            $('.' + section).html(`<div class = "newsHeader" id = "${jumpName}"><h2>${section}</h2></div>`);
            if (results.length === 0) {
                $('.' + section).append(`<div class="row"><img src='https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/images/embarrassed.jpg?raw=true'><p class = "articleText">Well, this is embarrassing!  We found a grand total of zero (yes, zero!) results.  Sigh.</p></div>`);
            } else {
                for (i = 0; i < results.length; i++) {
                    if (results[i] !== undefined) {
                        $('.' + section).append(results[i]);
                    }
                }
            }
            if (result.totalResults > getTheNews.pageNumber * 20 && getTheNews.pageNumber === 1) { // 20 results are returned per page
                buttonId = section + 'Next';
                $('.' + section).append(`<div class="row"><span class = "next">More Results<button id="${buttonId}">Snap</button></span></div>`);
                //                console.log("In if, result.totalResults: ", result.totalResults, "page number: ", getTheNews.pageNumber, "button: ", buttonId);
            } else if (result.totalResults > getTheNews.pageNumber * 20) {
                buttonId = section + 'Next';
                buttonPrev = section + 'Prev';
                $('.' + section).append(`<div class="row"><span class = "prev"><button id="${buttonPrev}">Snap</button>Previous Results</span><span class = "next">More Results<button id="${buttonId}">Snap</button></span></div>`);
            } else if (getTheNews.pageNumber !== 1) {
                buttonPrev = section + 'Prev';
                $('.' + section).append(`<div class="row"><span class = "prev"><button id="${buttonPrev}">Snap</button>Previous Results</span>`);
            } // note - remaining possibility is 1st page but # results <= 20, in which case don't have prev or next button
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function renderNews(result, section) {
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
    result["urlToImage"] = result["urlToImage"].replace("http:", "https:"); // Pics from non-secure sites cause problems...
    // Return will include results AND default image if the API image causes problems (typically a security error)
    return `<div class="row"><img src='${result["urlToImage"]}' alt="Image not found" onerror="this.onerror=null;this.src='https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/images/image_not_found.jpg?raw=true';" /><p class = "articleText"><span class="title"><a href='${result["url"]}' target='_blank'>${result["title"]}</a></span>, by <span class="author">${result["author"]}</span>. ${result["description"]}</p></div>`;
}

function getPlaceBased() {
    if (getPlaceBased.lat === undefined) { // first time function run
        getPlaceBased.lat = "38.89"; // assign DC coords as default in case geoloc fails
        getPlaceBased.lon = "-77.034";
    }
    if (!navigator.geolocation) {
        console.log("in !navigator.geolocation");
        navNoGo();
        return;
    }

    function error() {
        console.log("in getPlaceBased error");
        navNoGo();
        return;
    }

    function success(position) {
        console.log("in getPlaceBased success");
        getPlaceBased.lat = position.coords.latitude;
        getPlaceBased.lon = position.coords.longitude;
        callWeather(getPlaceBased.lat, getPlaceBased.lon);
        callEvents(getPlaceBased.lat, getPlaceBased.lon, "");
    }
    console.log("about to run navigator");
    navigator.geolocation.getCurrentPosition(success, error, {
        timeout: 15000 // If don't succeed in getting position within 15 seconds, give up
    });
}

function navNoGo() {
    console.log("in navNoGo");
    alert("Uh-oh! We could not automatically determine your location, so place-based results are defaulting to Washingon, DC. You can manually enter a different location if you'd like.")
    console.log("Geolocation is not supported by this browser.");
    callEvents(getPlaceBased.lat, getPlaceBased.lon, "");
}

function callWeather(userLat, userLong) {
    try {
        $.getJSON // Get the user's country code; use that to determine whether to use metric or outdated measurements for weather (also had been used for holidays before security issues (non-https API) killed holidays functionality)
        (
            'https://maps.googleapis.com/maps/api/geocode/json', {
                latlng: userLat + "," + userLong,
                key: "AIzaSyAa9jFz1GClkj8pW9ytY6tB70hVFj1RGYQ",
                sensor: false
            },
            function (result) {
                //                console.log("Google attempt: ", result);
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

function callEvents(userLat, userLong, query) {
    callEvents.startDate = TODAY.getFullYear().toString() + (TODAY.getMonth() + 1).toString() + TODAY.getDate().toString() + "00"; // eventful date format is:  YYYYMMDD00
    callEvents.endDate = callEvents.startDate; // for this edition of app, only search for today
    callEvents.distance = 4; // Initial search distance for Eventful (4 miles - a reasonable distance for a big city)
    let test;
    getEventfulApi(userLat, userLong, callEvents.distance, callEvents.startDate, callEvents.endDate, query, "first");
}

function getEventfulApi(lat, long, distance, eventStartDate, eventEndDate, searchTerm, call) {
    console.log("In getEventfulApi.  Passed values: ", lat, long, distance, eventStartDate, eventEndDate, searchTerm, call);
    if (getEventfulApi.pageNumber === undefined) { // if undefined, then first time function has been run
        getEventfulApi.pageNumber = 1;
        getEventfulApi.query = "";
        getEventfulApi.counter = 1;
    } else if (call === "first") {
        getEventfulApi.pageNumber = 1;
    } else if (call === "next") {
        getEventfulApi.pageNumber++;
    } else {
        getEventfulApi.pageNumber--;
    }
    if (searchTerm === "") { // if function called w/o new search term, load previous search term, if any
        searchTerm = getEventfulApi.query;
    } else { // store the search term for future use
        getEventfulApi.query = searchTerm;
    }
    var query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        keywords: searchTerm,
        location: lat + ',' + long,
        date: eventStartDate + "-" + eventEndDate, // Could be This%20Week, Future, Today, or date in form YYYYMMDD00-YYYYMMDD00
        page_size: 20,
        page_number: getEventfulApi.pageNumber,
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
            console.log("getEventfulApi done result = ", result, "result number = ", Number(result.total_items));
            if (Number(result.total_items) < 5 && getEventfulApi.counter <= 4) {
                distance *= 3;
                getEventfulApi.counter++;
                $(".events").append("."); // show that computer is working
                getEventfulApi(lat, long, distance, eventStartDate, eventEndDate, searchTerm, call) // try again w/ bigger distance
            } else {
                getEventfulApi.counter = 1;
                $(".events").append("."); // show that computer is working
                callEvents.distance = distance; // store value used for next/prev queries
                displayEventful(result, getEventfulApi.pageNumber);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayEventful(data, pageNumber) {
    console.log("In displayEventful.  Data received:", data);
    if (data.total_items === "0") {
        $('.events').html(`<p>Don't you hate it when absolutely nothing is happening?  We found no Eventful events (none!) within 128 miles of your location today.</p>`);
    } else {
        const results = data.events.event.map((item, index) => renderEventful(item));
        $('.events').html("<span id = 'eventsTop'></span>"); // clear out old results, if applicable. Add a target for animated scrolling.
        //    console.log(results);
        for (i = results.length - 1; i >= 0; i--) { // run events loop backwards, since stored in reverse chrono order
            if (results[i] !== undefined) { // renderEventful will run an empty return if events are of too poor quality
                if (i % 2 === 0) { // alternate classes so that background colors can alternate
                    $('.events').append(`<p class = "even">${results[i]}</p>`);
                } else {
                    $('.events').append(`<p class = "odd">${results[i]}</p>`);
                }
            }
        }
        //    console.log("About to if.  total_items: ", data.total_items, "total items alternative: ", data.events.total_items);
        if (Number(data.page_count) > pageNumber && pageNumber === 1) {
            $('.events').append('<div class="row"><span class = "next">More Results<button id="eventsNext">Snap</button></span></div>');
            console.log("In if");
        } else if (Number(data.page_count) > pageNumber) {
            $('.events').append('<div class="row"><span class = "prev"><button id="eventsPrev">Snap</button>Previous Results</span><span class = "next">More Results<button id="eventsNext">Snap</button></span></div>');
        } else if (pageNumber !== 1) {
            $('.events').append('<div class="row"><span class = "prev"><button id="eventsPrev">Snap</button>Previous Results</span></div>');
        } // note - remaining possibility is 1st page but # results <= 20, in which case don't have prev or next button
    }
}

function renderEventful(result) {
    //    console.log("In renderEventful", result);
    if ((result["title"] === null || result["title"].length < 5) && (result["description"] === null || result["description"].length < 5)) {
        return; // if there is no title or description, or if both are preposterously short, return with no value (skip the event)
    }
    $(".events").append("."); // show that computer is working
    let maxDescription = 200;
    let maxTitle = 150;
    let killSpaces;
    if (result["title"] === null) {
        maxDescription += 50; // If there is no title, allow longer description
    }
    if (result["description"] === null) {
        maxTitle += 50; // If there is no description, allow longer title
        result["description"] = "";
    } else {
        //        console.log("in renderEventful description else, result['description'] = ", result["description"]);
        result["description"] = textCleanup(result["description"], maxDescription);
    }
    if (result["title"] !== null) {
        result["title"] = textCleanup(result["title"], maxTitle);
    }
    let dateTime = new Date(result.start_time);
    let date = dateTime.toLocaleDateString();
    let time = dateTime.toLocaleTimeString();
    //    console.log("venue name: ", result.venue_name, "venue address: ", result.venue_address);
    return `<a href='${result.url}' target='_blank'>${result.title}</a>. ${result.description} At ${result.venue_name} - ${result.venue_address}, ${result.city_name}, ${result.region_abbr}.  Start time: ${time}. Date: ${date}.`;
}

function getHolidaysApi(countryCode) { // CAN'T USE?  API NOT SECURE
    console.log("in getHolidaysApi");
    var month = TODAY.getMonth() + 1; // getMonth returns month value from 0 to 11; Holidays API expects values from 1 to 12
    var year = TODAY.getFullYear() - 1; // NOTE - must pay to get current and future holidays; past holidays are free
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

//function displayHolidays(data) { // Can't use at this point - API not secure
//    console.log("in displayHolidays");
//    let killMultiDay;
//    let arrayNoDuplicates = []; // For multi-day holidays, Holiday API lists same holiday multiple times. Eliminate duplicates.
//    data.holidays.forEach(function (oneHoliday) {
//        killMultiDay = /[a-zA-Z]+\s+[Dd]ay\s+of\s+([a-zA-Z]+)/.exec(oneHoliday.name); // Use RegEx to eliminate multiple instances of holiday (First Day of..., etc.)
//        if (killMultiDay !== null) {
//            oneHoliday.name = killMultiDay[1];
//        }
//        if (arrayNoDuplicates.indexOf(oneHoliday.name) === -1) {
//            arrayNoDuplicates.push(oneHoliday.name);
//        }
//    });
//    for (i = 0; i < arrayNoDuplicates.length; i++) {
//        $('.js-holiday-results').append(`<a href='https://www.google.fi/search?q=${arrayNoDuplicates[i]}' target='_blank'>${arrayNoDuplicates[i]}</a><br>`);
//    }
//}

function getWeatherAPI(lat, long, country) {
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
        .done(function (result) {
            displayWeather(result, country);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeather(data, country) {
    let windSpeed;
    let windTest;
    let temperature;
    let sunrise = new Date(data.sys.sunrise * 1000);
    let sunriseTime = sunrise.toLocaleTimeString();
    let sunset = new Date(data.sys.sunset * 1000);
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
    } else {
        temperature = (Math.round(Number(data.main.temp) - 273.15)).toString() + "°C";
    }
    $("#weather").html(`
        <div class="weather">
            <div id="tempBox" class="col-5">
                <span id="temperature">${temperature}</span>
            </div>
            <div class="mainInfo col-7">
                ${titleCase(data.weather[0].description)}<br>
Wind ${windSpeed} from the ${windDirection}.<br>
Humidity: ${data.main.humidity}%<br>
Sunrise: ${sunriseTime}<br>
                Sunset: ${sunsetTime}
            </div>
        </div>
        `);
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
    $(".forecast").html("");
    for (i = 0; i < results.length; i++) {
        if (results[i] !== undefined) {
            $(".forecast").append(results[i]);
        }
        //        console.log(results[i]);
    }
}

function renderWeatherForecast(result, country) {
    let temperature;
    let weatherDate;
    let weatherTime;
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
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(result.main.temp - 273.15) * 9 / 5 + 32)).toString() + "°F";
        //        weatherDate = MonthNames[weatherDateTime.getMonth()] + " " + weatherDateTime.getDate();
    } else {
        temperature = (Math.round(Number(result.main.temp) - 273.15)).toString() + "°C";
    }
    if (weatherDateTime.getDate() === TODAY.getDate()) { // Don't need to compare full date, because forecast is only for next 5 days
        weatherDate = "Today,";
    } else if (weatherDateTime.getDate() === TODAY.getDate() + 1) {
        weatherDate = "Tomorrow";
    } else {
        weatherDate = days[weatherDateTime.getDay()];
    }
    let description = result["weather"]["0"]["description"];
    let returnHtml = `${weatherDate} ${weatherTime} - ${temperature}, ${description}<br>`;
    return returnHtml;
}

function clearLanding() {
    $("#doneLanding").click(function () {
        //        alert("clicked");
        //        $(".landingPageFrame").slideUp(1000);
        //        $(".landingPage").delay(1000).slideUp(1000);
        //        $(".fadeToBlack").delay(2500).fadeOut(2500);
        $("#logo").attr("src", "https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/images/snapshot_logo.gif?raw=true");
        $(".fadeToBlack ").fadeIn(1200);
        $(".landingPage").delay(1200).fadeOut(1);
        $(".landingPageFrame").delay(1200).fadeOut(1);
        window.location.hash = 'top';
        $(".fadeToBlack").fadeOut(2500);
    });
}

$(function () {
    getPlaceBased();
    clearLanding();
    getNews("", newsSources, "News", "", "first");
    getNews("", sportsSources, "Sports", "", "first");
    getNews("", entertainmentSources, "Entertainment", "", "first");
    getNews("", financialSources, "Financial", "", "first");
    querySubmit();
    seeMore();
    getLatLongFromAddress();
});
