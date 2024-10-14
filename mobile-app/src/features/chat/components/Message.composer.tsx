import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { BiSend } from 'react-icons/bi';

import { useMessages } from '@/features/chat/messages.provider';
import Input from '@/components/Input/Input.global';
import { isStringEmpty } from '@/utils/string';

const MessageComposer = () => {
  const [message, setMessage] = useState<string>('');

  const { sendMessage } = useMessages();

  const messageComposerRef = useRef<HTMLFormElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isStringEmpty(message)) {
        sendMessage(message);

        if (messageInputRef.current) {
          messageInputRef.current.value = '';
          setMessage('');
        }
      }
    },
    [message],
  );

  useEffect(() => {
    function handleKeyboardWillShow(info: KeyboardInfo): void {
      if (messageComposerRef.current) {
        const keyboardHeight = info.keyboardHeight + 20;
        messageComposerRef.current.style.paddingBottom = `${keyboardHeight}px`;

        setTimeout(() => {
          const messagesListRef = document.getElementById('messages-list');

          if (messagesListRef) {
            messagesListRef.scrollTop = messagesListRef.scrollHeight;
          }
        }, 400);
      }
    }

    function handleKeyboardWillHide(): void {
      if (messageComposerRef.current) {
        messageComposerRef.current.style.paddingBottom = '20px';
      }
    }

    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);

    return () => {
      Keyboard.removeAllListeners();
    };
  }, []);

  return (
    <form
      className="flex w-full items-center gap-2.5 border-t border-solid border-t-border bg-light px-6 py-5 transition-all duration-[400]"
      onSubmit={onSubmit}
      ref={messageComposerRef}
    >
      <Input
        label="message"
        variant="outline"
        placeholder="Envoyer un message..."
        type="text"
        onChange={onChange}
        ref={messageInputRef}
      />
      <button
        data-visible={!isStringEmpty(message)}
        className="hidden h-full w-20 items-center justify-center rounded-[15px] bg-light-blue text-dark data-[visible=true]:flex"
        type="submit"
      >
        <BiSend className="size-6 text-primary" />
      </button>
    </form>
  );
};

export default MessageComposer;
