import React from 'react';

import { Content, Header, Heading } from '@adobe/react-spectrum';

import Browse from '@spectrum-icons/workflow/Browse';

function AppHeader() {

    return (
        <Content margin="size-200">
            <Header>
                <Heading level={2}>
                    <Browse/>
                    &nbsp;
                    pgBench Web UI
                </Heading>
            </Header>
        </Content>
    )
}

export default AppHeader;