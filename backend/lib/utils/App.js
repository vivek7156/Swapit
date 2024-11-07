import React, { useState } from 'react';
import Chat from './chat';

const App = () => {
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [messages, setMessages] = useState([]);

    return (
        <div>
            <h1>Marketplace</h1>
            <Chat buyerId="buyer123" sellerId="seller123" itemId="item123" />
        </div>
    );
};

export default App;
