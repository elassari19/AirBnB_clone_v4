$(function () {
  const apiUrl = 'http://127.0.0.1:5001/api/v1';
  const amenitiesChecked = {};

  // event listning checkbox
  $('.amenities input:checkbox').change(function (event) {
    if ($(this).is(':checked')) {
      // list checked input
      amenitiesChecked[$(this).data('id')] = $(this).data('name');
      updateCheckedAmenitiesInterface();
    } else {
      // should unchecked input
      delete amenitiesChecked[$(this).data('id')];
      updateCheckedAmenitiesInterface();
    }
  });

  // should list input checked
  const updateCheckedAmenitiesInterface = () => {
    const length = Object.keys(amenitiesChecked).length;
    let content = ''; let i = 0;

    for (const amenity of Object.values(amenitiesChecked)) {
      const last = i === length - 1;
      content += amenity;
      if (!last) {
        content += ', ';
      }
      i++;
    }

    $('.amenities h4').text(content);
  };

  // should list checked input
  const updateCheckedLocationsInterface = () => {
    const length = Object.keys(citiesChecked).length + Object.keys(statesChecked).length;
    let content = ''; let i = 0;

    for (const location of [...Object.values(citiesChecked), ...Object.values(statesChecked)]) {
      const last = i === length - 1;
      content += location;
      if (!last) {
        content += ', ';
      }
      i++;
    }

    $('.locations h4').text(content);
  };

  // should return list of places
  const displayPlaces = (places) => {
    $('section.places').html('');

    for (const place of places) {
      $('section.places').append(
        `
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
          </div>
          <div class="user">
            <b></b>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
        `
      );
    }
  };

  // should make a post request
  const requestPlaces = params => {
    $.ajax({
      url: `${apiUrl}/places_search`,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(params),
      success: function (data, textStatus, jqXHR) {
        displayPlaces(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  };

  handleFilterListChange('.amenities input:checkbox', amenitiesChecked,
    updateCheckedAmenitiesInterface);

  $.get(`${apiUrl}/status`,
    function (data, textStatus, jqXHR) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  );

  requestPlaces({});

  $('button').click(event => {
    const amenities = Object.keys(amenitiesChecked);
    const states = Object.keys(statesChecked);
    const cities = Object.keys(citiesChecked);

    requestPlaces({ amenities, states, cities });
  });

  handleFilterListChange('.locations ul:nth-of-type(1) input:checkbox',
    statesChecked, updateCheckedLocationsInterface);

  handleFilterListChange('.locations ul:nth-of-type(2) input:checkbox',
    citiesChecked, updateCheckedLocationsInterface);
});
