import {PubsubManager} from './PubSubManager'

setInterval(()=>{
    PubsubManager.getInstance().userSubscribe(Math.random().toString(), 'AAPL');
}, 5000);