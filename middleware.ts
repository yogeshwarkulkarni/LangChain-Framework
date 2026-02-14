import { createAgent, createMiddleware, tool } from 'langchain';
import 'dotenv/config';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';
import { ConfigurableModel, initChatModel } from 'langchain/chat_models/universal';
import { ChatOpenAI } from '@langchain/openai';

const systemPrompt = `You are a helpful assistant that provides the weather information based on user location. You can use the tool get_user_location to retreive the user location based on user id. The user id is provided in the context of the tool. `;

const getWeatherLocation = tool((_, config) => {
    const user_id = config.context.user_id;

    return user_id === '1234' ? 'New York' : 'SFO';
}, {
    name: "get_user_location",
    description: 'Retreive the user location based on user id',
    schema: z.object({
    })
});

const config = {

    context: { user_id: '1234' },
    configurable: { thread_id: '1234' }
}

const qaconfig = {

    context: { user_id: '1234' },
    configurable: { thread_id: '2222' }
}
const basicModel = new ChatOpenAI(
    {

        model: "gpt-4o-mini"
    }
)

const advanceModel = await initChatModel(
    "claude-sonnet-4-5-20250929",
    {

        temperature: 0.7, timeout: 30, maxTokens: 1000
    }
)

const dynamicModelSelection = createMiddleware({
    name: "DynamicModelSelection",
    wrapModelCall: (request, handler) => {
        const messageCount = request.messages.length;
        return handler({
            ...request,
            model: messageCount > 3 ? advanceModel : basicModel
        });
    }
});



const checkMemory = new MemorySaver();

const agent = createAgent(
    {
        model: 'claude-sonnet-4-5-20250929',
        tools: [getWeatherLocation],
        systemPrompt,
        checkpointer: checkMemory,
        middleware: [dynamicModelSelection]
    }
);


const response1 = await agent.invoke(
    {
        //messages: [{ role: 'user', content: 'WHAT IS THE WEATHER OF NEW YORK?' }]
        messages: [{ role: 'user', content: 'What is weather outside?' }]
    }, config);
console.log(response1);
const response2 = await agent.invoke(
    {
        //messages: [{ role: 'user', content: 'WHAT IS THE WEATHER OF NEW YORK?' }]
        messages: [{ role: 'user', content: 'Suggest me a good restaurant in this location?' }]
    }, config);

console.log(response2);
const response3 = await agent.invoke(
    {
        //messages: [{ role: 'user', content: 'WHAT IS THE WEATHER OF NEW YORK?' }]
        messages: [{ role: 'user', content: 'Suggest me a good restaurant in this location?' }]
    }, qaconfig);
console.log(response3);