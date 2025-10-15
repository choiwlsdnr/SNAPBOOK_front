export default function ChatList({ chats, onAccept, onReject, onPending }) {
  // 최신 메세지 순으로 정렬
  const sorted = [...chats].sort(
    (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );

  return (
    <ul className="list">
      {sorted.map(chat => (
        <li key={chat.chatId} className="card">
          <div className="row">
            <div className="left">
              <div className="title">
                <strong>{chat.customerName}</strong>
                {chat.unreadCount > 0 && (
                  <span className="pill">{chat.unreadCount}</span>
                )}
              </div>
              <div className="last">
                <span className="muted">{new Date(chat.lastMessageTime).toLocaleString()}</span>
                <div className="ellipsis">{chat.lastMessage}</div>
              </div>
            </div>

            <div className="right actions">
              <button onClick={() => onAccept(chat.customerName)}>수락</button>
              <button className="danger" onClick={() => onReject(chat.customerName)}>거절</button>
              <button className="ghost" onClick={() => onPending(chat.customerName)}>대기</button>
            </div>
          </div>
        </li>
      ))}
      {sorted.length === 0 && <li className="empty">채팅이 없습니다.</li>}
    </ul>
  );
}
