import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Content, Heading, Link } from '@adobe/react-spectrum';

function Home() {

    const navigate = useNavigate();

    return (
        <Content width="calc(100% - size-1000)">
            <Heading level={3}>Cert-CSI UX</Heading>
            <p>This App wraps the Dell Cert-CSI Tooling allowing you to run the <code>certify</code> function with a provided YAML</p>
            <p>For more about Dell Cert-CSI, see <a href="https://dell.github.io/csm-docs/docs/tooling/cert-csi/" target="_blank">here</a></p>
            <Heading level={3}>Good Luck!</Heading>
        </Content>
    )
}


export default Home;