var range = document.getElementById("priceRange");
var output = document.getElementById("outputRange");
output.innerHTML = range.value;

// Update valore mostrato
range.oninput = function() {
    output.innerHTML = this.value + '€';
}

window.onload = function(){
    output.innerHTML = 80 + '€';
}