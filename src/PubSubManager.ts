import { createClient, RedisClientType } from "redis";

class PubsubManager {
    private static instance: PubsubManager;
    private redisClient: RedisClientType;
    private Subscriber = Map<string, string[]>

    private constructor() {
        this.redisClient  = createClient();
        this.redisClient.connect();
        this.Subscriber = new Map();
        
    }

    public static getInstance(): PubsubManager{
        if(!PubsubManager.instance){
            PubsubManager.instance = new PubsubManager();
        }
        return PubsubManager.instance;

    }


}