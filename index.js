'use strict';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map
    (key => `${[encodeURIComponent(key)]}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayParks(responseJson, amountResult) {
//This function is responsible for rendering the response data to the DOM, formatted for HTML (URL, Park name, and description). At the end, it removes the hidden class to reveal the results)
    console.log(responseJson);

    $('.results-list').empty();

    for (let i = 0; i < responseJson.data.length && i < amountResult; i++) {
        $("#results").append(`
        <div>
        <ul>
            <li class="result-item">
            <h2><a href='${responseJson.data[i].url}'>${responseJson.data[i].fullName}</a></h2>
            <h4>Description:</h4>
                <p>${responseJson.data[i].description}</p>
            <hr>
            <h4>Address:</h4>
                <p>${responseJson.data[i].addresses[0].line1}</p>
                <p>${responseJson.data[i].addresses[0].line2}</p>
                <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}</p>
                <p>${responseJson.data[i].addresses[0].postalCode}</p>                
            </li>
        </ul>
        </div>`);
    }
    $('#results').removeClass('hidden');
}

function handleStateSearch(baseURL, state, amountResult, apiKey) {
    const params = {
        stateCode: state,
        limit: amountResult
    };

    const queryItems = formatQueryParams(params);
    const url = baseURL + '?' + queryItems + '&api_Key=' + apiKey;
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayParks(responseJson, amountResult))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);

    console.log('handleStateSearch Ran')
        });
}

//This function conducts the GET request via the NPS API with 'state' as a parameter

//This function listens for when user has input a search and submits via the 'Search' button
function mainSearch() {
    $('.submit-form').submit(event => {
        event.preventDefault();
        // API Key and URL for NPS //
        const apiKey = 'lPVkNkzcS2pIU6L8WkuGCzXCunBrdwZSEm7l0LH0';
        const baseURL = "https://developer.nps.gov/api/v1/parks";
        const state = $('.js-state-park').val().split(); 
        const amountResult = $('.js-result-amount').val();
        console.log(state);
        console.log(amountResult);
        //Clear any previous results
        $('#results').empty();
        //This will empty any results that were previously displayed
        //Assigns user input value to 'username'
        //Call handleStateSearch with 'state' argument
        handleStateSearch(baseURL, state, amountResult, apiKey);
        console.log('mainSearch Ran')
    });
}

$(mainSearch);