const yardForm = document.getElementById('yard-form');
const yardTitle = document.getElementById('yard-title');
const yardDescription = document.getElementById('yard-description');
const yardAddress = document.getElementById('yard-address');
const yardDate = document.getElementById('yard-date');
const yardTime = document.getElementById('yard-time');

// Send POST to API to add yard sale
async function addYardSale(e) {
  e.preventDefault();

  if (yardTitle.value === '' || yardDescription.value === '' || yardAddress.value === '' || yardDate.value === '' || yardTime.value === '') {
    alert('Please fill in all fields');
  }

  const sendBody = {
    title: yardTitle.value,
    description: yardDescription.value,
    address: yardAddress.value,
    date: yardDate.value,
    time: yardTime.value,
  };

  try {
    const res = await fetch('/api/post/garageSale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });

    if (res.status === 400) {
      throw Error('Yard sale already exists!');
    }

    alert('Yard sale added!');
    window.location.href = '/api/post/sellerHome'; 
  } catch (err) {
    alert(err);
    return;
  }
}

yardForm.addEventListener('submit', addYardSale);
