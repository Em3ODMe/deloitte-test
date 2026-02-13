# Scenario 

The client has a simple scenario

REST countries API (https://restcountries.eu/#api-endpoints-all ) returns detailed country information

OpenWeatherMap REST API (https://openweathermap.org ) returns detailed weather information for a particular city

The client needs a new REST API and React front-end which will:

Support CRUD operations for a city 
Combine weather and country data for a particular city when searching

# Requirements

API
Create a Node/Express REST API that supports the following operations

Add City - adds city name, state (i.e. geographic sub-region), country, tourist rating (1-5), date established and estimated population. Adds record to local SQL data store and generates unique city id.

Update city – update rating, date established and estimated population by city id

Delete city – delete city by city id

Search city – search by city name, and returns the city id, name, state (i.e. geographic sub-region), country, tourist rating (1-5), date established, estimated population, 2 digit country code, 3 digit country code, currency code and weather for the city. If there are multiple matches, this information is returned for all matches. If the city is not stored locally no results need be returned. The APIs above should be used to provide any information not stored locally.

The Add, Update and Delete operations will take place against a local SQL data store

Provide at least 1 unit test

UI
Create a React front-end to enable searching and CRUD operations
