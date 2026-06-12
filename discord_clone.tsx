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
      icon: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=128&h=128&fit=crop',
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
  { id: 'sl1', authorId: 'u2', text: "Found this amazing site for any subject, classes 8-12: https://www.khanacademy.org/", timestamp: "2019-10-12T14:20:00Z" },
  { id: 'sl2', authorId: 'u2', text: "Best YouTube channel for history and science explainers: https://thecrashcourse.com/", timestamp: "2020-04-05T11:15:00Z" },
  { id: 'sl3', authorId: 'u2', text: "If you need to memorize terms or formulas, use this: https://quizlet.com/", timestamp: "2021-01-20T16:45:00Z" },
  { id: 'sl4', authorId: 'u2', text: "For math and chemistry problem solving: https://www.wolframalpha.com/", timestamp: "2022-05-14T09:30:00Z" }
];

const STORY_MESSAGES = [
  { id: 'p1', authorId: 'u2', text: "ugh", timestamp: "2026-05-26T08:11:00Z" },
  { id: 'p2', authorId: 'u2', text: "they took a pic of me", timestamp: "2026-05-26T08:11:10Z" },
  { id: 'p3', authorId: 'u1', text: "ohh 😭😭😭", timestamp: "2026-05-26T08:11:45Z" },
  { id: 'p4', authorId: 'u2', text: "do you think he'll send it or smth", timestamp: "2026-05-26T08:12:05Z" },
  { id: 'p5', authorId: 'u1', text: "that's what i'm scared of too", timestamp: "2026-05-26T08:12:20Z" },
  { id: 'p6', authorId: 'u2', text: "i tried to leave immediately but he kept stopping me\nwouldn't let me go", timestamp: "2026-05-26T08:12:45Z" },
  { id: 'p7', authorId: 'u1', text: "yeah cus the main guy i was talking to on the call\ntold me how outsiders aren't allowed inside\nand apparently need a permission slip\nwhich gets sent to the owners\nbasically... parents", timestamp: "2026-05-26T08:13:10Z" },
  { id: 'p8', authorId: 'u2', text: "i see", timestamp: "2026-05-26T08:13:25Z" },
  { id: 'p9', authorId: 'u1', text: "i just said\nohh okay i didn't know, sorry, won't happen again\n\nand he was like okay but now what\n\ni was like he'll leave now\n\nhe was like alright", timestamp: "2026-05-26T08:13:50Z" },
  { id: 'p10', authorId: 'u2', text: "the way he was talking to you tho\ni didn't like it\n\nfelt so rude\nyou didn't do anything wrong and he was just—\nidk it bothered me a lot", timestamp: "2026-05-26T08:14:10Z" },
  { id: 'p11', authorId: 'u1', text: "it's okay\nhe was just doing his job i guess", timestamp: "2026-05-26T08:14:25Z" },
  { id: 'p12', authorId: 'u2', text: "no i get that but still\nthe tone wasn't needed\nyou're not a criminal", timestamp: "2026-05-26T08:14:45Z" },
  { id: 'p13', authorId: 'u1', text: "i should've said you're a stranger 😭\n\nanyway i called mom after\nshe picked up and was like\ni didn't call you?\n\nso they came on their own\nthe guards did", timestamp: "2026-05-26T08:15:10Z" },
  { id: 'p14', authorId: 'u2', text: "they went to your house??", timestamp: "2026-05-26T08:15:25Z" },
  { id: 'p15', authorId: 'u1', text: "no no i'm at the park still\ni don't want to go home just yet\n\nit's a very restricted community man 👍", timestamp: "2026-05-26T08:15:45Z" },
  { id: 'p16', authorId: 'u2', text: "have they talked to anyone inside your house?", timestamp: "2026-05-26T08:16:00Z" },
  { id: 'p17', authorId: 'u1', text: "no\nhopefully not", timestamp: "2026-05-26T08:16:15Z" },
  { id: 'p18', authorId: 'u2', text: "i keep thinking\nwhat if mom finds out and scolds you because of me\n\nthat would genuinely break me", timestamp: "2026-05-26T08:16:40Z" },
  { id: 'p19', authorId: 'u1', text: "hey don't think like that", timestamp: "2026-05-26T08:17:00Z" },
  { id: 'p20', authorId: 'u2', text: "i can't help it\nyou're sitting at the park not wanting to go home\nbecause of something i did\nthat's on me", timestamp: "2026-05-26T08:17:20Z" },
  { id: 'p21', authorId: 'u1', text: "you didn't do anything wrong", timestamp: "2026-05-26T08:17:40Z" },
  { id: 'p22', authorId: 'u2', text: "i walked into a place i shouldn't have\nand now you might have to deal with the consequences\nnot me, you\n\nthat's the part that's killing me rn", timestamp: "2026-05-26T08:18:00Z" },
  { id: 'p23', authorId: 'u1', text: "rudh...", timestamp: "2026-05-26T08:18:15Z" },
  { id: 'p24', authorId: 'u2', text: "and i just\nidk\ni keep thinking about how different today could've been\n\nlike i wish\ni genuinely wish we could've just told mom\n\"mom he came all this way, he has an interview here\"\nand she'd open the door and let me in\nand we'd sit in your house like normal people\nhave chai or whatever\nand it'd just be... fine", timestamp: "2026-05-26T08:18:45Z" },
  { id: 'p25', authorId: 'u1', text: "😭", timestamp: "2026-05-26T08:19:00Z" },
  { id: 'p26', authorId: 'u2', text: "instead we're here\nyou're at a park scared to go home\nand i'm on a footpath feeling like i ruined your day", timestamp: "2026-05-26T08:19:25Z" },
  { id: 'p27', authorId: 'u1', text: "you didn't ruin anything", timestamp: "2026-05-26T08:19:40Z" },
  { id: 'p28', authorId: 'u2', text: "has i anyone called you yet?", timestamp: "2026-05-26T08:20:00Z" },
  { id: 'p29', authorId: 'u1', text: "nope\nnothing so far", timestamp: "2026-05-26T08:20:15Z" },
  { id: 'p30', authorId: 'u2', text: "okay good\nplease tell me the moment something happens\n\ni feel so guilty sitting here doing nothing", timestamp: "2026-05-26T08:20:40Z" },
  { id: 'p31', authorId: 'u1', text: "i will i will\nstop overthinking", timestamp: "2026-05-26T08:21:00Z" },
  { id: 'p32', authorId: 'u2', text: "istg i kept thinking why didn't anyone stop me on the way in\nlike so many people saw me walk through", timestamp: "2026-05-26T08:21:20Z" },
  { id: 'p33', authorId: 'u1', text: "but they might send a message still\n\nthat guard was saying—\nactually wait all of them know me there 😭😭\nthat's why each of them were coming up concerned asking if i was okay\nif it was a random person they would've just stared and left", timestamp: "2026-05-26T08:21:50Z" },
  { id: 'p34', authorId: 'u2', text: "ohhh okay that's a little better then\n\nthank god we were just standing when they showed up", timestamp: "2026-05-26T08:22:10Z" },
  { id: 'p35', authorId: 'u1', text: "fr", timestamp: "2026-05-26T08:22:20Z" },
  { id: 'p36', authorId: 'u2', text: "the way that guard spoke to me tho\nlike i was some intruder\ni just wanted to see you\nthat's literally it\ni came so far just to stand next to you for a bit\nand he's taking pictures and blocking my way like i did something terrible", timestamp: "2026-05-26T08:22:45Z" },
  { id: 'p37', authorId: 'u1', text: "i know 😭", timestamp: "2026-05-26T08:23:00Z" },
  { id: 'p38', authorId: 'u2', text: "i'm not usually like this but i felt so small in that moment ngl", timestamp: "2026-05-26T08:23:15Z" },
  { id: 'p39', authorId: 'u1', text: "hey\nyou didn't do anything wrong okay\nwe just wanted to meet\nthat's not something to feel small about", timestamp: "2026-05-26T08:23:40Z" },
  { id: 'p40', authorId: 'u2', text: "yeah\n\ni just really hope your parents don't find out and make things worse for you\nthat's all i keep thinking about\nyou already have so much to deal with at home\n\nif they say something to you because of me i swear i'll feel terrible for so long", timestamp: "2026-05-26T08:24:10Z" },
  { id: 'p41', authorId: 'u1', text: "they won't\nand even if they do\nit's not your fault", timestamp: "2026-05-26T08:24:30Z" },
  { id: 'p42', authorId: 'u2', text: "it is tho", timestamp: "2026-05-26T08:24:45Z" },
  { id: 'p43', authorId: 'u1', text: "rudh", timestamp: "2026-05-26T08:25:00Z" },
  { id: 'p44', authorId: 'u2', text: "sorry\ni'll stop\n\ni just\ni wanted today to be good\nand it was, for a bit\nbut now i feel odd\nlike something heavy is sitting on my chest and won't move", timestamp: "2026-05-26T08:25:25Z" },
  { id: 'p45', authorId: 'u1', text: "i know that feeling", timestamp: "2026-05-26T08:25:40Z" },
  { id: 'p46', authorId: 'u2', text: "i wish things were just normal\ni wish i could've knocked on your door today\nmet mom properly\nsat inside your house\nnot this", timestamp: "2026-05-26T08:26:00Z" },
  { id: 'p47', authorId: 'u1', text: "me too\nmore than you know", timestamp: "2026-05-26T08:26:15Z" },
  { id: 'p48', authorId: 'u2', text: "one day right", timestamp: "2026-05-26T08:26:25Z" },
  { id: 'p49', authorId: 'u1', text: "one day", timestamp: "2026-05-26T08:26:35Z" },
  { id: 'p50', authorId: 'u2', text: "i think they just took the pic as a record\nlike in case i show up again\nprobably won't send it", timestamp: "2026-05-26T08:27:00Z" },
  { id: 'p51', authorId: 'u1', text: "yeah i feel like that too\njust a just in case thing\n\nplease let that be it 🙏", timestamp: "2026-05-26T08:27:20Z" },
  { id: 'p52', authorId: 'u2', text: "hopefully they don't send it\nnot right now", timestamp: "2026-05-26T08:27:40Z" },
  { id: 'p53', authorId: 'u1', text: "fr\n\nlemme go in slowly i think", timestamp: "2026-05-26T08:28:00Z" },
  { id: 'p54', authorId: 'u2', text: "yeah go\nand text me the second you're inside okay\ndon't care how late", timestamp: "2026-05-26T08:28:20Z" },
  { id: 'p55', authorId: 'u1', text: "i will\n\nhey", timestamp: "2026-05-26T08:28:35Z" },
  { id: 'p56', authorId: 'u2', text: "yeah", timestamp: "2026-05-26T08:28:45Z" },
  { id: 'p57', authorId: 'u1', text: "atleast we met today", timestamp: "2026-05-26T08:28:55Z" },
  { id: 'p58', authorId: 'u2', text: "yeah\n\natleast we met 🙂\n\nthey'll see me again when i come to buy a house there anyway", timestamp: "2026-05-26T08:29:10Z" },
  { id: 'p59', authorId: 'u1', text: "i—", timestamp: "2026-05-26T08:29:20Z" },
  { id: 'p60', authorId: 'u2', text: "why is that cow running btw", timestamp: "2026-05-26T08:29:30Z" },
  { id: 'p61', authorId: 'u1', text: "idk 😭", timestamp: "2026-05-26T08:29:40Z" },
  { id: 'p62', authorId: 'u2', text: "go home safe\n\nlove you", timestamp: "2026-05-26T08:29:50Z" },
  { id: 'p63', authorId: 'u1', text: "love you too\n\ngo eat something please\nyou've been on that footpath too long", timestamp: "2026-05-26T08:29:55Z" },
  { id: 'p64', authorId: 'u2', text: "lol okay\n\ntext me 🤍", timestamp: "2026-05-26T08:29:59Z" },
  { id: 'r1', authorId: 'u2', text: "okay i'm on my way back\non the right path", timestamp: "2026-05-26T08:32:00Z" },
  { id: 'r2', authorId: 'u2', text: "i hope i get to see you again soon\ni keep wondering what's happening there right now", timestamp: "2026-05-26T08:33:00Z" },
  { id: 'r3', authorId: 'u2', text: "i miss you so much already", timestamp: "2026-05-26T08:35:00Z" },
  { id: 'r4', authorId: 'u2', text: "gonna see what there is to eat\nlooks like upma\ni'll skip it\nbiscuits are fine", timestamp: "2026-05-26T08:37:00Z" },
  { id: 'r5', authorId: 'u2', text: "i can still feel us kissing\n it feels so good\ni don't even want to eat right now\ni just want to hold onto that feeling a little longer", timestamp: "2026-05-26T08:39:00Z" },
  { id: 'r6', authorId: 'u2', text: "just waiting for your text\ni'll put on lost soul and sit with it", timestamp: "2026-05-26T08:41:00Z" },
  { id: 'r7', authorId: 'u2', text: "i love you so much\ni really hope you're safe and sound 🍀", timestamp: "2026-05-26T08:43:00Z" },
  { id: 'r8', authorId: 'u2', text: "i can still sense you\nstill smell you\nit's everywhere 💖", timestamp: "2026-05-26T08:46:00Z" },
  { id: 'r9', authorId: 'u2', text: "i miss you more than i know how to explain", timestamp: "2026-05-26T08:49:00Z" },
  { id: 'r10', authorId: 'u2', text: "keeps crossing my mind\njust going back on that road so i can see you again from a distance\neven that would be enough", timestamp: "2026-05-26T08:52:00Z" },
  { id: 'r11', authorId: 'u2', text: "i don't feel like doing anything\njust want to sit here and wait for you", timestamp: "2026-05-26T08:55:00Z" },
  { id: 'r12', authorId: 'u2', text: "if grandma leaves by noon and mom takes the laptop\nyou probably won't be free till around 3\ni'll keep that in mind", timestamp: "2026-05-26T08:58:00Z" },
  { id: 'r13', authorId: 'u2', text: "i wish so badly we could just talk through our minds\nno phones, no discord, no guards\njust us knowing the other is okay", timestamp: "2026-05-26T09:03:00Z" },
  { id: 'r14', authorId: 'u2', text: "i genuinely wish i knew what was going on there right now", timestamp: "2026-05-26T09:08:00Z" },
  { id: 'r15', authorId: 'u2', text: "i'm thinking of coming around 1\nhoping i'll get to see you even for a second", timestamp: "2026-05-26T09:14:00Z" },
  { id: 'r16', authorId: 'u2', text: "sitting with my career and study plans right now\ntrying to keep myself busy", timestamp: "2026-05-26T09:21:00Z" },
  { id: 'r17', authorId: 'u2', text: "honestly today made something shift in me\nall of this\nit made me really serious\ni want to work hard enough that none of these obstacles exist anymore\nnot for us", timestamp: "2026-05-26T09:27:00Z" },
  { id: 'r18', authorId: 'u2', text: "my love\ni hope you're doing okay in there\ni hope you're not too shaken up", timestamp: "2026-05-26T09:33:00Z" },
  { id: 'r19', authorId: 'u2', text: "went through everything we did today in my head again\neverything\nand it made me so happy 💖💖\neven now sitting here alone it's making me smile", timestamp: "2026-05-26T09:41:00Z" },
  { id: 'r20', authorId: 'u2', text: "istg i just got jumpscared by an email notification\nmy heart actually dropped\ngenuinely thought it was you for a second 😭", timestamp: "2026-05-26T09:48:00Z" },
  { id: 'r21', authorId: 'u2', text: "okay i'll check if lunch is ready\neat quickly\nand time it so i reach there at exactly 1pm", timestamp: "2026-05-26T10:02:00Z" },
  { id: 'r22', authorId: 'u2', text: "i wonder when you'll eat lunch 🤔\ni hope you do eat something", timestamp: "2026-05-26T10:09:00Z" },
  { id: 'r23', authorId: 'u2', text: "ugh", timestamp: "2026-05-26T10:17:00Z" },
  { id: 'r24', authorId: 'u2', text: "good afternoon by the way 🌤️", timestamp: "2026-05-26T10:23:00Z" },
  { id: 'r25', authorId: 'u2', text: "okay here's the plan\nskip lunch for now\nleave in a bit\nreach there at 1pm sharp\nwait a few minutes\nthen come back", timestamp: "2026-05-26T10:31:00Z" },
  { id: 'r26', authorId: 'u2', text: "could wait longer but i don't want those guards seeing me again\nso i'll come back\nthen go again around 4\nthen again around 6 if needed", timestamp: "2026-05-26T10:33:00Z" },
  { id: 'r27', authorId: 'u2', text: "i just want to see you\neven from far\njust to look at you and tell myself\nokay, she's alright\nshe's safe\n\nthat's all i need", timestamp: "2026-05-26T10:38:00Z" },
  { id: 'r28', authorId: 'u2', text: "lmao some guy stopped me asking for directions\nme who's been living on google maps this whole trip\ntold him to ask an auto rickshaw 💀", timestamp: "2026-05-26T10:58:00Z" },
  { id: 'r29', authorId: 'u2', text: "wait actually something kinda weird happened\na guy on a scooter came up out of nowhere\nstarted asking where i was going, where i live\nall of that\nthe timing felt off\nso i didn't go in", timestamp: "2026-05-26T11:06:00Z" },
  { id: 'r30', authorId: 'u2', text: "i'm thinking he might be the manager you spoke to on the call\nor maybe someone from the housing office\neither way it felt sus so i stayed back", timestamp: "2026-05-26T11:12:00Z" },
  { id: 'r31', authorId: 'u2', text: "okay so\nhe came up to me properly\nturned out he was that manager\nand he showed me the photo they took", timestamp: "2026-05-26T11:19:00Z" },
  { id: 'r32', authorId: 'u2', text: "THANKFULLY IT WAS SO VAGUE 😭🙏\ni was looking the other way the whole time", timestamp: "2026-05-26T11:21:00Z" },
  { id: 'r33', authorId: 'u2', text: "he was actually really polite about it\nwe talked properly\nhe said the guard just wanted to know who i was for safety reasons\napparently there was a kidnapping case in the area recently\nthat's why they were being careful", timestamp: "2026-05-26T11:25:00Z" },
  { id: 'r34', authorId: 'u2', text: "he asked what you were to me\ni said a friend", timestamp: "2026-05-26T11:29:00Z" },
  { id: 'r35', authorId: 'u2', text: "we even exchanged numbers\noverall the conversation felt okay\nknowing everything he said, i think we're safe", timestamp: "2026-05-26T11:31:00Z" },
  { id: 'r36', authorId: 'u2', text: "he was like so you were just talking?\ni was like yeah\nand then i mentioned there was a little kid around us the whole time anyway\nhe laughed and said yeah there are always kids around there", timestamp: "2026-05-26T11:35:00Z" },
  { id: 'r37', authorId: 'u2', text: "either way they can't really do much\nit wasn't a crime\nwe were just standing there", timestamp: "2026-05-26T11:44:00Z" },
  { id: 'r38', authorId: 'u2', text: "i don't feel like eating at all", timestamp: "2026-05-26T11:52:00Z" },
  { id: 'r39', authorId: 'u2', text: "idk how i'm supposed to feel right now\nhappy that the photo was vague and the guy was decent\nor low because i still don't know what's happening with you in there", timestamp: "2026-05-26T12:08:00Z" },
  { id: 'r40', authorId: 'u2', text: "it's the not knowing that's getting to me\njust sitting here waiting\nhoping you're okay", timestamp: "2026-05-26T12:41:00Z" },
  { id: 'r41', authorId: 'u2', text: "still here\nstill waiting\ntake your time 🤍", timestamp: "2026-05-26T12:58:00Z" },
  { id: 'b1', authorId: 'u1', text: "how the hell am i supposed to reply to 60 messages", timestamp: "2026-05-26T13:11:00Z" },
  { id: 'b2', authorId: 'u2', text: "i—\n\nTHANK GOD YOU'RE HERE", timestamp: "2026-05-26T13:11:15Z" },
  { id: 'b3', authorId: 'u1', text: "security told mom\n\ni deleted dc\n\nshe cried", timestamp: "2026-05-26T13:11:30Z" },
  { id: 'b4', authorId: 'u2', text: "WHAT", timestamp: "2026-05-26T13:12:00Z" },
  { id: 'b5', authorId: 'u1', text: "she told me not to talk to you again\n\nasked me if i was being blackmailed or something\n\nthought i was gonna get kidnapped\n\nshe saw the love bite", timestamp: "2026-05-26T13:12:15Z" },
  { id: 'b6', authorId: 'u2', text: "damn\n\ni didn't know it was that visible\ni'm so sorry\n\ni understand why she's scared\ni really do\n\ni just wish\ni wish she could talk to me once\ncome see where i'm from\nsee everything\nso she'd know i'd never hurt you", timestamp: "2026-05-26T13:12:35Z" },
  { id: 'b7', authorId: 'u1', text: "sorry grandma called\n\ngoing to help", timestamp: "2026-05-26T13:13:00Z" },
  { id: 'b8', authorId: 'u2', text: "she'd know i would rather not exist than let anything happen to you\n\ngo help\ni'm here", timestamp: "2026-05-26T13:13:20Z" },
  { id: 'b9', authorId: 'u1', text: "i don't think mom told her", timestamp: "2026-05-26T13:14:00Z" },
  { id: 'b10', authorId: 'u2', text: "will grandma stay tonight?", timestamp: "2026-05-26T13:14:20Z" },
  { id: 'b11', authorId: 'u1', text: "yk what mom said\n\nshe was like\n\nyou could've just told us", timestamp: "2026-05-26T13:14:40Z" },
  { id: 'b12', authorId: 'u2', text: "what", timestamp: "2026-05-26T13:15:00Z" },
  { id: 'b13', authorId: 'u1', text: "we could've let him inside the house", timestamp: "2026-05-26T13:15:15Z" },
  { id: 'b14', authorId: 'u2', text: "WHAT\n\ni was thinking the exact same thing the whole morning\nthe EXACT same thing\n\ni wanted to knock on that door so badly\ni wanted to just introduce myself properly\nand now she's saying that\n\ni don't even know what to feel\ni'm just—\nugh", timestamp: "2026-05-26T13:15:40Z" },
  { id: 'b15', authorId: 'u1', text: "grandma saying you'll do something bad to me 😭", timestamp: "2026-05-26T13:16:00Z" },
  { id: 'b16', authorId: 'u2', text: ".", timestamp: "2026-05-26T13:16:15Z" },
  { id: 'b17', authorId: 'u1', text: "she said she'll lock me in the house\n\ni'm gonna delete discord\n\nbye", timestamp: "2026-05-26T13:17:00Z" },
  { id: 'm1', authorId: 'u2', text: "are you okay\nplease just tell me you're okay", timestamp: "2026-05-26T14:14:00Z" },
  { id: 'm2', authorId: 'u2', text: "i know you deleted discord\ni know you probably can't reply right now\nbut i'll keep texting anyway", timestamp: "2026-05-26T14:31:00Z" },
  { id: 'm3', authorId: 'u2', text: "what did mom say after\ndid it get worse\ni keep replaying everything in my head and i can't stop", timestamp: "2026-05-26T15:22:00Z" },
  { id: 'm4', authorId: 'u2', text: "sitting at a tea stall near the station\nordered chai\nhaven't touched it\njust thinking about your face when you said bye", timestamp: "2026-05-26T16:05:00Z" },
  { id: 'm5', authorId: 'u2', text: "i hope grandma isn't being too hard on you\nshe doesn't know me\nshe's just scared for you\ni understand that even if it hurts", timestamp: "2026-05-26T16:48:00Z" },
  { id: 'm6', authorId: 'u2', text: "do you have homework due tomorrow\nplease don't fall behind because of today\nthat would make me feel even worse\n\nplease eat dinner okay", timestamp: "2026-05-26T17:30:00Z" },
  { id: 'm7', authorId: 'u2', text: "i keep thinking about what your mom said\nthat she would've let me in\nthat we could've just told her\n\nwe were so close to doing it the right way\nsomething so small got in the way\nand now here we are", timestamp: "2026-05-26T18:55:00Z" },
  { id: 'm8', authorId: 'u2', text: "i'm sorry\ni know you told me it wasn't my fault but it is\ni walked in\nyou're dealing with everything\nand i'm sitting here doing nothing\nthat's not okay\n\ni'm so sorry", timestamp: "2026-05-26T20:17:00Z" },
  { id: 'm9', authorId: 'u2', text: "goodnight\nwherever you are right now\ni hope you're sleeping okay\ni love you so much 🤍", timestamp: "2026-05-26T22:02:00Z" },
  { id: 'm10', authorId: 'u2', text: "good morning\ndid you sleep", timestamp: "2026-05-27T07:28:00Z" },
  { id: 'm11', authorId: 'u2', text: "i keep picking up my phone\nit's become a habit now\npick up, check, nothing, put down, repeat", timestamp: "2026-05-27T10:15:00Z" },
  { id: 'm12', authorId: 'u2', text: "you probably have classes today\ni hope the day is going okay\ndo you have any assignments due soon\ni keep thinking about your schedule and wondering if you're keeping up with everything", timestamp: "2026-05-27T12:40:00Z" },
  { id: 'm13', authorId: 'u2', text: "had lunch\nsmall place near the station\nrice and curry\nit was fine\n\ni just wish i knew if you ate", timestamp: "2026-05-27T14:33:00Z" },
  { id: 'm14', authorId: 'u2', text: "it's a specific kind of quiet\nwhen someone you love goes silent\ndifferent from regular quiet\nheavier", timestamp: "2026-05-27T17:10:00Z" },
  { id: 'm15', authorId: 'u2', text: "interview's day after tomorrow\ni should probably be nervous\nbut all i can actually think about is whether you're okay inside that house right now", timestamp: "2026-05-27T19:44:00Z" },
  { id: 'm16', authorId: 'u2', text: "goodnight\nday 2 of wondering\nit's okay\ni'll wait", timestamp: "2026-05-27T21:55:00Z" },
  { id: 'm17', authorId: 'u2', text: "good morning\ntrying to prep for tomorrow\nopened my notes\nstared at them for 20 minutes\nclosed them", timestamp: "2026-05-28T08:50:00Z" },
  { id: 'm18', authorId: 'u2', text: "do you have exams coming up\ni can't remember the dates you told me\ni keep thinking about that notebook on your desk\nwhether it's getting filled or just sitting there\n\nsmall things\ni think about small things now", timestamp: "2026-05-28T11:22:00Z" },
  { id: 'm19', authorId: 'u2', text: "the thing that's sitting heaviest on me rn\nis that i don't know anything\nis mom still upset\nis grandma still there\nare you okay\nare you crying\nare you actually fine and i'm the only one falling apart\n\ni don't know\nand the not knowing is its own kind of pain", timestamp: "2026-05-28T14:08:00Z" },
  { id: 'm20', authorId: 'u2', text: "i walked past a park today\nthere was a swing\ndidn't sit on it\njust stood there for a second", timestamp: "2026-05-28T16:40:00Z" },
  { id: 'm21', authorId: 'u2', text: "sleeping early\ninterview tomorrow\nor trying to sleep at least\n\ni really wish i could tell you about it after\ni always tell you everything after\n\ngoodnight", timestamp: "2026-05-28T21:15:00Z" },
  { id: 'm22', authorId: 'u2', text: "heading out for the interview soon\ngetting ready\nit's strange doing this without texting you that i'm nervous", timestamp: "2026-05-29T08:58:00Z" },
  { id: 'm23', authorId: 'u2', text: "leaving now\nwish me luck even if you can't say it", timestamp: "2026-05-29T09:44:00Z" },
  { id: 'm24', authorId: 'u2', text: "interview done\nwent okay i think\nhard to tell\nbut i wanted to tell you so badly the second i walked out\n\nthis is the first big thing that happened that i couldn't share with you immediately\nfeels really wrong", timestamp: "2026-05-29T13:27:00Z" },
  { id: 'm25', authorId: 'u2', text: "leaving vizag tonight\nleaving the city you're in\nsomewhere out there in these streets is you\nprobably doing homework\nor watching something\nor asleep already\n\ni hope you're somewhere warm", timestamp: "2026-05-29T16:12:00Z" },
  { id: 'm26', authorId: 'u2', text: "on the train now\nwatching vizag go past the window\ni can't explain what this feels like", timestamp: "2026-05-29T19:33:00Z" },
  { id: 'm27', authorId: 'u2', text: "reached home last night\neverything here looks exactly the same\nfeels completely different", timestamp: "2026-05-30T09:44:00Z" },
  { id: 'm28', authorId: 'u2', text: "mom asked how the interview went\ni said fine\nshe asked why i looked tired\ni said travel", timestamp: "2026-05-30T13:15:00Z" },
  { id: 'm29', authorId: 'u2', text: "do you remember the wind that evening at the park\nyou said it was nice\nyou were swinging a little\ni keep going back to that", timestamp: "2026-05-30T17:28:00Z" },
  { id: 'm30', authorId: 'u2', text: "4 days now\nstill here\ngoodnight 🤍", timestamp: "2026-05-30T21:30:00Z" },
  { id: 'm31', authorId: 'u2', text: "slept really badly last night\nkept waking up and reaching for the phone", timestamp: "2026-05-31T10:48:00Z" },
  { id: 'm32', authorId: 'u2', text: "tried to work on my career stuff today\nopened everything\ncouldn't sit with it\nclosed it\n\nthe guilt just sits there and i can't work around it\nit's always in the way", timestamp: "2026-05-31T14:22:00Z" },
  { id: 'm33', authorId: 'u2', text: "i keep thinking\nif i had just stayed on that road\nwaited outside like i should have\nyou'd be texting me right now\nwe'd be talking about something stupid and laughing\n\ni made the wrong call\nand you're the one living with it\nthat's the part i can't get past", timestamp: "2026-05-31T17:50:00Z" },
  { id: 'm34', authorId: 'u2', text: "i hope dinner was good\ni hope the homework is done\ni hope you're not too stressed\n\ni hope a lot of things these days", timestamp: "2026-05-31T21:15:00Z" },
  { id: 'm35', authorId: 'u2', text: "new month\nyou still haven't replied\n\nthat's okay", timestamp: "2026-06-01T08:55:00Z" },
  { id: 'm36', authorId: 'u2', text: "i've been quieter around home too\npeople are noticing\ni don't know what to tell them", timestamp: "2026-06-01T13:42:00Z" },
  { id: 'm37', authorId: 'u2', text: "ngl i'm not doing great\ni'll be honest with you even if you can't hear it right now\nthe silence is getting really heavy\n\nbut i know why you can't reply\ni know the difference between someone who doesn't want to talk\nand someone who can't\n\nso i'm not upset\ni just really miss you", timestamp: "2026-06-01T16:33:00Z" },
  { id: 'm38', authorId: 'u2', text: "goodnight\nday 6\nstill here\nstill yours", timestamp: "2026-06-01T23:10:00Z" },
  { id: 'm39', authorId: 'u2', text: "late morning\ncouldn't get up earlier\nthat's been happening more", timestamp: "2026-06-02T11:30:00Z" },
  { id: 'm40', authorId: 'u2', text: "do you have semester stuff coming up\ni can't remember what your schedule looks like now\ni hope you're keeping up with it\nyou worked hard this year\nplease don't let any of this pull you down", timestamp: "2026-06-02T15:05:00Z" },
  { id: 'm41', authorId: 'u2', text: "i almost sent something really dark just now and deleted it\n\ni've been doing that more\nwriting things and deleting them\nnot sure what's worth sending when there's no reply\n\nbut then i think\nshe might read all of this someday\nso i should leave something worth reading", timestamp: "2026-06-02T19:18:00Z" },
  { id: 'm42', authorId: 'u2', text: "i miss you in a way i don't have words for anymore", timestamp: "2026-06-02T22:44:00Z" },
  { id: 'm43', authorId: 'u2', text: "hey\n\njust hey today", timestamp: "2026-06-03T12:55:00Z" },
  { id: 'm44', authorId: 'u2', text: "i've been thinking about writing you a proper letter\nsomething real\nbefore i go quiet for a bit\n\ni think texting into silence every day is starting to cost me something\nand i need to protect whatever i have left for when you come back\n\nso tomorrow\nletter\nand then some space\nfor both of us\n\ngoodnight", timestamp: "2026-06-03T20:20:00Z" },
  { id: 'm45', authorId: 'u2', text: "okay\n\ni wrote something\nit's long\nplease read it when you can", timestamp: "2026-06-04T10:18:00Z" },
  { id: 'm46', authorId: 'u2', text: "📄 for you — whenever you find this\n\ni don't know when you'll read this. maybe today, maybe weeks from now, maybe you'll find it buried in old messages when things finally look different. that's okay. it'll mean the same thing whenever you do.\n\ni'm not writing this because i'm angry. i want to say that first. i understand why you went silent. i understand what happened at home, what your mom said, what grandma said. i'm not writing this to make you feel guilty for not replying. i know you're not choosing this silence. i know the difference between someone who doesn't want to talk and someone who can't. you can't right now. and i respect that more than i can explain.\n\ni just needed to leave something here before i go quiet too. something honest.\n\ni'm sorry about the 26th. i've said it before but i mean it even more sitting here days later with all this silence around me. i walked into a place i should've waited outside of. i was so close to you and i wanted to be closer and i didn't think it through. that was on me. not you, not the situation, me. and because of that you had to stand in front of your mom and explain something that was never supposed to come out that way. i replay that. all of it. the guard, the photo, your face when you said bye. i'll probably replay it for a long time.\n\nbut i keep holding onto what your mom said. that she would've let me in. that we could've just told her. i hold onto that because it means the door isn't closed. it means she's not against us out of hatred. she's scared. she loves you and she got scared. i don't blame her for that. honestly? i want to meet her properly one day. sit in front of her like a person and just be honest. tell her who i am, where i'm going, how much i love her daughter. no sneaking, no guards, no photographs. just a real conversation.\n\ni've been thinking about the future a lot these days. maybe because the present hurts too much to stay in, so my brain keeps going forward. and the future looks okay actually. it looks good.\n\ni see myself getting this job. building something real. and then one day walking up to your door — not the community gate, your actual front door — with something to offer and something honest to say. i see your mom opening it. i see that going okay.\n\ni still think about germany too. i know it sounds far. it is far. but i've been mapping it out and i believe in it. i believe in us getting there eventually. i think you'd love berlin. i think you'd stand there in the cold looking at something from a hundred years ago and get that look you get when something surprises you.\n\ni think about the swing at that park. the wind that evening. you said it was nice. i want more evenings like that. i want a hundred more. i want them without guards and without fear and without having to check if anyone's watching.\n\nuntil then — please take care of yourself. eat properly, i know you forget. sleep at a decent time. do your homework and your exams and all of it. don't let any of this make you fall behind on things that matter for your future. because your future is where i'm headed too and i need you to be there, okay. healthy and whole and okay.\n\ni'm going to stop texting after this. not because i gave up. never that. just because i think texting into silence every day is slowly taking something from me and i need to protect it. i need to have something left to give you when you come back.\n\ni'll be here. working. figuring things out. missing you quietly instead of loudly.\n\ni love you more than i know how to say in a discord message\n\nalways, no matter how long this takes\nrudh 🤍", timestamp: "2026-06-04T10:19:00Z" },
  { id: 'm47', authorId: 'u2', text: "that's everything i had\n\ntake all the time you need\ni'll be here", timestamp: "2026-06-04T10:21:00Z" }
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
    if (scrollTop === 0 && messages.length > 0) {}
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

      <div className="w-[240px] bg-[#2b2d31] shrink-0 flex flex-col z-10">
        <div className="h-12 border-b border-[#1f2023] shadow-sm flex items-center justify-between px-4 hover:bg-[#35373c] cursor-pointer transition-colors min-w-0 group">
          <h1 className="font-bold text-[#f2f3f5] truncate text-[17px] flex-1 leading-[20px]">{activeServer.name}</h1>
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
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
               <div className="w-12 h-12 rounded-full border-4 border-[#313338] border-t-[#5865f2] animate-spin mb-4"></div>
            </div>
          ) : (
            groupedMessages.map((group, gIndex) => {
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
                        {group.items.map((msg, mIndex) => {
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
                                  <p className="m-0 p-0 text-[#dbdee1] leading-[22px] break-words whitespace-pre-wrap flex-1">{msg.text}</p>
                                </div>
                              )}
                              
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
            })
          )}
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
