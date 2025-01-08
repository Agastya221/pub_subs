import { createClient, RedisClientType } from "redis";

export class PubsubManager {
    private static instance: PubsubManager;
    private redisClient: RedisClientType;
    private Subscriptions: Map<string, string[]>

    private constructor() {
        this.redisClient  = createClient();
        this.redisClient.connect();
        this.Subscriptions = new Map();
        
    }


    public static getInstance(): PubsubManager{
        if(!PubsubManager.instance){
            PubsubManager.instance = new PubsubManager();
        }
        return PubsubManager.instance;

    }
    
    public userSubscribe(userId:string,  stock: string){
        if(this.Subscriptions.has(stock)){
            this.Subscriptions.set(stock, [])
        }
        this.Subscriptions.get(stock)?.push(userId);

        if(this.Subscriptions.get(stock)?.length === 1){
            this.redisClient.subscribe(stock, (message) => {
                this.handleMessage(stock, message);
            });
        } 
        console.log(`Subscribed to Redis channel: ${stock}`);
    }

    public userUnsubscribe(userId: string, stock: string){
        this.Subscriptions.set(stock, this.Subscriptions.get(stock)?.filter((sub)=> sub  !== userId) || []);
        if(this.Subscriptions.get(stock)?.length === 0){
            this.redisClient.unsubscribe(stock);
            console.log(`Unsubscribed from Redis channel: ${stock}`);
        }
   
    }

    private handleMessage(stock: string, message: string){
        console.log(`Message received on channel ${stock}: ${message}`);
        this.Subscriptions.get(stock)?.forEach((sub)=>{
            console.log(`Sending message to user ${sub}`);
        })
    }


    public async disconnect(){
        await this.redisClient.quit();
    }

    



    
}