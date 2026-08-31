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


// Import das dependências para criar a API
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Import da biblioteca MQTT
const mqtt = require('mqtt')

// Criando um cliente para se comunicar com o servidor MQTT
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com')

// Criando um objeto para manipular dados do body em formato JSON
const bodyParserJSON = bodyParser.json()

// Criando um objeto para manipular o Express
const app = express()


// ============================================================================
// CORS
// ============================================================================

const corsOptions = {

    // Permite requisições de qualquer origem
    origin: '*',

    // Métodos HTTP permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // Cabeçalhos permitidos
    allowedHeaders: ['Content-Type', 'Authorization']
}

// Configura as permissões do CORS
app.use(cors(corsOptions))


// ============================================================================
// ROTA DE TESTE
// ============================================================================

app.get('/', function(request, response) {

    response.status(200)

    response.json({
        message: 'API funcionando!'
    })

})


// ============================================================================
// ROTA DO LED
// ============================================================================

app.post('/v1/iot/led', bodyParserJSON, function(request, response) {

    // Recebe os dados enviados pelo front-end
    let dadosBody = request.body

    console.log('Comando recebido pela API:', dadosBody)


    // Verifica se o comando é para ligar
    if (dadosBody.comando === 'ligar') {

        mqttClient.publish(
            'senaijandira/sala/manha/8',
            'ligar'
        )

        console.log('MQTT: comando LIGAR enviado')

    }

    // Verifica se o comando é para desligar
    else if (dadosBody.comando === 'desligar') {

        mqttClient.publish(
            'senaijandira/sala/manha/8',
            'desligar'
        )

        console.log('MQTT: comando DESLIGAR enviado')

    }

    // Caso o comando seja inválido
    else {

        return response.status(400).json({
            message: 'Comando inválido'
        })

    }


    // Retorna uma resposta para o front-end
    response.status(200)

    response.json({
        message: 'Comando enviado com sucesso'
    })

})


// ============================================================================
// MQTT
// ============================================================================

// Quando conectar ao HiveMQ
mqttClient.on('connect', function() {

    console.log('MQTT conectado com sucesso!')

})

// Caso aconteça algum erro
mqttClient.on('error', function(erro) {

    console.error('Erro na conexão MQTT:', erro)

})


// ============================================================================
// SERVIDOR
// ============================================================================

// O Render fornece a porta através da variável PORT
const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', function() {

    console.log(`API funcionando na porta ${PORT}`)

})