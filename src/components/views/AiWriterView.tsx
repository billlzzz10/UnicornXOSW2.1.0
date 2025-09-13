import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { AiChatLog, AiPersonality, Note, NoteCategory } from '../../../types';
import ContextSelectorModal from '../ContextSelectorModal'; 
import AiMentorPanel from '../AiMentorPanel';
import { CORE_WRITING_PERSONALITIES } from '../../prompts';
import { getSafeHtml } from '../../../utils';
import Icon from '../Icon';
import html2canvas from 'html2canvas';
import GIF from 'gif.js.optimized';

/**
 * @interface AiWriterViewProps
 * @description Props for the AiWriterView component.
 */
interface AiWriterViewProps {
  defaultAiPersonalityId: string;
  notes: Note[]; 
  onOpenNoteEditor: (noteData?: Partial<Note> | Note) => void; 
}

/**
 * @interface StructuredNoteFromAI
 * @description Defines the expected JSON structure for a note created by the AI.
 */
interface StructuredNoteFromAI {
    title: string;
    category: NoteCategory | '';
    subtitle?: string;
    content: string;
    tags: string[];
}

/**
 * The main view for a AI-powered chat interface for writers.
 * @param {AiWriterViewProps} props - The props for the component.
 */
const AiWriterView: React.FC<AiWriterViewProps> = ({
  defaultAiPersonalityId,
  notes,
  onOpenNoteEditor, 
}) => {
  const [messages, setMessages] = useState<AiChatLog[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [selectedAiPersonalityId, setSelectedAiPersonalityId] = useState<string>(defaultAiPersonalityId);
  const [isContextModalOpen, setIsContextModalOpen] = useState<boolean>(false);
  const [contextTextForNextMessage, setContextTextForNextMessage] = useState<string>('');
  const [selectedContextNotesCount, setSelectedContextNotesCount] = useState<number>(0);
  const [isCreatingNoteFromMessageId, setIsCreatingNoteFromMessageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'mentor'>('chat');
  const [isRecording, setIsRecording] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const ai = useRef(new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! })).current;
  const gifRef = useRef<GIF | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const allAiPersonalities = useMemo(() => [...Object.values(CORE_WRITING_PERSONALITIES)], []);

  const currentPersonality = useMemo(() => {
    return allAiPersonalities.find(p => p.id === selectedAiPersonalityId) || allAiPersonalities[0];
  }, [selectedAiPersonalityId, allAiPersonalities]);

  useEffect(() => {
    if (currentPersonality) {
      const newChat = ai.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
        systemInstruction: currentPersonality.systemPrompt,
      });
      setCurrentChat(newChat);
      setMessages([]); 
      setContextTextForNextMessage(''); 
      setSelectedContextNotesCount(0);
    }
  }, [currentPersonality, ai]);

  // ... rest of the component
  
  return (
    <div>
        {/* ... JSX for the component ... */}
    </div>
  );
};

export default AiWriterView;
