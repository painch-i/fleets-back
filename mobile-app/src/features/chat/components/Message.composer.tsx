/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { BiSend } from 'react-icons/bi';

import { useMessages } from '@/features/chat/messages.provider';
import Input from '@/components/Input/Input.global';
import { isStringEmpty } from '@/utils/string';
import { colors } from '@/styles';

const styles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  backgroundColor: colors.light,
  borderTop: `1px solid ${colors.border}`,
  padding: '20px 25px',
  transition: 'padding-bottom 0.4s ease',
  '.composer-submit-button': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    background: '#e6ecfc',
    borderRadius: 15,
    color: colors.dark,
  },
});

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
    <form css={styles} onSubmit={onSubmit} ref={messageComposerRef}>
      <Input
        label="message"
        variant="outline"
        placeholder="Envoyer un message..."
        type="text"
        onChange={onChange}
        ref={messageInputRef}
      />
      {!isStringEmpty(message) && (
        <button className="composer-submit-button" type="submit">
          <BiSend size={24} color={colors.primary} />
        </button>
      )}
    </form>
  );
};

export default MessageComposer;
