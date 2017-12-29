// TO-DO:  GET RID OF UNNECESSARY PUSH.  CLEAN UP DATES.  CONSOLIDATE FUNCTIONS.  FURTHER CLEAN-UP OF EVENTFUL* (INCLUDING DOING SOMETHING WITH 'NULL' RESULTS, POSSIBLY SKIPPING CRAP RESULTS, AND ADJUSTING NUMBER OF RESULTS).  MAKE SURE "net::ERR_CONNECTION_TIMED_OUT" IS NOT A CONTINUING PROBLEM. REARRANGE PAGE ORDER.  ADD FOOTER
// *EVENTFUL NOTE - EVENTS DO HAVE UNIQUE ID AND URL.  COULD RUN WITH 4 MILE (OR WHATEVER) DISTANCE, SEE IF THERE ARE ENOUGH RESULTS, AND IF NOT, RUN AGAIN, AVOIDING REDUNCANCIES LIKE IN DC SCRAPING....
// EVENTFUL - IF DESCRIPTION AND TITLE NULL (OR REDUNDANT), IMMEDIATELY RETURN, WITH A VALUE LIKE 'SKIP' FOR EASY CULLING LATER
// LOOK AT DARK SKY API


// CHECK SECURITY STATUS VIA GIT.  GET RID OF HOLIDAYS?  CLEAN UP HTML STRUCTURE.  KILL UNNECESSARY HTML ONCE STRUCTURE CLEAN.  SHRINK WEATHER DISPLAY, MAKE SURE RESPONSIVE.

// git add . ; git commit -m 'REPLACE-ME'; git pull origin master; git push --set-upstream origin master
// https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/

// file:///C:/Python27/MyPrograms/JavaScriptClass/DavidSundland/BrowserWidth.html

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
let GLOBALLAT = "38.89";
let GLOBALLONG = "-77.034";
let TODAY = new Date();


function getDate(country) {
    console.log("in getDate");
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
    //    console.log("in titleCase");
    words = str.toLowerCase().split(' ');

    for (var i = 0; i < words.length; i++) {
        var letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
    }
    return words.join(' ');
}

function sentenceCase(str) { // Capitalize first letter in every sentence, make all others lowercase
    //    console.log("in sentenceCase");
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
        //        console.log("New location submitted");
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        address = queryTarget.val();
        //        console.log("Location submitted: ", address);
        queryTarget.val(""); // clear out the input
        $(".newLocation input").attr("placeholder", address); // Put address in search box as placeholder so search term is shown on page
        geocoder.geocode({
            'address': address
        }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                GLOBALLAT = latitude;
                GLOBALLONG = longitude;
                //                console.log("Lat: " + latitude + ", Long: " + longitude);
                callPlaceBased(latitude, longitude);
            } else {
                alert("Uh-oh, Google did not like the address which you entered!");
            }
        });
    });
}


function querySubmit() {
    console.log("newsQuerySubmit");
    $('.newsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".newsSearchForm input").attr("placeholder", " Enter a news search term to snap");
        getNews(searchTerm, newsSources, "News", "relevancy", "first");
    });
    $('.sportsSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".sportsSearchForm input").attr("placeholder", " Enter a sports search term to snap");
        getNews(searchTerm, sportsSources, "Sports", "relevancy", "first");
    });
    $('.entertainmentSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".entertainmentSearchForm input").attr("placeholder", " Enter an entertainment search term to snap");
        getNews(searchTerm, entertainmentSources, "Entertainment", "relevancy", "first");
    });
    $('.financialSearchForm').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        searchTerm = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".financialSearchForm input").attr("placeholder", " Enter a financial search term to snap");
        getNews(searchTerm, financialSources, "Financial", "relevancy", "first");
    });
    $('.eventsSearchForm').submit(event => {
        console.log("eventsSearchForm triggered");
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        eventfulQuery = queryTarget.val();
        queryTarget.val(""); // clear out the input
        $(".events").html("Please wait a moment as the list of events is collected and tidied up.");
        $(".eventsSearchForm input").attr("placeholder", " Enter an events search term to snap");
        let counter = 1;
        let maxCount = 6; // Maximum number of times to run testEventfulApi
        let distance = callPlaceBased.distance;
        console.log("Coupla items pulled from other function: ", distance, callPlaceBased.eventfulStartDate);
        //        distance = testEventfulApi(GLOBALLAT, GLOBALLONG, distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, eventfulQuery, counter, maxCount);
        //        if (distance === undefined) {
        //            $('.events').html(`<p>Don't you hate it when absolutely nothing is happening?  We found no Eventful events (none!) within 128 miles of your location today.</p>`);
        //        } else {
        getEventfulApi(GLOBALLAT, GLOBALLONG, distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, eventfulQuery, "first");
        //        }
    });
}

function seeMore() {
    console.log("in seeMore");
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
        getEventfulApi(GLOBALLAT, GLOBALLONG, callPlaceBased.distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, "", "prev");
    });
    $('.events').on('click', '#eventsNext', function () {
        $(".events").html("Please wait as the information is collected and tidied.");
        getEventfulApi(GLOBALLAT, GLOBALLONG, callPlaceBased.distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, "", "next");
    });
}

function getNews(searchTerm, sources, category, sortBy, call) {
    //    console.log("in getNews");
    let endDate = TODAY.getFullYear().toString() + '-' + (TODAY.getMonth() + 1).toString() + '-' + TODAY.getDate().toString(); // getMonth returns month value from 0 to 11...
    let before = new Date(TODAY);
    let beforeDifference = 0; // TEST PAGE WITH RESULTS FROM TODAY ONLY; IF NOT ENOUGH RESULTS, CHANGE INCREMENT
    before.setDate(TODAY.getDate() - beforeDifference);
    let startDate = before.getFullYear().toString() + '-' + (before.getMonth() + 1).toString() + '-' + before.getDate().toString();
    getTheNews(sources, searchTerm, startDate, endDate, category, sortBy, call);
}

function getTheNews(sources, searchTerm, startDate, endDate, section, sortBy, call) { // Documentation - https://newsapi.org/docs
    console.log("in getTheNews");
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
            console.log(sources, "result = ", result);
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
    return `<div class="row"><img src='${result["urlToImage"]}' alt="Image not found" onerror="this.onerror=null;this.src='https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/images/image_not_found.jpg?raw=true';" /><p class = "articleText"><span class="title"><a href='${result["url"]}' target='_blank'>${result["title"]}</a></span>, by <span class="author">${result["author"]}</span>. ${result["description"]}</p></div>`;
    //    return `<div class="row"><img src='${result["urlToImage"]}'><p class = "articleText"><span class="title"><a href='${result["url"]}' target='_blank'>${result["title"]}</a></span>, by <span class="author">${result["author"]}</span>. ${result["description"]}</p></div>`;
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
    console.log("in getPlaceBased");
    //    if (getPlaceBased.lat === undefined) {
    //        getPlaceBased.lat = "";
    //        getPlaceBased.lon = ""; // if lat undefined, then both undefined
    //    }

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
        let userLat = position.coords.latitude;
        let userLong = position.coords.longitude;
        GLOBALLAT = userLat;
        GLOBALLONG = userLong;
        callPlaceBased(userLat, userLong);
    }
    console.log("about to run navigator");
    navigator.geolocation.getCurrentPosition(success, error, {
        timeout: 10000 // If don't succeed in getting position within 10 seconds, give up
    });
}

function navNoGo() {
    console.log("in navNoGo");
    alert("Uh-oh! We could not automatically determine your location, so place-based results are defaulting to Washingon, DC. You can manually enter a different location if you'd like.")
    console.log("Geolocation is not supported by this browser.");
    callPlaceBased(GLOBALLAT, GLOBALLONG);
}

function callPlaceBased(userLat, userLong) {
    console.log("in callPlaceBased");
    callPlaceBased.eventfulStartDate = TODAY.getFullYear().toString() + (TODAY.getMonth() + 1).toString() + TODAY.getDate().toString() + "00"; // eventful date format is:  YYYYMMDD00
    callPlaceBased.eventfulEndDate = callPlaceBased.eventfulStartDate; // for first call, only search for today
    let eventfulQuery = ""; // search all events initially
    callPlaceBased.distance = 4; // Initial search distance for Eventful (4 miles - a reasonable distance for a big city)
    let counter = 1;
    let maxCount = 6; // Maximum number of times to run testEventfulApi
    //    console.log("before call, distance = ", callPlaceBased.distance, "All variables = ", userLat, userLong, callPlaceBased.distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, eventfulQuery, counter, maxCount);
    //    callPlaceBased.distance = testEventfulApi(userLat, userLong, callPlaceBased.distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, eventfulQuery, counter, maxCount);
    //    console.log("after call, distance = ", callPlaceBased.distance)
    //    if (callPlaceBased.distance === undefined) {
    //        $('.events').html(`<p>Don't you hate it when absolutely nothing is happening?  We found no Eventful events (none!) within ${callPlaceBased.distance} miles of your location today.</p>`);
    //    } else {
    getEventfulApi(userLat, userLong, callPlaceBased.distance, callPlaceBased.eventfulStartDate, callPlaceBased.eventfulEndDate, eventfulQuery, "first");
    //    }
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

function testEventfulApi(lat, long, distance, eventStartDate, eventEndDate, eventfulQuery, counter, maxCount) { // Since Eventful might not pull many results within 4 miles, test to determine necessary distance
    console.log("in testEventfulApi.  deets:", lat, long, distance, eventStartDate, eventEndDate, counter, maxCount);
    let query = {
        app_key: 'Jsr6ndZBQLW9qdLL',
        keywords: eventfulQuery,
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
            if ((result.events === null || result.events === undefined) && counter < maxCount) {
                console.log("In testEVent if, and result.events =", result.events);
                distance *= 2;
                counter++;
                testEventfulApi(lat, long, distance, eventStartDate, eventEndDate, eventfulQuery, counter, maxCount); // keep running test until # results found or maxCount reached
            } else if (result.events.event.length < 5 && counter < maxCount) {
                console.log("In testEvent else if, and result.events = ", result.events);
                distance *= 2;
                counter++;
                testEventfulApi(lat, long, distance, eventStartDate, eventEndDate, eventfulQuery, counter, maxCount); // keep running test until # results found or maxCount reached
            } else {
                if (result.events === null || result.events === undefined) { // if the test has not yielded any results, return nothing
                    console.log("result.events was null");
                    return;
                } else {
                    console.log("supposedly, result.events was ", result.events, "and distance was", distance);
                    return distance;
                }
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function getEventfulApi(lat, long, distance, eventStartDate, eventEndDate, searchTerm, call) {
    console.log("In getEventfulApi.  Passed values: ", lat, long, distance, eventStartDate, eventEndDate, searchTerm, call);
    if (getEventfulApi.pageNumber === undefined) { // if undefined, then first time function has been run
        getEventfulApi.pageNumber = 1;
        getEventfulApi.query = "";
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
            console.log("getEventfulApi done result = ", result);
            displayEventful(result, getEventfulApi.pageNumber);
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

function textCleanup(text, maxLength) {
    //    console.log("in textCleanup");
    text.replace(/\<p\>/g, " ").replace(/\<\/p\>/g, " ").replace(/\<br\>/g, "").replace(/\<hr\>/g, "").replace(/\<b\>/g, "").replace(/\<\/b\>/g, "").replace(/\<strong\>/g, "").replace(/\<\/strong\>/g, ""); // Remove HTML tags that are commonly found within results
    text.replace(/\_+/g, '_').replace(/\-/g, '-').replace(/\s+/g, ' '); // Remove abusive use of underscores, hyphens, & white space
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

function renderEventful(result) {
    //    console.log("In renderEventful", result);
    if ((result["title"] === null || result["title"].length < 5) && (result["description"] === null || result["description"].length < 5)) {
        return; // if there is no title or description, or if both are preposterously short, return with no value (skip the event)
    }
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

function displayHolidays(data) { // CAN'T USE?  API NOT SECURE
    console.log("in displayHolidays");
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
            displayWeather(result, country);
            //            console.log(result, result.main.humidity, result.main.temp, result.wind.deg, result.wind.speed, result.weather[0].description);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

function displayWeather(data, country) {
    console.log("in displayWeather", data, country);
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
                ${titleCase(data.weather[0].description)}<br>
Wind ${windSpeed} from the ${windDirection}.<br>
Humidity: ${data.main.humidity}%<br>
Sunrise: ${sunriseTime}<br>
                Sunset: ${sunsetTime}
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
    console.log("in getWeatherForecastApi");
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
    console.log("in displayWeatherForecast");
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
    //    console.log("in renderWeatherForecast, result: ", result);
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
    //    let weatherTime = weatherDateTime.getHours() + ":" + weatherDateTime.getMinutes();
    if (country === 'us' || country === 'US') {
        temperature = (Math.round(Number(result.main.temp - 273.15) * 9 / 5 + 32)).toString() + "°F";
        //        weatherDate = MonthNames[weatherDateTime.getMonth()] + " " + weatherDateTime.getDate();
    } else {
        temperature = (Math.round(Number(result.main.temp) - 273.15)).toString() + "°C";
        //        weatherDate = weatherDateTime.getDate() + " " + MonthNames[weatherDateTime.getMonth()];
    }
    if (weatherDateTime.getDate() === TODAY.getDate()) { // Don't need to compare full date, because forecast is only for next 5 days
        weatherDate = "Today,";
    } else if (weatherDateTime.getDate() === TODAY.getDate() + 1) {
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

function clearLanding() {
    $("#doneLanding").click(function () {
        //        alert("clicked");
        //        $(".landingPageFrame").slideUp(1000);
        //        $(".landingPage").delay(1000).slideUp(1000);
        //        $(".fadeToBlack").delay(2500).fadeOut(2500);
        $("#logo").attr("src", "https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/images/snapshot_logo.gif");
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
