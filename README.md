# promt2bpmn
prompt to BPMN 2 diagram nodejs module

# description
This module allows you to generate a BPMN 2 diagram from a prompt using the Vertex AI API from Google Cloud.

Returns a string with the BPMN 2 diagram, or some guidelines if the prompt is not enough to generate the diagram.

# prerequisites
You have to set the enviroment variables:
```
GOOGLE_APPLICATION_CREDENTIALS = path to the json file with the credentials
VERTEX_PROJECT = project id
VERTEX_LOCATION = location
```

# usage example
```javascript
const { promptToBpmn } = require('prompt2bpmn');

async function generateBpmn() {
    try {
        // Set environment variables
        process.env.GOOGLE_APPLICATION_CREDENTIALS = '/path/to/credentials.json';
        process.env.VERTEX_PROJECT = 'your-project-id';
        process.env.VERTEX_LOCATION = 'your-location';

        // Call promptToBpmn function
        const bpmn = await promptToBpmn('Enter your prompt here');

        // Print the generated BPMN diagram
        console.log(bpmn);
    } catch (error) {
        console.error('Error:', error);
    }
}

generateBpmn();
```


