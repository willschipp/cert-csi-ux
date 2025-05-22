import { useState } from 'react';

import { Form, TextArea, TextField, Button, ProgressCircle, Content, View, Well  } from '@adobe/react-spectrum';

function Certify() {

    const [data,setData] = useState([]);
    const [snapClass,setSnapClass] = useState([]);
    const [config_text,setConfigText] = useState([]);    
    const [k8s_config,setK8sCpmfog] = useState([]);

    const [loading, setLoading] = useState(false); 
    const [response,setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('snapClass',snapClass);
        formData.append('k8s_config',k8s_config);
        formData.append('config_yaml',config_text);
        
        try {
            const reply = await fetch('/api/certify',{
                method: 'POST',
                body: formData});
            const result = await reply.json();
            setResponse(result)
        } catch (error) {
            console.log("there's a problem");
            console.error(error);
        } finally {
            setLoading(false);
        }  
         
        return false; //blocker        
    }

    return (
        <Content width="calc(100% - size-1000)">
            <Form onSubmit={handleSubmit}>
                <TextField label="Volume Snapshot Class (e.g. vxflexos-snapclass)" isRequired={true} value={snapClass} onChange={setSnapClass}/>
                <TextArea label="Copy & Paste your Kubernetes config file here" isRequired={true} value={k8s_config} onChange={setK8sCpmfog} height="size-3000"/>
                <TextArea label="Copy & Paste your storage config file here" isRequired={true} value={config_text} onChange={setConfigText} height="size-3000"/>
                <Button type="submit" maxWidth="size-1000">Run</Button>
            </Form>
            {loading && (
                <View marginTop="size-200" alignSelf="center">
                    <ProgressCircle
                        aria-label="Loading…"
                        isIndeterminate
                        size="L"
                    />
                </View>
            )}            
            <View>
                <Well marginTop="size-100">
                    <pre style={{
                        whiteSpace:'pre-wrap',
                        margin: 0,
                        fontFamily: 'monospace',
                        maxHeight: '500px',
                        overflow: 'auto'
                    }}>
                        {typeof response === 'string' ? details : JSON.stringify(response,null,2)}
                    </pre>
                </Well>
            </View>              
        </Content>
    )
}

export default Certify;