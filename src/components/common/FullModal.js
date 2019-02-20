import React from 'react';
import { Modal } from 'react-native';

const FullModal = ({children,visible}) => {
    return (
        <Modal
            animationType="slide"
            onRequestClose={() => {}}
            transparent
            visible={visible}
        >
            {children}
        </Modal>
    )
};

export { FullModal }