import {APILoader} from 'https://unpkg.com/@googlemaps/extended-component-library@0.6';

const SHORT_NAME_ADDRESS_COMPONENT_TYPES =
    new Set(['street_number', 'administrative_area_level_1', 'postal_code']);

const ADDRESS_COMPONENT_TYPES_IN_FORM = [
  'location',
  'locality',
  'administrative_area_level_1',
  'postal_code',
  'country'
];

function getFormInputElement(componentType) {
  return document.getElementById(`${componentType}-input`);
}

function fillInAddress(place) {
  function getComponentName(componentType) {
    for (const component of place.address_components || []) {
      if (component.types[0] === componentType) {
        return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType) ?
            component.short_name :
            component.long_name;
      }
    }
    return '';
  }

  function getComponentText(componentType) {
    return (componentType === 'location') ?
        `${getComponentName('street_number')} ${getComponentName('route')}` :
        getComponentName(componentType);
  }

  for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
    document.getElementById(`country-input`).value = document.getElementById(`country-input`).value + getComponentText(componentType);
  }
}

async function initMap() {
  const {Autocomplete} = await APILoader.importLibrary('places');

  const autocomplete = new Autocomplete(getFormInputElement('starting'), {
    fields: ['address_components', 'geometry', 'name'],
    types: ['address'],
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert(`No details available for input: '${place.name}'`);
      return;
    }
    fillInAddress(place);
  });

  const autocomplete2 = new Autocomplete(getFormInputElement('ending'), {
    fields: ['address_components', 'geometry', 'name'],
    types: ['address'],
  });

  autocomplete2.addListener('place_changed', () => {
    const place = autocomplete2.getPlace();
    if (!place.geometry) {
      window.alert(`No details available for input: '${place.name}'`);
      return;
    }
    fillInAddress(place);
  });
}

initMap();