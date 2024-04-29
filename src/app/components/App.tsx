import React from 'react';
import '../styles/ui.css';

function App() {
  const [data, setData] = React.useState<any>({});
  const onCreate = () => {
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', count: 0 } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;

      if (type === 'return-local-variables') {
        setData(message);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button id="create" onClick={onCreate}>
        Create
      </button>

      <textarea
        style={{
          flex: 1,
        }}
        id="data"
        value={JSON.stringify(data, null, 2)}
      />
    </div>
  );
}

export default App;
