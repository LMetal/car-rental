
function updateModels() {
    const modelSelect = document.getElementById('modelSelect');
    const selectedBrand = brandSelect.value;

    var models = JSON.parse(document.querySelector('script[data-models]').getAttribute('data-models'));
    
    // Clear existing options
    modelSelect.removeAttribute('disabled');
    modelSelect.innerHTML = '<option selected>Seleziona un modello</option>';

    // Filtra i modelli in base alla marca
    const filteredModels = models.filter(model => model.brand === selectedBrand);
    
    
    // Add options for the filtered models
    filteredModels.forEach(model => {
      const option = document.createElement('option');
      option.text = model.name;
      modelSelect.add(option);
    });
}
