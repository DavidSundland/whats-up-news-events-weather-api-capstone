# What's Up API Capstone
Thinkful API Capstone

## Background

I built this app because I want to be able to quickly understand what is happening in my area and the world.
Live preview available at: https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/

## User Story
This app helps users quickly see information about trending news stories, weather, upcoming events in their area, and the month's holidays. If the browser supports geolocation and the user allows it, the site pulls the user's coordinates and delivers weather, events, and holidays based upon that location; otherwise location defaults to Washington, DC. Headlines, images, and links for the most popular current news, entertainment, financial, and sports stories are also provided. The user can manually change the location to see information about other areas, and can enter search terms for the news feeds.

As a user, I want to land on the website and quickly understand what the site is about.  As a user, I want to be able to get a quick update on what is happening in my area and the world right now.

From the landing page:
* User is asked permission for site to know location. If user declines or geolocation not supported by browser, location defaults to Washington, DC.
* The user sees the webpage title and today's date, brief explanation of site, and information sections - top headlines, weather, events, and holidays.
* News items are generated automatically; user can enter keywords to change news feed or click to see additional results.
* User can enter a new location to see weather, events, and holidays for that location.
* User can enter a keyword for events.
* Weather defaults to Imperial (Farenheit, MPH for wind speed) if location is U.S., metric if elsewhere in world.
* The month's holidays are listed, clicking on the holiday name pulls up a Google search for the holiday.
![landing page](https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/NapkinSketch1.jpg)

## Working Prototye
A live example of the project can be found at https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/
![landing page](https://github.com/EGrebowski/gateway-to-roman-architecture-api-capstone/blob/master/github-images/screenshot-1.png)
![results page](https://github.com/EGrebowski/gateway-to-roman-architecture-api-capstone/blob/master/github-images/screenshot-2.png)
![detailed results section](https://github.com/EGrebowski/gateway-to-roman-architecture-api-capstone/blob/master/github-images/screenshot-3.png)


## Functionality
This app's functionality includes:
* Automatically determines user's location and country code, and provides results based on that location.
* User can opt to see results for a different location.
* Searches for the day's most popular articles about news, sports, business, and entertainment.
* Ability for user to enter a keyword for article and event searches.
* Duplicate results for lists of holidays and events are eliminated.

## Technology
* HTML
* CSS
* JavaScript
* jQuery

* The app uses the JavaScript getCurrentPosition method to determine user's location, and passes coordinates to <a href="http://ws.geonames.org/">Geo Names</a> to get the country code.
* The app uses AJAX JSON calls to the <a href="https://newsapi.org">News API</a> to return news results.
* The app uses AJAX JSON calls to the <a href="http://api.eventful.com/">Eventful</a> API to return a list of events.
* The app uses AJAX JSON calls to the <a href="https://holidayapi.com/">Holiday API</a> to return a list of holidays.
* The app uses AJAX JSON calls to the <a href="http://api.geonames.org/">Geo Names</a> and <a href="http://api.openweathermap.org/">Open Weather Map</a> APIs to get weather information.

## Responsive
App is built to be responsive across mobile, tablet, laptop, and desktop screen resolutions.
