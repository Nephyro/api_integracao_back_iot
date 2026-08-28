/********************************************************************************
 * Objetivo: Arquivo responsável pela comunicação entre a API e o equipamento IoT via MQTT
 * Data: 28/08/2026
 * Autor: Anderson Ribeiro
 * Versão: 1.0
 *
 * Instalação do EXPRESS - npm install express --save
 *       Dependencia responsável pela utilização do protocolo HTTP para
 *       criar uma API
 * 
 * Instalação do CORS    - npm install cors --save
 *       Dependencia responsável pelas configurações a serem realizadas
 *       para a permissão de acesso da API
 *
 * Instalação do BODY PARSER - npm install bordy-parser --save
 *       Dependência responsável por realizar a interpretação (parsing)
 *       dos dados recebidos no corpo (body) das requisições HTTP,
 *       permitindo manipulá-los em formato JSON
 * 
 * Instalação do MQTT      - npm install mqtt --save
 *      Dependência responsável por implementar o protocolo MQTT 
 *      (Message Queuing Telemetry Transport), permitindo a comunicação 
 *      leve baseada em publish/subscribe ideal para projetos de IoT e 
 *      dispositivos conectados.
 *
 ********************************************************************************/


// Import das depedencias para criar a API
const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')

// Para criar a comunicação entre a API e o equipamento IoT, é necessário instalar
// a dependência mqtt => npm install mqtt --save
// Import da biblioteca após a instalação
const mqtt = require('mqtt')
// Criando um cliente para se comunicar com o servidor MQTT
// através do protocolo mqtt
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com')

// Criando um objeto para manipular dados do body da API em formato JSON
const bodyParserJSON = bodyParser.json()

// Criando um objeto para manipular o express
const app = express()

// Conjunto de permissões a serem aplicadas no CORS da API
const corsOptions = {
    origin: ['*'], //A origem da requisição, podendo um IP ou *(Todos)
    methods: 'GET, POST, PUT, DELETE, OPTIONS', //São os verbos que serão liberados na API (GET, POST, PUT e DELET)
    allowedHeaders: ['Content-type', 'Autorization'] //São permissões de cabeçalho do CORS
}

// Configura as permissões da API atráves do CORS
app.use(cors(corsOptions))

// Configura a API para receber dados em formato JSON
app.post('/v1/iot/led', bodyParserJSON, async function (request, response) {
    // Recebe os dados do body da requisição
    let dadosBody = request.body

    if (dadosBody.comando === 'ligar')
        mqttClient.publish('senaijandira/sala/manha/8', 'ligar')
    else if(dadosBody.comando === 'desligar')
        mqttClient.publish('senaijandira/sala/manha/8', 'desligar')

    // Retorna uma resposta para o cliente
    response.status(200);
    response.json({"message": 'Comando enviado com sucesso'})
})

// Serve para inicializar a API para receber requisições
app.listen(8080, function(){
    console.log('API funcionando e aguardando novas requisições...')
})