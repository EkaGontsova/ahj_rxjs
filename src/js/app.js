/* eslint-disable no-console */
import { ajax } from 'rxjs/ajax';
import { interval } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const shortenSubject = (subject) => (subject.length > 15 ? `${subject.substring(0, 15)}...` : subject);

const addMessageToContainer = (message) => {
  const container = document.querySelector('.content');

  const messageElement = document.createElement('div');
  messageElement.className = 'message';

  messageElement.innerHTML = `
      <p class="from">${message.from}</p>
      <p class="subject">${shortenSubject(message.subject)}</p>
      <p class="date">${formatTimestamp(message.received)}</p>
  `;
  container.appendChild(messageElement);
};

const fetchUnreadMessages = () => interval(5000).pipe(
  switchMap(() => ajax.getJSON('http://localhost:3000/messages/unread').pipe(
    map((response) => response.messages),
    catchError((error) => {
      console.error('Error fetching messages:', error);
      return [null];
    }),
  )),
);

fetchUnreadMessages().subscribe((messages) => {
  if (messages && messages.length > 0) {
    messages.forEach(addMessageToContainer);
  }
});
