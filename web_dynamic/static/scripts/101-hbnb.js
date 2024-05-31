$(document).ready(function () {
    const amenities = {};
    const states = {};
    const cities = {};
  
    $('input[type="checkbox"]').change(function () {
      const dataId = $(this).attr('data-id');
      const dataName = $(this).attr('data-name');
  
      if ($(this).is(':checked')) {
        if ($(this).closest('.amenities').length) {
          amenities[dataId] = dataName;
        } else if ($(this).closest('.locations').length) {
          if ($(this).parent().parent().is('li')) {
            states[dataId] = dataName;
          } else {
            cities[dataId] = dataName;
          }
        }
      } else {
        if ($(this).closest('.amenities').length) {
          delete amenities[dataId];
        } else if ($(this).closest('.locations').length) {
          if ($(this).parent().parent().is('li')) {
            delete states[dataId];
          } else {
            delete cities[dataId];
          }
        }
      }
  
      $('.amenities h4').text(Object.values(amenities).join(', '));
      $('.locations h4').text(
        Object.values(states).concat(Object.values(cities)).join(', ')
      );
    });
  
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
      if (textStatus === 'success' && data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    function fetchPlaces() {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: Object.keys(amenities),
          states: Object.keys(states),
          cities: Object.keys(cities),
        }),
        success: function (data) {
          $('.places').empty();
          for (const place of data) {
            const article = `
              <article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${
              place.max_guest !== 1 ? 's' : ''
            }</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${
              place.number_rooms !== 1 ? 's' : ''
            }</div>
                  <div class="number_bathrooms">${
                    place.number_bathrooms
                  } Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
                <div class="reviews">
                  <h3>Reviews</h3>
                  <ul></ul>
                </div>
              </article>
            `;
            $('.places').append(article);
          }
        },
      });
    }
  
    $('button').click(fetchPlaces);
  
    $('#toggle_reviews').click(function () {
      const reviewsDiv = $('.reviews');
      const toggleReviews = $(this);
  
      if (toggleReviews.text() === 'show') {
        $.ajax({
          url: 'http://0.0.0.0:5001/api/v1/places/${placeId}/reviews',
          type: 'GET',
          success: function (data) {
            reviewsDiv.find('ul').empty();
            for (const review of data) {
              const li = `<li>${review.text}</li>`;
              reviewsDiv.find('ul').append(li);
            }
            reviewsDiv.show();
            toggleReviews.text('hide');
          },
        });
      } else {
        reviewsDiv.hide();
        toggleReviews.text('show');
      }
    });
  });
