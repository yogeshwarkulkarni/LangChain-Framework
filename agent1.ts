import { createAgent, tool } from 'langchain';
import 'dotenv/config';
import { z } from 'zod';




const getWeather = tool((input) => {
    return `Its sunny and ${input.city} `;
}, {
    name: 'getWeather',
    description: 'Get the current weather for a given city',
    schema: z.object({
        city: z.string()

    })
});


const getTime = tool((input) => {
    return `Its sunny and ${input.city} is 12:00 PM `;
}, {
    name: 'getTime',
    description: 'Get the current time for a given city',
    schema: z.object({
        city: z.string()

    })
});

const agent = createAgent(
    {
        model: 'claude-sonnet-4-5-20250929',
        tools: [getWeather, getTime]
    }

);


const response = await agent.invoke(
    {
        //messages: [{ role: 'user', content: 'WHAT IS THE WEATHER OF NEW YORK?' }]
        messages: [{ role: 'user', content: 'WHAT IS THE time OF NEW YORK?' }]
    });
console.log(response);



