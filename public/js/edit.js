// edit.js

const form = document.getElementById('edit-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const addressInput = document.getElementById('address');
const dateInput = document.getElementById('date');

// Add an event listener for form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check for missing form data
  if (!titleInput.value || !descriptionInput.value || !addressInput.value || !dateInput.value ) {
    alert('Please fill out all fields');
    return;
  }

  // Fetch geocoded location data from your geocoding API
  const geocodedLocation = await getGeocodedLocation(locationInput.value);

  // Add the geocoded location data to the form data
  const formData = new FormData(form);
  formData.append('location', JSON.stringify(geocodedLocation));

  // Send the form data to your server
  fetch(form.action, {
    method: 'PUT',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Redirect to the sellerHome or wherever you want to redirect after successful update
      window.location.href = '/api/post/sellerHome';
    } else {
      alert('An error occurred while updating the post');
    }
  })
  .catch(err => console.error(err));
});

// Function to get geocoded location data (this is a placeholder - replace with your actual geocoding function)
async function getGeocodedLocation(address) {
  // Make a request to your geocoding API
  // Return the response data
}
