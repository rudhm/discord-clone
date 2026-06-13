import React, { useState, useRef, useEffect } from 'react';
import Login from './src/Login.jsx';
import { 
  Hash, Volume2, Settings, Plus, Mic, Headphones, 
  Search, Bell, Pin, Users, Inbox, HelpCircle, 
  Gift, Sticker, Smile, Send, ChevronDown, UserPlus,
  Compass, Download, Reply, MoreHorizontal, Pencil, Trash2,
  Loader2, LogOut, RefreshCcw
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, serverTimestamp, doc, updateDoc, deleteDoc, where, writeBatch, setDoc, orderBy
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
  name: 'Hasii',
  avatar: '/Hasi.jpg',
  status: 'online'
};

const mockUsers = [
  { id: 'u2', name: 'Anirudh', avatar: '/Anirudh.jpg', status: 'online' }
];

const initialData = {
  servers: [
    {
      id: 's1',
      name: 'Rise togetherr',
      icon: 'https://wallpapers.com/images/hd/cool-discord-l6gjrz31q75hc2t4.jpg',
      unread: false,
      channels: [
        { id: 'c1', name: 'general-chat', type: 'text' },
        { id: 'c2', name: 'study-links', type: 'text' }
      ]
    }
  ]
};
// --- STATIC STUDY LINKS (YEARS OLD) ---
const STUDY_LINKS_MESSAGES = [
  { id: 'sl1', authorId: 'u2', text: "Found this amazing site https://www.khanacademy.org/", timestamp: "2019-10-12T14:20:00Z" },
  { id: 'sl2', authorId: 'u2', text: "Best YouTube channel for history and science explainers: https://thecrashcourse.com/", timestamp: "2020-04-05T11:15:00Z" },
  { id: 'sl3', authorId: 'u2', text: "If you need to memorize terms or formulas, use this: https://quizlet.com/", timestamp: "2021-01-20T16:45:00Z" },
  { id: 'sl4', authorId: 'u2', text: "For math and chemistry problem solving: https://www.wolframalpha.com/", timestamp: "2022-05-14T09:30:00Z" }
];

const STORY_MESSAGES = [
  { id: 'm1', authorId: 'u2', text: "yo\nwait\nWAIT", timestamp: "2026-05-19T23:52:00Z" },
  { id: 'm2', authorId: 'u1', text: "what", timestamp: "2026-05-19T23:52:10Z" },
  { id: 'm3', authorId: 'u2', text: "just got the confirmation email\ninterview\nin vizag\n29th may", timestamp: "2026-05-19T23:53:00Z" },
  { id: 'm4', authorId: 'u1', text: "WAIT WHAT", timestamp: "2026-05-19T23:53:30Z" },
  { id: 'm5', authorId: 'u2', text: "bro i read it like 4 times to make sure i wasn't hallucinating 💀", timestamp: "2026-05-19T23:54:00Z" },
  { id: 'm6', authorId: 'u1', text: "stopp 😭😭\nokay so\nwe're meeting", timestamp: "2026-05-19T23:54:30Z" },
  { id: 'm7', authorId: 'u2', text: "obviously\nlike that was never even a question lmao", timestamp: "2026-05-19T23:55:00Z" },
  { id: 'm8', authorId: 'u1', text: "i'm shaking rn ngl", timestamp: "2026-05-19T23:55:10Z" },
  { id: 'm9', authorId: 'u2', text: "same tbh\nlike the interview is whatever but the fact that i'll actually be in vizag...", timestamp: "2026-05-19T23:55:30Z" },
  { id: 'm10', authorId: 'u1', text: "don't make me cry it's 1am", timestamp: "2026-05-20T00:02:00Z" },
  { id: 'm11', authorId: 'u2', text: "😭 go sleep then", timestamp: "2026-05-20T00:02:15Z" },
  { id: 'm12', authorId: 'u1', text: "NO \nwhen are you coming", timestamp: "2026-05-20T00:02:30Z" },
  { id: 'm13', authorId: 'u2', text: "interview's 29th so probably coming 28th evening", timestamp: "2026-05-20T00:03:00Z" },
  { id: 'm14', authorId: 'u1', text: "okay okay so we have 28th night and 29th after the interview", timestamp: "2026-05-20T00:03:30Z" },
  { id: 'm15', authorId: 'u2', text: "yeah and maybe 30th too if i can push the return ticket\nhaven't booked yet", timestamp: "2026-05-20T00:04:00Z" },
  { id: 'm16', authorId: 'u1', text: "please push it", timestamp: "2026-05-20T00:04:15Z" },
  { id: 'm17', authorId: 'u2', text: "i'll try\n\nokay so 28th evening you reach vizag, then where do we even meet", timestamp: "2026-05-20T00:04:30Z" },
  { id: 'm18', authorId: 'u2', text: "yeah about that\ni was thinking...\ncan i just come to your place or", timestamp: "2026-05-20T00:06:00Z" },
  { id: 'm19', authorId: 'u1', text: "...", timestamp: "2026-05-20T00:07:00Z" },
  { id: 'm20', authorId: 'u2', text: "hey you still there", timestamp: "2026-05-20T00:08:00Z" },
  { id: 'm21', authorId: 'u1', text: "yeah sorry\njust thinking", timestamp: "2026-05-20T00:09:00Z" },
  { id: 'm22', authorId: 'u2', text: "we don't have to talk about it if you don't want to", timestamp: "2026-05-20T00:09:15Z" },
  { id: 'm23', authorId: 'u1', text: "no it's okay\ni just don't know if even the community gate area is possible rn\nmom wont allow i guess", timestamp: "2026-05-20T00:10:00Z" },
  { id: 'm24', authorId: 'u2', text: "ahh", timestamp: "2026-05-20T00:10:15Z" },
  { id: 'm25', authorId: 'u1', text: "yeah", timestamp: "2026-05-20T00:11:00Z" },
  { id: 'm26', authorId: 'u2', text: "honestly\ncan i say something without it being weird", timestamp: "2026-05-20T00:11:15Z" },
  { id: 'm27', authorId: 'u1', text: "yeah ofc", timestamp: "2026-05-20T00:11:30Z" },
  { id: 'm28', authorId: 'u2', text: "i really want to come to your house\nlike properly\nknock on the door, come inside, sit in your living room\ni've imagined it so many times", timestamp: "2026-05-20T00:12:00Z" },
  { id: 'm29', authorId: 'u1', text: "anirudh...", timestamp: "2026-05-20T00:12:15Z" },
  { id: 'm30', authorId: 'u2', text: "like that's all i want\nnot even anything big\njust sit there like a normal person who's meeting his girlfriend's family", timestamp: "2026-05-20T00:13:00Z" },
  { id: 'm31', authorId: 'u1', text: "i know", timestamp: "2026-05-20T00:13:15Z" },
  { id: 'm32', authorId: 'u2', text: "and i want to tell your mom\nlike just straight up tell her\nthat i'm here, that i care about you, that my intentions are right\ni'm not scared of that conversation, i actually want to have it", timestamp: "2026-05-20T00:14:00Z" },
  { id: 'm33', authorId: 'u1', text: "god i wish you could", timestamp: "2026-05-20T00:14:15Z" },
  { id: 'm34', authorId: 'u2', text: "i keep thinking about it ngl\nlike what if i just showed up and introduced myself properly\n\"aunty i'm anirudh, i know this is sudden but i've been talking to your daughter for years and i think you deserve to know\"", timestamp: "2026-05-20T00:15:00Z" },
  { id: 'm35', authorId: 'u1', text: "😭\nshe would've\nshe would've actually respected that i think\nif things were different", timestamp: "2026-05-20T00:16:00Z" },
  { id: 'm36', authorId: 'u2', text: "yeah?", timestamp: "2026-05-20T00:16:15Z" },
  { id: 'm37', authorId: 'u1', text: "she's not a bad person anirudh\nshe's just scared\nand nobody told her anything in the right way", timestamp: "2026-05-20T00:17:00Z" },
  { id: 'm38', authorId: 'u2', text: "i know\nthat's why i want to be the one to tell her\nnot hide, not sneak around\njust talk to her like a person", timestamp: "2026-05-20T00:17:15Z" },
  { id: 'm39', authorId: 'u1', text: "sometimes i really wish i could just go to her right now and say\n\"mom he's coming to vizag, he has an interview here\"\nand she'd be happy for you, genuinely\nshe'd have asked what company, told you to eat before you leave for the interview", timestamp: "2026-05-20T00:18:00Z" },
  { id: 'm40', authorId: 'u2', text: "stop i'm gonna actually tear up", timestamp: "2026-05-20T00:19:00Z" },
  { id: 'm41', authorId: 'u1', text: "she'd have called you beta 😭", timestamp: "2026-05-20T00:19:15Z" },
  { id: 'm42', authorId: 'u2', text: "okay now i'm sad for real", timestamp: "2026-05-20T00:19:30Z" },
  { id: 'm43', authorId: 'u1', text: "sorry lol\ni think about it a lot tho\nhow it could've been", timestamp: "2026-05-20T00:20:00Z" },
  { id: 'm44', authorId: 'u2', text: "me too", timestamp: "2026-05-20T00:20:15Z" }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [activeServerId, setActiveServerId] = useState(initialData.servers[0].id);
  const [activeChannelId, setActiveChannelId] = useState(initialData.servers[0].channels[0].id);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // --- FIREBASE: FETCH MESSAGES REAL-TIME (LOCAL SORT) ---
  useEffect(() => {
    if (!isLoggedIn) return;
    
    if (activeChannelId === 'c2') {
       setMessages(STUDY_LINKS_MESSAGES);
       setIsLoading(false);
       return;
    }

    setIsLoading(true);

    const q = query(
      collection(db, "messages"),
      where("channelId", "==", activeChannelId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty && activeChannelId === 'c1') {
        seedDatabase();
      } else {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()?.toISOString() || new Date().toISOString()
        }));
        
        msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(msgs);
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Firestore error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeChannelId, isLoggedIn]);

  const seedDatabase = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      STORY_MESSAGES.forEach((msg) => {
        const docRef = doc(db, "messages", msg.id);
        batch.set(docRef, {
          channelId: "c1",
          authorId: msg.authorId,
          text: msg.text,
          timestamp: new Date(msg.timestamp)
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Seeding error:", error);
    }
    setIsSeeding(false);
    setIsLoading(false);
  };

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
    if (activeChannelId === 'c2') return; // Disable sending in study-links
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
        console.error("Send error:", error);
      }
    }
  };

  const handleEditMessage = async () => {
    if (!editMessageText.trim() || activeChannelId === 'c2') return;
    try {
      await updateDoc(doc(db, "messages", editingMessageId), { text: editMessageText });
      setEditingMessageId(null);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (activeChannelId === 'c2') return;
    try {
      await deleteDoc(doc(db, "messages", messageId));
      setContextMenu(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    // Show loading spinner if at the top, otherwise hide it
    if (scrollTop === 0 && messages.length > 0) {
      setIsLoading(true);
    } else if (scrollTop > 0 && isLoading) {
      setIsLoading(false);
    }
  };

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

  // --- GROUP MESSAGES FOR DISCORD LAYOUT ---
  const groupedMessages = [];
  messages.forEach((msg) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    const msgDate = new Date(msg.timestamp);
    const prevDate = lastGroup ? new Date(lastGroup.timestamp) : null;
    const isDateChange = !lastGroup || msgDate.toDateString() !== prevDate?.toDateString();
    
    // Discord logic: same author, same day, and within 5 minutes
    const isConsecutive = !isDateChange && lastGroup && lastGroup.authorId === msg.authorId && (msgDate - prevDate < 300000);

    if (isConsecutive) {
      lastGroup.items.push(msg);
      // Keep group timestamp updated to the latest for next comparison? 
      // Actually Discord uses the first message of the group as base.
    } else {
      groupedMessages.push({
        ...msg,
        items: [msg],
        isDateChange
      });
    }
  });

  return (
    <div className="flex h-screen w-full bg-[#1e1f22] text-[#dbdee1] font-sans overflow-hidden">
      <div className="w-[72px] bg-[#1e1f22] shrink-0 flex flex-col items-center py-3 z-20">
        <Tooltip text="Direct Messages">
          <div className="relative group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#5865f2] rounded-full hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#dbdee1] hover:text-white">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor"><path d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0C8.48074 0.318799 6.67795 0.88575 4.96746 1.68266C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.397 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3086 20C22.6743 19.2743 24.8995 18.1418 26.8894 16.652C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0072 8.34973 18.3161 8.34973C19.625 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.625 13.6383 18.3161 13.6383Z" /></svg>
          </div>
        </Tooltip>
        <div className="w-8 h-0.5 bg-[#3f4147] rounded-full my-2"></div>
        {initialData.servers.map(server => (
          <Tooltip key={server.id} text={server.name}>
            <div className="relative flex items-center justify-center w-full group cursor-pointer" onClick={() => { setActiveServerId(server.id); setActiveChannelId(server.channels[0].id); }}>
              <div className={`absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 origin-left ${activeServerId === server.id ? 'h-10 scale-100' : 'h-2 scale-0 group-hover:scale-100 group-hover:h-5'}`}></div>
              <img src={server.icon} alt={server.name} className={`w-12 h-12 transition-all duration-300 bg-[#313338] object-cover ${activeServerId === server.id ? 'rounded-[16px]' : 'rounded-full group-hover:rounded-[16px]'}`} />
            </div>
          </Tooltip>
        ))}
        <Tooltip text="Add a Server"><div className="group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#23a559] rounded-full hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559] hover:text-white mb-2"><Plus size={24} /></div></Tooltip>
        <Tooltip text="Explore Discoverable Servers"><div className="group cursor-pointer w-12 h-12 bg-[#313338] hover:bg-[#23a559] rounded-full hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559] hover:text-white"><Compass size={24} /></div></Tooltip>
        <div className="mt-auto mb-2 flex flex-col items-center gap-2">
           <div className="w-8 h-0.5 bg-[#3f4147] rounded-full"></div>
           <Tooltip text="Download Apps"><div className="group cursor-pointer w-12 h-12 mt-1 hover:bg-[#313338] rounded-full hover:rounded-[16px] transition-all duration-300 flex items-center justify-center text-[#23a559]"><Download size={24} /></div></Tooltip>
        </div>
      </div>

        <div className="h-12 border-b border-[#1f2023] shadow-sm flex items-center justify-between px-4 hover:bg-[#35373c] cursor-pointer transition-colors min-w-0 group">
          <h1 className="font-bold text-[#f2f3f5] truncate text-[19px] flex-1 leading-[24px]">{activeServer.name}</h1>
          <ChevronDown size={18} className="text-[#dbdee1] shrink-0 ml-1 opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 mt-2">
          {activeServer.channels.map(channel => (
            <div key={channel.id} onClick={() => setActiveChannelId(channel.id)} className={`flex items-center px-2 py-1.5 mb-0.5 rounded-[4px] cursor-pointer group transition-colors ${activeChannelId === channel.id ? 'bg-[#404249] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}>
              {channel.type === 'text' ? <Hash size={20} className="mr-1.5 opacity-70" /> : <Volume2 size={20} className="mr-1.5 opacity-70" />}
              <span className="font-medium truncate">{channel.name}</span>
            </div>
          ))}
        </div>
        <div className="h-[52px] bg-[#232428] flex items-center px-2 shrink-0 mt-auto">
          <div className="flex items-center hover:bg-[#3f4147] p-1 -ml-1 rounded cursor-pointer transition-colors flex-1 min-w-0 mr-1 group">
            <div className="relative">
              <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23a559] border-2 border-[#232428] rounded-full group-hover:border-[#3f4147] transition-colors"></div>
            </div>
            <div className="ml-2 truncate">
              <div className="text-sm font-semibold text-[#f2f3f5] leading-tight truncate">{currentUser.name}</div>
              <div className="text-[11px] text-[#b5bac1] leading-tight truncate">Online</div>
            </div>
          </div>
          <div className="flex items-center text-[#b5bac1]">
            <button onClick={handleLogout} disabled={isLoggingOut} className="p-1.5 hover:bg-[#3b3d44] hover:text-[#f23f43] rounded transition-colors disabled:opacity-50" title="Log Out">
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
        <div className="h-12 border-b border-[#1f2023] shadow-sm flex items-center px-4 shrink-0">
          <Hash size={24} className="text-[#80848e] mr-2" />
          <h2 className="font-bold text-[#f2f3f5] mr-4">{activeChannel.name}</h2>
          <div className="ml-auto flex items-center text-[#b5bac1] gap-4">
             <button className="hover:text-[#dbdee1]"><Search size={20} /></button>
             <button className="hover:text-[#dbdee1]"><Inbox size={20} /></button>
             <button className="hover:text-[#dbdee1]"><HelpCircle size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-2" ref={scrollContainerRef} onScroll={handleScroll}>
          {/* The Forever Loop Spinner */}
          {isLoading && (
            <div className="flex justify-center py-4 shrink-0">
              <Loader2 className="animate-spin text-[#949ba4]" size={24} />
            </div>
          )}
          
          {groupedMessages.map((group, gIndex) => {
              const author = mockUsers.find(u => u.id === group.authorId) || currentUser;
              const msgDate = new Date(group.timestamp);
              
              return (
                <React.Fragment key={group.id}>
                  {group.isDateChange && (
                    <div className="flex items-center mt-[1.0625rem] mb-2 mx-4 pointer-events-none select-none">
                      <div className="flex-1 h-px bg-[#3f4147]"></div>
                      <span className="px-3 text-[11px] font-semibold text-[#949ba4] uppercase tracking-wider">{msgDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <div className="flex-1 h-px bg-[#3f4147]"></div>
                    </div>
                  )}
                  
                  {/* MAGIC FIX: Wrapper with items-start and gap-4 */}
                  <div className="flex items-start gap-4 px-4 py-[0.125rem] mt-[1.0625rem] group hover:bg-[#2e3035] -mx-4">
                    <div className="w-10 shrink-0 ml-2">
                       <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover mt-0.5 bg-gray-700" />
                    </div>
                    
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-baseline leading-tight">
                        <span className="font-bold text-[#f2f3f5] mr-2 hover:underline cursor-pointer">{author.name}</span>
                        <span className="text-[10px] text-[#949ba4] select-none">{msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="flex flex-col gap-[2px]">
                        {group.messages.map((msg, mIndex) => {
                          const isHeader = mIndex === 0;
                          return (
                            <div key={msg.id} className="relative group/msg" onContextMenu={(e) => { e.preventDefault(); if(activeChannelId==='c2') return; setContextMenu({ x: e.clientX, y: e.clientY, message: msg }); }}>
                              {editingMessageId === msg.id ? (
                                <div className="mt-1 mb-1 pr-12">
                                  <div className="bg-[#383a40] rounded-lg flex flex-col px-3 py-2 w-full">
                                    <input type="text" value={editMessageText} onChange={(e) => setEditMessageText(e.target.value)} className="bg-transparent outline-none text-[#dbdee1] w-full text-sm" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') handleEditMessage(); else if (e.key === 'Escape') setEditingMessageId(null); }} />
                                  </div>
                                  <div className="text-xs text-[#949ba4] mt-1">escape to <span className="text-[#00a8fc] cursor-pointer hover:underline" onClick={() => setEditingMessageId(null)}>cancel</span> • enter to <span className="text-[#00a8fc] cursor-pointer hover:underline" onClick={handleEditMessage}>save</span></div>
                                </div>
                              ) : (
                                <div className="flex items-start">
                                  {/* Subsequent messages time hover (optional layout logic) */}
                                  <p className="m-0 p-0 text-[#dbdee1] leading-[22px] break-words whitespace-pre-wrap flex-1">{msg.text}</p>
                                </div>
                              )}
                              
                              {/* Hover actions for every message */}
                              <div className="absolute -top-4 right-0 bg-[#313338] border border-[#1e1f22] rounded shadow-sm flex items-center opacity-0 group-hover/msg:opacity-100 transition-opacity z-10 overflow-hidden scale-90 origin-right">
                                <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="Add Reaction"><Smile size={16} /></button>
                                <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="Reply"><Reply size={16} /></button>
                                <button className="p-1.5 hover:bg-[#404249] text-[#b5bac1] hover:text-[#dbdee1] transition-colors" title="More"><MoreHorizontal size={16} /></button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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
            <input type="text" placeholder={activeChannelId === 'c2' ? "You do not have permission to send messages in this channel." : `Message #${activeChannel.name}`} disabled={activeChannelId === 'c2'} className="bg-transparent outline-none flex-1 text-[#dbdee1] placeholder-[#949ba4] disabled:cursor-not-allowed" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleSendMessage} />
            <div className="flex items-center text-[#b5bac1] gap-3 ml-2">
              <button className="hover:text-[#dbdee1]"><Gift size={20} /></button>
              <button className="hover:text-[#dbdee1]"><Sticker size={20} /></button>
              <button className="hover:text-[#dbdee1]"><Smile size={20} /></button>
            </div>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div className="fixed bg-[#111214] border border-[#1e1f22] shadow-xl rounded w-48 py-1.5 z-50 text-[#b5bac1] text-sm font-medium" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          <div className="px-3 py-1.5 hover:bg-[#4752c4] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded-sm group transition-colors" onClick={() => { setEditingMessageId(contextMenu.message.id); setEditMessageText(contextMenu.message.text); setContextMenu(null); }}>
            <span>Edit Message</span><Pencil size={14} className="opacity-80 group-hover:opacity-100" />
          </div>
          <div className="h-px bg-[#2b2d31] my-1 mx-2"></div>
          <div className="px-3 py-1.5 hover:bg-[#da373c] text-[#f23f43] hover:text-white cursor-pointer flex items-center justify-between mx-1 rounded-sm group transition-colors" onClick={() => handleDeleteMessage(contextMenu.message.id)}>
            <span>Delete Message</span><Trash2 size={14} className="opacity-80 group-hover:opacity-100" />
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
      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: #2b2d31; border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1b1e; border-radius: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #111214; }`}} />
    </div>
  );
}
