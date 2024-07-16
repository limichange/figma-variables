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
        setData(JSON.stringify(message, null, 2));
      } else if (type === 'return-tailwind-classes') {
        setData(message);

        // copy to clipboard
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button
        id="clear"
        onClick={() => {
          parent.postMessage({ pluginMessage: { type: 'get-tailwind-classes', count: 0 } }, '*');
        }}
      >
        Get current frame tailwind classes
      </button>

      <button id="create" onClick={onCreate}>
        Get all variables
      </button>

      <textarea
        style={{
          flex: 1,
        }}
        id="data"
        value={data}
      />
    </div>
  );
}

export default App;
