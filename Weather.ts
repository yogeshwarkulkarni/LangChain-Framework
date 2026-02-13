import { context, createAgent, tool } from 'langchain';
import 'dotenv/config';
import { z } from 'zod';

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
}
const agent = createAgent(
    {
        model: 'claude-sonnet-4-5-20250929',
        tools: [getWeatherLocation],
        systemPrompt
    }

);


const response = await agent.invoke(
    {
        //messages: [{ role: 'user', content: 'WHAT IS THE WEATHER OF NEW YORK?' }]
        messages: [{ role: 'user', content: 'What is weather outside?' }]
    }, config);
console.log(response);