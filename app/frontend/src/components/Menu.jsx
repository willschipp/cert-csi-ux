import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Content,ListBox,Item,Heading } from '@adobe/react-spectrum';

function Menu() {

    const navigate = useNavigate();    

    const handleNavigation = (selected) => {
        var selection = [...selected][0];
        if (selection === 'certify') {
            navigate('/certify');
        } else {
            navigate('/');
        }
    }

    return (
        <Content margin="size-200">
            <Heading level={3}>
                Menu
            </Heading>
            <ListBox
                aria-label="Menu"
                selectionMode="single"
                onSelectionChange={handleNavigation}>
                <Item key="home">Home</Item>
                <Item key="certify">Certify</Item>
            </ListBox>
        </Content>
    )
}


export default Menu;