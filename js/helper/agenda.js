
import Agenda from 'agenda'
import mongoClient from 'mongodb';
// const dbRPG = 'mongodb://127.0.0.1:27017';
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';
// const MongoClient = new mongoClient.MongoClient;
const agenda = new Agenda({ db: { address: mongoConnectionString } });

function setAgenda() {
    
}

export default agenda;