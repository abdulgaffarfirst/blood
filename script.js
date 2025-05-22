const scriptURL = 'https://script.google.com/macros/s/AKfycbwB1Za9R_qjsheBO0rdzENWMG5nGgCXZpQSdHPDV527lNmaSTKwk4UsWqUZKK53Jbndow/exec';
const form = document.forms['contact-form'];
const submitBtn = document.getElementById('submit');
const successMsg = document.getElementById('success-message');

const donationSelect = document.getElementById('donation-count');
const donationOtherInput = document.getElementById('donation-count-other');
const otherFieldWrapper = document.getElementById('other-donation-count');

donationSelect.addEventListener('change', function () {
  if (this.value === 'Other') {
    otherFieldWrapper.style.display = 'block';
    donationOtherInput.required = true;
  } else {
    otherFieldWrapper.style.display = 'none';
    donationOtherInput.required = false;
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();

  // আগের hidden input থাকলে সরিয়ে ফেলি
  const existingHidden = form.querySelector('input[name="Donation-Count"]');
  if (existingHidden) {
    form.removeChild(existingHidden);
  }

  // নতুন hidden input তৈরি করি
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = 'Donation-Count';

  // যদি অন্যান্য হয়, তাহলে ইনপুট ফিল্ড থেকে সংখ্যা নিই
  if (donationSelect.value === 'Other' && donationOtherInput.value) {
    hiddenInput.value = donationOtherInput.value;
  } else {
    hiddenInput.value = donationSelect.value;
  }

  form.appendChild(hiddenInput);

  submitBtn.disabled = true;
  submitBtn.value = "সাবমিট হচ্ছে...";

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      form.reset();
      otherFieldWrapper.style.display = 'none';

      const postSubmitHidden = form.querySelector('input[name="Donation-Count"]');
      if (postSubmitHidden) {
        form.removeChild(postSubmitHidden);
      }

      successMsg.style.display = "block";
      successMsg.innerText = "✅ সাবমিশন সফল হয়েছে!";
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    })
    .catch(error => {
      successMsg.style.display = "block";
      successMsg.innerText = "❌ সাবমিশনে সমস্যা হয়েছে!";
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.value = "সাবমিট করুন";
    });
});
