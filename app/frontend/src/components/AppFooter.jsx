import React from 'react';

import packageJson from '../../package.json';

import { Content,Footer } from '@adobe/react-spectrum';

function AppFooter() {

    return (
        <Content margin="size-200">
            <Footer>
                v{packageJson.version}
            </Footer>
        </Content>
    )
}

export default AppFooter;