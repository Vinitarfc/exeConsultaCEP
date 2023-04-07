console.log("=== CEP ===");
// capturar o elemento no DOM
const fieldCEP = document.querySelector("#cep");
let addresses = (localStorage.addresses) ? JSON.parse(localStorage.addresses): [];

// Actions

function onlyNumbers(e) {
    // console.log(arguments[0]);
    // console.log(e.target.value);
    // console.log(this.value, this.value.match(/\d+/));
    // console.log(this.value, /\d+/.test(this.value));
    this.value = this.value.replace(/\D+/g, "");
}

function validateEntry() {    
    if (this.value.length === 8) {
        // this.style.borderColor = ""; 
        // this.style.borderWidth = "";
        // this.style.backgroundColor = "";
        this.classList.remove("error");
        getAddress(this.value);
    } else {        
        // this.style.borderColor = "red";
        // this.style.borderWidth = "2px";
        // this.style.backgroundColor = "yellow";
        this.classList.add("error");
        this.focus();
    }
}

function getAddress(e) {
    // endpoint
    // const endpoint = "https://viacep.com.br/ws/" + postalCode + "/json/";
    e.preventDefault();
    const postalCode = fieldCEP.value;
    const endpoint = `https://viacep.com.br/ws/${postalCode}/json/`;
    
    // config
    const config = {
        method: "GET"
    };

    // request
    /*
    
                  Promise
                    |
                 <pending>
                /         \
           fulfilled     rejected
           .then()       .catch()
    */
    fetch(endpoint, config)
        .then(function(resp) { return resp.json(); })
        .then(getAddressSuccess)
        .catch(getAddressError);
}

function getAddressSuccess(address) {
    if (address.erro) {
        return alert("CEP não encontrado.");
    } else {
        debugger;
        if (verificarExiste(address)){
          return alert("tem")
        }
        addresses.push(address);
        localStorage.setItem("addresses", JSON.stringify(addresses));
        retornarCards();
    }
}

function verificarExiste(address) {
  //tentei verificar se existe de diversas formas mas não consegui
  //addresses.contains(address);
  //addresses.asList.contains(address);
  return false;
}

function retornarCards(){
    const card = addresses.map(function(cardInfo){
       const {logradouro, cep, localidade, uf, bairro} = cardInfo;
        return `<div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${logradouro}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">
                            ${bairro} - ${localidade} - ${uf}
                        </h6>
                        <p class="card-text">${cep}</p>
                    </div>
                </div>`
        }).join('');

    document.querySelector(".cards").innerHTML = card;
}

function getAddressError() {
    return alert("Consulta não disponível no momento.");
}

function limparConsulta(){
    localStorage.clear();
    retornarCards();
}

// Mapping Events
document.querySelector("#cep").addEventListener("input", onlyNumbers); // onlyNumbers(InputEvent)
document.querySelector("#cep").addEventListener("focusout", validateEntry);
document.querySelector(".btn-primary").addEventListener("click", getAddress);
document.querySelector(".btn-secondary").addEventListener("click", limparConsulta);
document.addEventListener("DOMContentLoaded", retornarCards);