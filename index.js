"use strict";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson, per_page) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  //iterate through the repositories array stopping at the max number of results
  for (let i = 0; (i < responseJson.value) & (i < per_page); i++) {
    $("#results-list").append(
      `<li><h3><a href="$(responseJson.value.length[i].url}">$(responseJson.value[i].name}</a></h3>
        </li>`
    );
  }
  //display the results section
  $("#results-list").removeClass("hidden");
}

function getRepos(username,type, per_page) {
  // username = $("#js-search-term").val()
  const searchUrl = `https://api.github.com/users/${username}/repos`;
  const params = {
    // accept = "application/vnd.github.v3+json",

    type: "all",
    per_page: 10,
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + "?" + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      accept: "application/vnd.github.v3+json",
    }),
  };

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson, per_page))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    var username = $("#js-search-term").val();
    const per_page = $("#js-max-results").val();
    getRepos(username, "all", per_page);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
});


