//variaveis e libs
const requestUrl = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=b55eba82b4ec177efba4215de1be77e26c5d5bf9';
const postUrl = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=b55eba82b4ec177efba4215de1be77e26c5d5bf9';
let fs = require('fs');
let fetch = require('node-fetch');
let sha1 = require('js-sha1');
let FormData = require('form-data');

//requisição e salvando no answer.json
async function request() {
    return await fetch(requestUrl).then(res => res.json());
} 

//main function
async function main() {
    const message = await request();
    
    //salvando no answer.json
    save(message);

    //Desconstruindo o retorno da API
    const key = message.numero_casas;
    const code = message.cifrado;
    let temp = '';

    console.log('mensagem codificada:', code);
    
    //aplicando a decodificação
    for (let i = 0; i < code.length; i++) {
        let n = code[i].charCodeAt(0);
        if ( n >= 97 && n <= 103) {
            n = n - key + 26

        } else if (n >= 104 && n <= 122) {
            n = n - key
        }
        temp = temp + String.fromCharCode(n);
    }

    message.decifrado = temp;
    console.log('mensagem decodificada:', message.decifrado);

    //Aplicação de codificação SHA-1
    message.resumo_criptografico = sha1(message.decifrado);
    console.log('sha1:', message.resumo_criptografico)

    //Salvando answer.json
    save(message);

    //Instanciando arquivo multipart/form-data
    const form = new FormData();
    form.append('answer', fs.createReadStream('answer.json'));
    console.log('formulario: ', form);

    //POST
    const response = await fetch(postUrl, {
        method: 'POST',
        body: form
    });
    console.log('postStatus:', response.status);
}

//Salvando o retorno no answer.json
function save(message) {
   fs.writeFile('answer.json', JSON.stringify(message), res => {console.log('salvo no json')})
}

//chamada da função principal
main();
