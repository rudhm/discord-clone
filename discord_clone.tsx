import React, { useState, useRef, useEffect } from 'react';
import Login from './src/Login.jsx';
import { 
  Hash, Volume2, Settings, Plus, Mic, Headphones, 
  Search, Bell, Pin, Users, Inbox, HelpCircle, 
  Gift, Sticker, Smile, Send, ChevronDown, UserPlus,
  Compass, Download, Reply, MoreHorizontal, Pencil, Trash2,
  Loader2, LogOut
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, where
} from "firebase/firestore";

// --- FIREBASE CONFIG ---
const getFirebaseConfig = () => ({
  apiKey: "AIzaSyDdXm0VzCKyqEuxhfisXPpFyMIDoI7SC1w",
  authDomain: "discord-cc57e.firebaseapp.com",
  projectId: "discord-cc57e",
  storageBucket: "discord-cc57e.firebasestorage.app",
  messagingSenderId: "780791940090",
  appId: "1:780791940090:web:cd8bc03bc4ec6ce8625a43"
});

const firebaseApp = initializeApp(getFirebaseConfig());
const db = getFirestore(firebaseApp);

const currentUser = {
  id: 'u1',
  name: 'wifey 🤍',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PersonB&backgroundColor=c0aede',
  status: 'online'
};

const mockUsers = [
  { id: 'u2', name: 'rudh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PersonA&backgroundColor=ffdfbf', status: 'online' }
];

const initialData = {
  servers: [
    {
      id: 's1',
      name: 'rise together',
      icon: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=128&h=128&fit=crop',
      unread: false,
      channels: [
        { id: 'c1', name: 'general-chat', type: 'text' },
        { id: 'c2', name: 'study-links', type: 'text' }
      ]
    }
  ]
};

export default function DiscordClone() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeServerId, setActiveServerId] = useState(initialData.servers[0].id);
  const [activeChannelId, setActiveChannelId] = useState(initialData.servers[0].channels[0].id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // --- FIREBASE: FETCH MESSAGES REAL-TIME ---
  useEffect(() => {
    if (!isLoggedIn) return;

    const q = query(
      collection(db, "messages"),
      where("channelId", "==", activeChannelId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamp to ISO for easier formatting
        timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeChannelId, isLoggedIn]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeServer = initialData.servers.find(s => s.id === activeServerId) || initialData.servers[0];
  const activeChannel = activeServer.channels.find(c => c.id === activeChannelId) || activeServer.channels[0];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setIsLoggingOut(false);
    }, 1200);
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      try {
        await addDoc(collection(db, "messages"), {
          channelId: activeChannelId,
          authorId: currentUser.id,
          text: newMessage,
          timestamp: serverTimestamp()
        });
        setNewMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleEditMessage = async () => {
    if (!editMessageText.trim()) return;
    try {
      const msgRef = doc(db, "messages", editingMessageId);
      await updateDoc(msgRef, {
        text: editMessageText
      });
      setEditingMessageId(null);
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      setContextMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && messages.length > 0) {
      setIsLoading(true);
    } else if (scrollTop > 0 && isLoading) {
      setIsLoading(false);
    }
  };

  // Helper component for tooltips
  const Tooltip = ({ children, text }) => (
    <div className="group relative flex justify-center mb-2">
      {children}
      <div className="absolute left-14 bg-black text-white text-sm px-2 py-1 rounded font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none scale-95 group-hover:scale-100 origin-left">
        {text}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="fixed inset-0 flex h-screen w-screen bg-[#1e1f22] text-left text-[#dbdee1] font-sans overflow-hidden">
      
      {/* --- SERVER SIDEBAR --- */}
      <div className="w-[72px] bg-[#1e1f22] shrink-0 flex flex-col items-center py-3 z-20">
        
        <Tooltip text="Direct Messages">
          <div className="relative group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#5865f2] rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#dbdee1] hover:text-white">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor">
              <path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0C8.48074 0.318799 6.67795 0.88575 4.96746 1.68266C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.397 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3086 20C22.6743 19.2743 24.8995 18.1418 26.8894 16.652C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0072 8.34973 18.3161 8.34973C19.625 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.625 13.6383 18.3161 13.6383Z" />
            </svg>
          </div>
        </Tooltip>

        <div className="w-8 h-0.5 bg-[#3f4147] rounded-full my-2"></div>

        {initialData.servers.map(server => (
          <Tooltip key={server.id} text={server.name}>
            <div className="relative flex items-center justify-center w-full group cursor-pointer" onClick={() => {
              setActiveServerId(server.id);
              setActiveChannelId(initialData.servers.find(s=>s.id===server.id).channels[0].id);
            }}>
              <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 origin-left
                ${activeServerId === server.id ? 'h-10 scale-100' : 
                  server.unread ? 'h-2 scale-100 group-hover:h-5' : 
                  'h-2 scale-0 group-hover:scale-100 group-hover:h-5'}
              `}></div>
              <img 
                src={server.icon} 
                alt={server.name} 
                className={`w-12 h-12 transition-all duration-300 bg-[#313338]
                  ${activeServerId === server.id ? 'rounded-[16px]' : 'rounded-[24px] group-hover:rounded-[16px]'}
                `} 
              />
            </div>
          </Tooltip>
        ))}

        <Tooltip text="Add a Server">
          <div className="group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#23a559] rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559] hover:text-white mb-2">
            <Plus size={24} />
          </div>
        </Tooltip>
        
        <Tooltip text="Explore Discoverable Servers">
          <div className="group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#23a559] rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559] hover:text-white">
            <Compass size={24} />
          </div>
        </Tooltip>

        <div className="mt-auto mb-2 flex flex-col items-center gap-2">
           <div className="w-8 h-0.5 bg-[#3f4147] rounded-full"></div>
           <Tooltip text="Download Apps">
             <div className="group cursor-pointer w-12 h-12 mt-1 hover:bg-[#313338] rounded-[24px] hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559]">
                <Download size={24} />
             </div>
           </Tooltip>
        </div>
      </div>

      {/* --- CHANNELS SIDEBAR --- */}
      <div className="w-[240px] bg-[#2b2d31] shrink-0 flex flex-col z-10">
        <div className="h-12 border-b border-[#1f2023] shadow-sm flex items-center justify-between px-4 hover:bg-[#35373c] cursor-pointer transition-colors">
          <div className="flex-1 min-w-0 truncate text-[15px] font-semibold leading-none text-[#f2f3f5]" title={activeServer.name}>
            {activeServer.name}
          </div>
          <ChevronDown size={18} className="text-[#dbdee1]" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 mt-2">
          {activeServer.channels.map(channel => (
            <div 
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={`flex items-center px-2 py-1.5 mb-0.5 rounded cursor-pointer group transition-colors
                ${activeChannelId === channel.id ? 'bg-[#404249] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'}
              `}
            >
              {channel.type === 'text' ? <Hash size={20} className="mr-1.5 opacity-70" /> : <Volume2 size={20} className="mr-1.5 opacity-70" />}
              <span className="font-medium truncate">{channel.name}</span>
              
              {channel.type === 'text' && activeChannelId !== channel.id && (
                 <div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <UserPlus size={16} className="hover:text-white" />
                 </div>
              )}
            </div>
          ))}
        </div>

        <div className="h-[52px] bg-[#232428] flex items-center px-2 shrink-0 mt-auto">
          <div className="flex items-center hover:bg-[#3f4147] p-1 -ml-1 rounded cursor-pointer transition-colors flex-1 min-w-0 mr-1 group">
            <div className="relative">
              <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23a559] border-2 border-[#232428] rounded-full group-hover:border-[#3f4147] transition-colors"></div>
            </div>
            <div className="ml-2 truncate">
              <div className="text-sm font-semibold text-[#f2f3f5] leading-tight truncate">{currentUser.name}</div>
              <div className="text-[11px] text-[#b5bac1] leading-tight truncate">Online</div>
            </div>
          </div>
          
          <div className="flex items-center text-[#b5bac1]">
            <button className="p-1.5 hover:bg-[#3f4147] rounded hover:text-[#dbdee1] transition-colors"><Mic size={18} /></button>
            <button className="p-1.5 hover:bg-[#3f4147] rounded hover:text-[#dbdee1] transition-colors"><Headphones size={18} /></button>
            <button className="p-1.5 hover:bg-[#3f4147] rounded hover:text-[#dbdee1] transition-colors"><Settings size={18} /></button>
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut} 
              className="p-1.5 hover:bg-[#3b3d44] hover:text-[#f23f43] rounded transition-colors disabled:opacity-50" 
              title="Log Out"
            >
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 bg-[#313338] flex flex-col items-stretch min-w-0">
        <div className="h-12 border-b border-[#1f2023] shadow-sm flex items-center px-4 shrink-0">
          <Hash size={24} className="text-[#80848e] mr-2" />
          <h2 className="font-bold text-[#f2f3f5] mr-4">{activeChannel.name}</h2>
          
          <div className="ml-auto flex items-center text-[#b5bac1] gap-4">
             <button className="hover:text-[#dbdee1]"><Search size={20} /></button>
             <button className="hover:text-[#dbdee1]"><Inbox size={20} /></button>
             <button className="hover:text-[#dbdee1]"><HelpCircle size={20} /></button>
          </div>
        </div>

        <div 
          className="flex-1 w-full overflow-y-auto custom-scrollbar px-4 pt-4 pb-2 text-left flex flex-col items-stretch"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {isLoading && (
            <div className="flex justify-center py-4 shrink-0">
              <Loader2 className="animate-spin text-[#949ba4]" size={24} />
            </div>
          )}
          {messages.map((msg, index) => {
            const author = mockUsers.find(u => u.id === msg.authorId) || currentUser;
            const prevMsg = index > 0 ? messages[index-1] : null;
            const msgDate = new Date(msg.timestamp);
            const prevDate = prevMsg ? new Date(prevMsg.timestamp) : null;
            const showDateDivider = index === 0 || msgDate.getDate() !== prevDate?.getDate();
            const isConsecutive = !showDateDivider && prevMsg && prevMsg.authorId === msg.authorId && 
                                  (msgDate - prevDate < 300000); 
            const timeString = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <React.Fragment key={msg.id}>
                {showDateDivider && (
                  <div className="flex items-center mt-6 mb-2 mx-4 pointer-events-none select-none">
                    <div className="flex-1 h-px bg-[#3f4147]"></div>
                    <span className="px-3 text-[11px] font-semibold text-[#949ba4] uppercase tracking-wider">
                      {msgDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex-1 h-px bg-[#3f4147]"></div>
                  </div>
                )}

                <div 
                  className={`flex w-full items-start self-stretch group hover:bg-[#2e3035] -mx-4 px-4 py-0.5 relative text-left ${isConsecutive ? 'mt-0' : 'mt-4'}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({ x: e.clientX, y: e.clientY, message: msg });
                  }}
                >
                  <div className="absolute top-0 right-4 -mt-3.5 bg-[#313338] border border-[#1e1f22] rounded shadow-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 overflow-hidden">
                    <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="Add Reaction"><Smile size={18} /></button>
                    <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="Reply"><Reply size={18} /></button>
                    <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="More"><MoreHorizontal size={18} /></button>
                  </div>

                  {isConsecutive ? (
                     <div className="w-10 shrink-0 text-center opacity-0 group-hover:opacity-100 flex items-center justify-center pt-1">
                       <span className="text-[10px] text-gray-400">{timeString}</span>
                     </div>
                  ) : (
                    <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 shrink-0 bg-gray-700" />
                  )}
                  
                  <div className="ml-2 flex flex-1 min-w-0 w-full flex-col text-left">
                    {!isConsecutive && (
                      <div className="flex items-baseline mb-0">
                        <span className="font-medium text-[#f2f3f5] mr-2 hover:underline cursor-pointer">{author.name}</span>
                        <span className="text-xs text-[#949ba4]">{timeString}</span>
                      </div>
                    )}
                    
                    {editingMessageId === msg.id ? (
                      <div className="mt-1 mb-1 pr-12">
                        <div className="bg-[#383a40] rounded-lg flex flex-col px-3 py-2 w-full">
                          <input
                            type="text"
                            value={editMessageText}
                            onChange={(e) => setEditMessageText(e.target.value)}
                            className="bg-transparent outline-none text-[#dbdee1] w-full text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditMessage();
                              else if (e.key === 'Escape') setEditingMessageId(null);
                            }}
                          />
                        </div>
                        <div className="text-xs text-[#949ba4] mt-1">
                          escape to <span className="text-[#00a8fc] cursor-pointer hover:underline" onClick={() => setEditingMessageId(null)}>cancel</span> • enter to <span className="text-[#00a8fc] cursor-pointer hover:underline" onClick={handleEditMessage}>save</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-left text-[#dbdee1] leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                        {msg.image && (
                          <div className="mt-2 relative inline-block">
                            <img src={msg.image} alt="attachment" className="max-w-sm max-h-[350px] object-cover rounded-lg border border-[#1e1f22] cursor-pointer hover:opacity-95" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 pb-6 pt-2 shrink-0">
          <div className="bg-[#383a40] rounded-lg flex items-center px-4 py-2.5">
            <button className="text-[#b5bac1] hover:text-[#dbdee1] mr-4"><Plus size={24} className="bg-[#4e5058] rounded-full p-1" /></button>
            <input 
              type="text" 
              placeholder={`Message #${activeChannel.name}`}
              className="bg-transparent outline-none flex-1 text-[#dbdee1] placeholder-[#949ba4]"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleSendMessage}
            />
            <div className="flex items-center text-[#b5bac1] gap-3 ml-2">
              <button className="hover:text-[#dbdee1]"><Gift size={20} /></button>
              <button className="hover:text-[#dbdee1]"><Sticker size={20} /></button>
              <button className="hover:text-[#dbdee1]"><Smile size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div 
          className="fixed bg-[#111214] border border-[#1e1f22] shadow-xl rounded w-48 py-1.5 z-50 text-[#b5bac1] text-sm font-medium"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 hover:bg-[#4752c4] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded-sm group transition-colors"
               onClick={() => { setEditingMessageId(contextMenu.message.id); setEditMessageText(contextMenu.message.text); setContextMenu(null); }}>
            <span>Edit Message</span>
            <Pencil size={14} className="opacity-80 group-hover:opacity-100" />
          </div>
          <div className="px-3 py-1.5 hover:bg-[#4752c4] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded-sm group transition-colors">
            <span>Reply</span>
            <Reply size={14} className="opacity-80 group-hover:opacity-100" />
          </div>
          <div className="h-px bg-[#2b2d31] my-1 mx-2"></div>
          <div className="px-3 py-1.5 hover:bg-[#da373c] text-[#f23f43] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded-sm group transition-colors"
               onClick={() => handleDeleteMessage(contextMenu.message.id)}>
            <span>Delete Message</span>
            <Trash2 size={14} className="opacity-80 group-hover:opacity-100" />
          </div>
        </div>
      )}

      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-[#111214]/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-300">
          <Loader2 className="animate-spin text-[#5865F2] mb-4" size={48} />
          <h2 className="text-[#f2f3f5] font-semibold text-xl">Logging out...</h2>
          <p className="text-[#949ba4] mt-2">See you next time!</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #2b2d31; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1b1e; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #111214; }
      `}} />
    </div>
  );
}
