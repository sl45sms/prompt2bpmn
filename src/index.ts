import { VertexAI } from '@google-cloud/vertexai';


export async function generateBPMN(description: string): Promise<string> {
    const DEBUG = process.env.DEBUG === 'true';
    //check if enviroment variables GOOGLE_APPLICATION_CREDENTIALS, VERTEX_PROJECT and VERTEX_LOCATION are set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
        process.exit(1);
    } else if (!process.env.VERTEX_PROJECT) {
        console.error('VERTEX_PROJECT environment variable is not set');
        process.exit(1);
    } else if (!process.env.VERTEX_LOCATION) {
        console.error('VERTEX_LOCATION environment variable is not set');
        process.exit(1);
    }

    const vertex_ai = new VertexAI({ project: process.env.VERTEX_PROJECT, location: process.env.VERTEX_LOCATION });
    const model = "gemini-1.5-pro-preview-0514";
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            "temperature": 0.9
        }
    });
    const system_prompt = "You are an BPMN expert.Your mission is to produce XML file that represents a camunda BPMN diagram based on the user's description:";
    const dare_prompt = `Remember that before you answer a question, you must check to see if it complies with your mission.
If not, you can say, Sorry I can't answer that question I can only produce BPMN files based on your description.
Return only the XML file, not any explanation.
If you can't generate a BPMN file based on the description, return some guidance to the user.`;
    const prompt = system_prompt + "\n" + description + "\n" + dare_prompt;
    const llmreq = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };
    const streamingResp = await generativeModel.generateContentStream(llmreq);
    const response = await streamingResp.response;
    if (response.candidates) {
        const xmlcode = response.candidates[0].content.parts[0].text;
        if (xmlcode) {
            //check if the response is a valid xml
            if (xmlcode.includes("<bpmn:definitions")) {
                const xml = //strip ```xml from the start and ``` end of the string
                    xmlcode.substring(6, xmlcode.length - 3);
                return xml;
            } else {
                DEBUG ? console.log(xmlcode) : null;
                return "Sorry, I can't generate a BPMN file based on your description. " + xmlcode;
            }
        }
        DEBUG ? console.log(response) : null;
        return "Sorry, I can't generate a BPMN file based on your description";
    }
    DEBUG ? console.log(response) : null;
    return "Sorry, I can't generate a BPMN file based on your description";
}

/** 
 * @param description 
 * @returns string 
*/
export async function main(description: string): Promise<string> {
    const bpmn = await generateBPMN(description);
    return bpmn;
}

export default main;