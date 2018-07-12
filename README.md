# Snapshot API Capstone
Thinkful API Capstone

## Background

I built this app because I want to be able to quickly understand what is happening in my area and the world.
Live preview available at: https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/

## User Story
This app helps users quickly see information about trending news stories, weather, and upcoming events in their area. If the browser supports geolocation and the user allows it, the site pulls the user's coordinates and delivers weather and events based upon that location; otherwise location defaults to Washington, DC. Headlines, images, and links for the most popular current news, entertainment, financial, and sports stories are also provided. The user can manually change the location to see information about other areas, and can enter search terms for the news and events feeds.

As a user, I want to land on the website and quickly understand what the site is about.  As a user, I want to be able to get a quick update on what is happening in my area and the world right now.

The landing page:
* User sees the site logo (Polaroid camera) and an overview of the site, bordered by a photo frame.
* User clicks on the "Snap" button to proceed to the site.
* When "Snap" is clicked, the landing page fades out, the main page fades in, and the logo snaps a picture.

The main page:
* User is asked permission for site to know location. If user declines or geolocation not supported by browser, location defaults to Washington, DC.
* The user sees the webpage title with today's date and information sections - weather, top headlines, and events.
* Weather is separated into two categories - current weather, and a forecast.
* Below the weather section is an input box; the user can enter a new location, and weather and events will be collected for that location.
* Articles are provided in four sections - news, sports, entertainment, and financial.  Articles are initially generated without any specific search term and are sorted by popularity of author.  User can enter a search term in any of the news feeds.
* To keep page compact and simplify navigation, only the tops of the results are shown.  User can click a box to unlock scrolling for a section.  Once the user is done with that section, that section's scrolling can be locked again.
* If more than 20 results are found, a snap button appears, allowing the user to snap to the next page of results.  Once on the second page and beyond, the user can also snap to the previous page of results.
* Weather defaults to Imperial (Farenheit, MPH for wind speed) if location is U.S., metric if elsewhere in world.
![landing page](https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/NapkinSketch1.jpg)

## Working Prototye
A live example of the project can be found at https://davidsundland.github.io/whats-up-news-events-weather-api-capstone/


### Screenshot of landing page:

![landing page](https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/github-images/landing_page_screenshot.png?raw=true)

### Screenshot of results page before user interaction:

![results page](https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/github-images/primary_page_screenshot.png?raw=true)

### Screensot of results page after user interaction:

![results page after user interaction](https://github.com/DavidSundland/whats-up-news-events-weather-api-capstone/blob/master/github-images/screenshot_after_user_interaction.png?raw=true)


## Functionality
This app's functionality includes:
* Automatically determines user's location and country code, and provides results based on that location.
* User can opt to see results for a different location.
* Searches for the day's most popular articles about news, sports, business, and entertainment.
* Ability for user to enter a keyword for article and event searches.
* To reduce page clutter while showing large numbers of results, only a portion of results is initially shown, and user can unlock or lock scrolling for those results.
* Buttons for previous and next results only appear if previous or next results have actually been retrieved.
* Events which have no title or subject are skipped, events which have a subject but no title use the subject as the title.
* Results for events are cleaned up - excessive spaces, hyphens, and underscores are removed, user-created tags are removed, and excessive use of CAPS are converted to title case or sentence case.
* Units (metric or Imperial) and date format (m d, y vs d m y) are based on country code.
* Error handling has been provided for contingencies such as unsuccessful geolocation, no results found, error in displaying an image, or submission of erroneous address.

## Technology
* HTML
* CSS
* JavaScript
* jQuery

* The app uses the JavaScript getCurrentPosition method to determine user's location, and passes coordinates to <a href="https://maps.googleapis.com">Google Maps</a> to get the country code.  The Google Maps API is also used to obtain coordinates from a user-entered address.
* The app uses AJAX JSON calls to the <a href="https://newsapi.org">News API</a> to return news results.
* The app uses AJAX JSON calls to the <a href="http://api.eventful.com/">Eventful</a> API to return a list of events.
* The app uses AJAX JSON calls to the <a href="http://api.openweathermap.org/">Open Weather Map</a> APIs to get weather information.

## Responsive
App is built to be responsive across mobile, tablet, laptop, and desktop screen resolutions.
