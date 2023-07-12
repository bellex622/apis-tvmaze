"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
// TODO: make global constants
// TODO: store the base URL (rather than full URL) separately
const tvMazeUrl = 'http://api.tvmaze.com/search/shows';
const defaultImageUrl = 'https://tinyurl.com/tv-missing';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get(
    tvMazeUrl,
    {
      params: {
        q: term
      }
    }
  );

  const tvMazeResults = response.data; //array
  const showFiltered = [];

  console.log(tvMazeResults);

  // TODO: Consider using .map() here instead
  for (const result of tvMazeResults) {
    // let { id, name, summary, image } = show.show;
    // console.log(id, name, summary, image);

    const { id, name, summary } = result.show;
    const showDetails = { id, name, summary };

    // TODO: The docstring defined a contract for this to be 'image'
    showDetails.imageUrl = (
      result.show.image ? result.show.image.medium : defaultImageUrl
    );

    showFiltered.push(showDetails);
  }
  return showFiltered;
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
              src="${show.imageUrl}"
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

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
