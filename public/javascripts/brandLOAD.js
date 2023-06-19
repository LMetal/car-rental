document.addEventListener("DOMContentLoaded", function() {
    const brandSelect = document.getElementById('brandSelect');
    var models = JSON.parse(document.querySelector('script[data-models]').getAttribute('data-models'));


    //brandSelect.innerHTML = '<option selected disabled>Select a brand first</option>';

    const brands = new Set();
    models.forEach(model => {
        brands.add(model.brand);
    });

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.text = brand;
        brandSelect.add(option);
    });

});