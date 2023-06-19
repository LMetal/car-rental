
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const optionalSum = document.getElementById('optionalSum');
const totalSum = document.getElementById('totalSum');


function updateSum() {
  const values = JSON.parse(document.querySelector('script[data-models]').getAttribute('data-models'));
  const days = values.days;
  const rentCost = values.affitto;

  let sum = 0;
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      sum += parseInt(checkbox.value);
    }
  });
  optionalSum.textContent = sum * days;
  totalSum.textContent = sum * days + rentCost;
}

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', updateSum);
});