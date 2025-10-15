import { useEffect, useState } from "react";
import ReservationRequests from "./components/ReservationRequests";
import ChatList from "./components/ChatList";
import "./index.css";

const initialReservations = [
  { id: 1, customerName: "홍길동", service: "컷트", reservationDate: "2025-10-08T15:00:00", status: "PENDING" },
  { id: 2, customerName: "이영희", service: "염색", reservationDate: "2025-10-09T18:00:00", status: "PENDING" },
  { id: 3, customerName: "김민지", service: "펌",   reservationDate: "2025-10-09T18:00:00", status: "PENDING" },
];

const initialChats = [
  { chatId: 101, customerName: "홍길동", lastMessage: "내일 예약 가능할까요?", lastMessageTime: "2025-10-07T20:30:00", unreadCount: 2 },
  { chatId: 102, customerName: "이영희", lastMessage: "감사합니다~",         lastMessageTime: "2025-10-06T14:10:00", unreadCount: 0 },
];

export default function App() {
  // 로컬스토리지로 상태 유지(선택)
  const load = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [reservations, setReservations] = useState(() => load("reservations", initialReservations));
  const [chats, setChats] = useState(() => load("chats", initialChats));
  const [view, setView] = useState("reservationList");

  useEffect(() => localStorage.setItem("reservations", JSON.stringify(reservations)), [reservations]);
  useEffect(() => localStorage.setItem("chats", JSON.stringify(chats)), [chats]);

  // --- 공통 업데이트 함수들 ---
  const updateReservationStatusById = (id, newStatus) => {
    setReservations(prev => prev.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  // 채팅에서 '수락/거절/대기' 누르면 해당 고객의 최신 PENDING 예약을 찾아 상태 변경
  const updateReservationStatusByCustomer = (customerName, newStatus) => {
    // 가장 최근(=가장 늦은 날짜)의 PENDING 찾기
    const pending = reservations
      .filter(r => r.customerName === customerName && r.status === "PENDING")
      .sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate));

    if (pending.length === 0) return; // 없으면 무시

    const targetId = pending[0].id;
    updateReservationStatusById(targetId, newStatus);

    // 채팅의 미읽음 처리나 안내 메시지 시뮬(선택): 마지막 메시지/시간 갱신
    setChats(prev =>
      prev.map(c =>
        c.customerName === customerName
          ? {
              ...c,
              lastMessage:
                newStatus === "ACCEPTED"
                  ? "예약이 수락되었어요."
                  : newStatus === "REJECTED"
                  ? "예약이 거절되었어요."
                  : "예약 상태가 대기로 변경되었어요.",
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0,
            }
          : c
      )
    );
  };

  return (
    <div className="container">
      <h1>예약 목록,채팅 목록</h1>

      <div className="tabs">
        <button className={view==="reservationList"?"active":""} onClick={()=>setView("reservationList")}>예약 목록</button>
        <button className={view==="chatingList"?"active":""} onClick={()=>setView("chatingList")}>채팅 목록</button>
      </div>

      <div className="views">
        <section className={view==="reservationList" ? view : ""}>
          <h2>예약 목록</h2>
          <ReservationRequests
            reservations={reservations}
            onUpdateStatus={updateReservationStatusById}
          />
        </section>

        <section className={view==="chatingList" ? view : ""}>
          <h2>채팅 목록</h2>
          <ChatList
            chats={chats}
            onAccept={(name) => updateReservationStatusByCustomer(name, "ACCEPTED")}
            onReject={(name) => updateReservationStatusByCustomer(name, "REJECTED")}
            onPending={(name) => updateReservationStatusByCustomer(name, "PENDING")}
          />
        </section>
      </div>
    </div>
  );
}
