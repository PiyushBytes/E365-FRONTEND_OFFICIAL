import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 h-96 bg-gray-900 border border-gray-700 rounded-xl shadow-lg flex flex-col">
          <div className="p-3 border-b border-gray-700 font-semibold">
            E365 Assistant
          </div>

          <div className="flex-1 p-3 text-sm text-gray-400 overflow-y-auto">
            👋 Hi! I can help you plan your event.
          </div>

          <div className="p-3 border-t border-gray-700">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-sm outline-none"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="bg-white text-black px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        Chat
      </button>
    </div>
  );
}
