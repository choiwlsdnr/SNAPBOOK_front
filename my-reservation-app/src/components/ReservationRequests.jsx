import { useMemo, useState } from "react";

export default function ReservationRequests({ reservations, onUpdateStatus }) {
  const [tab, setTab] = useState("ALL"); // ALL | PENDING | ACCEPTED | REJECTED

  const counts = useMemo(() => ({
    total: reservations.length,
    pending: reservations.filter(r => r.status === "PENDING").length,
    accepted: reservations.filter(r => r.status === "ACCEPTED").length,
    rejected: reservations.filter(r => r.status === "REJECTED").length,
  }), [reservations]);

  const filtered = useMemo(() => {
    if (tab === "ALL") return reservations;
    return reservations.filter(r => r.status === tab);
  }, [reservations, tab]);

  const badgeStyle = (s) =>
    ({
      PENDING:  { background:"#fff3cd", color:"#7a5b00" },
      ACCEPTED: { background:"#d1e7dd", color:"#0a3622" },
      REJECTED: { background:"#f8d7da", color:"#842029" },
    }[s] || {});

  return (
    <>
      <div className="tabs">
        <button className={tab==="ALL"?"active":""} onClick={()=>setTab("ALL")}>전체 {counts.total}</button>
        <button className={tab==="PENDING"?"active":""} onClick={()=>setTab("PENDING")}>대기 {counts.pending}</button>
        <button className={tab==="ACCEPTED"?"active":""} onClick={()=>setTab("ACCEPTED")}>수락 {counts.accepted}</button>
        <button className={tab==="REJECTED"?"active":""} onClick={()=>setTab("REJECTED")}>거절 {counts.rejected}</button>
      </div>

      <ul className="list">
        {filtered.map(req => (
          <li key={req.id} className="card">
            <div className="row">
              <div className="left">
                <div className="title">
                  <strong>{req.customerName}</strong>
                  <span className="service">({req.service})</span>
                </div>
                <div className="date">{new Date(req.reservationDate).toLocaleString()}</div>
              </div>

              <div className="right">
                <span className="badge" style={badgeStyle(req.status)}>{req.status}</span>

                {req.status === "PENDING" ? (
                  <div className="actions">
                    <button onClick={() => onUpdateStatus(req.id, "ACCEPTED")}>수락</button>
                    <button className="danger" onClick={() => onUpdateStatus(req.id, "REJECTED")}>거절</button>
                  </div>
                ) : (
                  <button className="ghost" onClick={() => onUpdateStatus(req.id, "PENDING")}>
                    되돌리기
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="empty">해당 상태의 예약이 없습니다.</li>}
      </ul>
    </>
  );
}
