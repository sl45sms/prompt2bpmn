import prompt2bpmn from '../src/index';

const test = async () => {
    try {
        const bpmn = await prompt2bpmn("Create a BPMN diagram that represents a process for a user to sign up for a newsletter");
        return bpmn;
    }
    catch (error) {
        console.error(error);
    }
}

test().then((bpmn) => { console.log('XML', bpmn); });