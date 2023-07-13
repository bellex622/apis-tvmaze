"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TV_MAZE_BASE_URL = 'http://api.tvmaze.com/';
const DEFAULT_IMAGE_URL = 'https://tinyurl.com/tv-missing';
const $getEpisodesButton = $(".Show-getEpisodes");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get(
    `${TV_MAZE_BASE_URL}search/shows`,
    {
      params: {
        q: term
      }
    }
  );

  const tvMazeResults = response.data; //array
  // console.log(tvMazeResults);

  const showsFiltered = tvMazeResults.map(extractFilterShows);
  return showsFiltered;
}

/**
 * Accept a result object from a TV Maze show search
 * Returns a filtered version of that object with only: id, name, summary
 * and image; if image is null, provides a default image URL instead
 * @param {object} tvMazeResult
 */
function extractFilterShows(tvMazeResult) {
  const { id, name, summary } = tvMazeResult.show;
  const showDetails = { id, name, summary };

  showDetails.image = (
    tvMazeResult.show.image ? tvMazeResult.show.image.medium : DEFAULT_IMAGE_URL
  );

  return showDetails;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(
    `${TV_MAZE_BASE_URL}shows/${id}/episodes`
  );
  // console.log("raw axios response:", response);
  // response.data is an array of episode arrays (1 - n)
  // response.data[episode array] is an array episode objects
  // response.data[episode array][index] is an episode object

  const tvMazeResults = response.data; //array or arrays
  console.log("tvMazeResults", tvMazeResults);

  //change the varible name
  const episodesFiltered = tvMazeResults.map(extractFilterEpisode);
  console.log("getEpisodeOfShow will return:", episodesFiltered);


  return episodesFiltered;
}

/**
 * Accept a result object from a TV Maze episode search
 * Returns a filtered version of that object with only: id, name, season
 * and number
 * @param {object} tvMazeEpisode
 */
function extractFilterEpisode(tvMazeEpisode) {
  // console.log("extractFilterEpisodes is receiving:", tvMazeEpisode);
  const { id, name, season, number } = tvMazeEpisode;
  return { id, name, season, number };
  // console.log("extractor is returning the object:", episodeDetails);
  // return episodeDetails;
}

/**
 * It will accept an array of episodes and then populate the episode data
 * into the 'episodesList' DOM underorder list
 * @param {array} episodes
 */
function displayEpisodes(episodes) {
  // console.log("displayEpisodes receives episodes:", episodes);

  const $episodesList = $("#episodesList");
  // console.log("we think episodes list UL is:", $episodesList);
  $episodesList.empty();

  for (const episode of episodes) {
    // create and add a new episode object to episodes list UL
    const $newLi = $(`<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`);
    console.log("new html we will add is:", $newLi);

    $episodesList.append($newLi);
  }

  $episodesArea.show();
}

// add other functions that will be useful / match our structure & design


/**It will tie together getEpisodesOfShow and displayEpisodes. It takes the show id. */
async function findEpisodesAndDisplay(showId) {

  const episodes = await getEpisodesOfShow(showId);
  console.log("episodes=", episodes);
  displayEpisodes(episodes);


}

/**Add eventlisten when clicking the episode button */
$showsList.on("click", "button", async function handleGetEpisodes(evt) {
  // change variable name
  const $divWithId = $(evt.target).closest(".Show");
  console.log('divWithId', $divWithId);

  //looking for this attribute:data-show-id="${show.id}"
  const showId = $divWithId.data("show-id");
  console.log("showId=", showId);
  // console.log();
  await findEpisodesAndDisplay(showId);

});




