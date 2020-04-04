const key = keyHolder.NYT_KEY;
let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
let queryString = '';
let startYear = 0;
let endYear = 0;
let numberOfArticles = 10;

const clearForm = () => {
  $("#search-term").val('');
  $("#select-number").val('');
  $("#start-year").val('');
  $("#end-year").val('');
  queryString = '';
  startYear = 0;
  endYear = 0;
  numberOfArticles = 10;
  url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
}

const formatYear = (year) => {
  // is year this year?
  year === moment().format('YYYY')
    // yes, so set date string to today's date
    ? year = moment().format('YYYYMMDD')
    // no, but is the year equal to the end-year field?
    : year === $("#end-year").val()
      // yes, so set the year to the year passed in and the month/day to 12/31
      ? year = `${year}1231`
      // no, so set the date to year0101
      : year = `${year}0101`
  return year;
}

const appendTitle = (article) => {
  let headline = '';
  if (article.document_type === 'article'){
    if (article.headline.print_headline !== ''){
      headline = article.headline.print_headline;
    } else {
      headline = article.headline.main;
    }
  } else {
    headline = article.headline.main;
  }
  $(".article-list").append(`<div class='well'><h4><a href=${article.web_url}>${headline}</a></h4><p class='caps'>${article.byline.original}</p></div>`);
}

$("#clear-form").on("click", (e) => {
  e.preventDefault();
  clearForm();
})

$("#search-btn").on("click", (e) => {
  e.preventDefault();
  $(".article-list").empty();

  queryString = $("#search-term").val();

  // if start-year field is empty
  !$("#start-year").val()
    // yes? set startYear to 1900
    ? startYear = formatYear(1900)
    // no? set startYear to a formatted version of the value of start-year
    : startYear = formatYear($("#start-year").val())
    
  // if end-year field is empty
  !$("#end-year").val()
    // yes? set endYear to a formatted version of the current year
    ? endYear = formatYear(moment().format('YYYY'))
    // no? set endYear to a formatted version of the value of end-year
    : endYear = formatYear($("#end-year").val()) 

  url += '?' + $.param({
    'api-key': key,
    'q': queryString,
    'begin_date': startYear,
    'end_date': endYear
  });

  $.ajax({
    method: 'GET',
    url: url
  }).done((results) => {
    numberOfArticles = $("#select-number").val();
    for (let i = 0; i < numberOfArticles; i++) {
      appendTitle(results.response.docs[i]);
    }
  })
  queryString = '';
  startYear = 0;
  endYear = 0;
});