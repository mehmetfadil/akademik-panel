import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const TIME_SLOTS = ["09:00 - 11:00", "11:00 - 13:00", "13:00 - 15:00", "15:00 - 17:00"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];



function DraggableCourse({ course, disabled }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "COURSE",
        item: { ...course, source: "sidebar" },
        canDrag: !disabled,
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }), [disabled]);

    return (
        <div
            ref={disabled ? null : drag}
            style={{ backgroundColor: "#c7d2fe" }}
            className={`p-2 border rounded mb-2 ${disabled ? "cursor-not-allowed" : "cursor-move"} ${isDragging ? "opacity-50" : ""}`}
        >
            {course.name}
        </div>
    );
}

DraggableCourse.propTypes = {
    course: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
};

function ScheduledCourse({ course, day, time, disabled }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "COURSE",
        item: { ...course, source: "schedule", day, time },
        canDrag: !disabled,
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }), [disabled]);

    return (
        <div
            ref={disabled ? null : drag}
            style={{ backgroundColor: "#bbf7d0" }}
            className={`p-2 border rounded h-full flex items-center justify-center ${disabled ? "cursor-default" : "cursor-move"} ${isDragging ? "opacity-50" : ""}`}
        >
            {course.name}
        </div>
    );
}

ScheduledCourse.propTypes = {
    course: PropTypes.object.isRequired,
    day: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
};

function DropSlot({ day, time, scheduledCourse, onDrop, disabled }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "COURSE",
        canDrop: () => !disabled,
        drop: (item) => onDrop(day, time, item),
        collect: (monitor) => ({
            isOver: !disabled && !!monitor.isOver(),
        }),
    }), [disabled, onDrop]);

    return (
        <div
            ref={disabled ? null : drop}
            className="h-20 border p-1 text-sm text-center select-none"
            style={{ backgroundColor: isOver ? "#d1fae5" : "#fff" }}
        >
            {scheduledCourse && (
                <ScheduledCourse course={scheduledCourse} day={day} time={time} disabled={disabled} />
            )}
        </div>
    );
}

DropSlot.propTypes = {
    day: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    scheduledCourse: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};



export default function ExamSchedulePage() {

    const [semester, setSemester] = useState(1);
    const [courses, setCourses] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("Anonim");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comments, setComments] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem("examComments"));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    });
    const [commentInput, setCommentInput] = useState("");

    const weekRefs = [useRef(null), useRef(null)];
    const isDragDisabled = userRole !== "admin";


    useEffect(() => {
        try {
            const storedUserId = localStorage.getItem("userId");
            const storedRole = localStorage.getItem("userRole");
            const storedName = localStorage.getItem("userName");

            if (!storedUserId || !storedRole) {
                throw new Error("Kullanýcý bilgileri bulunamadý. Lütfen giriþ yapýn.");
            }

            setUserRole(storedRole);
            setUserName(storedName || "Kullanýcý");

            const savedSchedule = JSON.parse(localStorage.getItem("examSchedule"));
            if (savedSchedule && typeof savedSchedule === "object") {
                setSchedule(savedSchedule);
            }

            fetch(`https://localhost:7057/api/User/${storedUserId}/courses`)
                .then((res) => {
                    if (!res.ok) throw new Error("Dersler alýnamadý.");
                    return res.json();
                })
                .then((data) => {
                    const formatted = data.map((c) => ({
                        id: c.id ?? c.courseID,
                        name: c.name ?? c.courseName,
                        semester: c.semester,
                    }));
                    setCourses(formatted);
                })
                .catch((err) => setError(err.message));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("examSchedule", JSON.stringify(schedule));
    }, [schedule]);


    const handleDrop = (day, time, item) => {
        if (isDragDisabled) return;

        setSchedule((prev) => {
            const newSchedule = { ...prev };
            if (item.source === "schedule") {
                const oldKey = `${item.day}-${item.time}`;
                delete newSchedule[oldKey];
            }
            const key = `${day}-${time}`;
            newSchedule[key] = {
                id: item.id,
                name: item.name,
                semester: item.semester,
            };
            return newSchedule;
        });
    };

    const handleCommentSubmit = () => {
        if (commentInput.trim() === "") return;
        const newComment = { user: userName, text: commentInput };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setCommentInput("");
        localStorage.setItem("examComments", JSON.stringify(updatedComments));
    };

    const exportToPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");
        for (let i = 0; i < 2; i++) {
            const input = weekRefs[i].current;
            if (input) {
                const canvas = await html2canvas(input, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL("image/png");
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 5, 5, pdfWidth - 10, pdfHeight);
            }
        }
        pdf.save("sinav_takvimi.pdf");
    };

    if (loading) return <div className="text-center p-10">Yükleniyor...</div>;
    if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col min-h-screen p-4 bg-gray-100">
                <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Sýnav Takvimi Oluþturma</h1>
                        <p className="text-sm text-gray-600">
                            Hoþ geldiniz, {userName} (Rol: {userRole})
                        </p>
                    </div>
                    <button
                        onClick={exportToPDF}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Takvimi PDF Olarak Ýndir
                    </button>
                </div>

                <div className="flex flex-1 flex-col xl:flex-row overflow-hidden gap-4">
                    <div className="flex-1 flex gap-4">
                        <div className="w-1/3 p-4 bg-white rounded-lg shadow overflow-y-auto">
                            <h2 className="text-lg font-semibold mb-4">Dönem Seç</h2>
                            <select
                                className="mb-4 w-full border rounded p-2"
                                value={semester}
                                onChange={(e) => setSemester(Number(e.target.value))}
                            >
                                {SEMESTERS.map((s) => (
                                    <option key={s} value={s}>{s}. Dönem</option>
                                ))}
                            </select>
                            <h2 className="text-lg font-semibold mb-2">Dersler</h2>
                            {isDragDisabled && (
                                <div className="p-2 mb-2 text-sm text-yellow-800 bg-yellow-100 rounded-lg">
                                    Sadece admin kullanýcýlar dersleri takvime sürükleyebilir.
                                </div>
                            )}
                            {courses
                                .filter((c) => c.semester === semester)
                                .map((course) => (
                                    <DraggableCourse
                                        key={course.id}
                                        course={course}
                                        disabled={isDragDisabled}
                                    />
                                ))}
                        </div>

                        <div className="flex-1 p-4 overflow-auto bg-white rounded-lg shadow">
                            {[...Array(2)].map((_, week) => (
                                <div key={`week-${week}`} ref={weekRefs[week]} className="mb-8 p-4 border rounded-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-center">Hafta {week + 1}</h3>
                                    <div className="grid grid-cols-6 gap-1">
                                        <div className="font-bold">Saat</div>
                                        {DAYS.map((day) => (
                                            <div key={`header-${week}-${day}`} className="text-center font-bold">{day}</div>
                                        ))}
                                        {TIME_SLOTS.map((time) => (
                                            <React.Fragment key={`row-${week}-${time}`}>
                                                <div className="text-sm font-semibold text-right pr-2 flex items-center justify-end">{time}</div>
                                                {DAYS.map((day) => {
                                                    const key = `${day}-w${week}-${time}`;
                                                    return (
                                                        <DropSlot
                                                            key={key}
                                                            day={`${day}-w${week}`}
                                                            time={time}
                                                            onDrop={handleDrop}
                                                            scheduledCourse={schedule[key]}
                                                            disabled={isDragDisabled}
                                                        />
                                                    );
                                                })}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full xl:w-1/3 p-4 bg-white rounded-lg shadow overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Yorumlar</h2>
                    
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">Yorum Yaz</h3>
                            <textarea
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                className="w-full border rounded p-2 mb-2"
                                placeholder="Takvim hakkýndaki yorumunuzu yazýn..."
                                rows={4}
                            />
                            <button
                                onClick={handleCommentSubmit}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Yorumu Gönder
                            </button>
                        </div>
                        {/* Yorum Listesi */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Önceki Yorumlar</h3>
                            {comments.length === 0 ? (
                                <p className="text-sm text-gray-500">Henüz yorum yapýlmamýþ.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {comments.map((c, idx) => (
                                        <li key={idx} className="border rounded-lg p-3 bg-gray-50">
                                            <p className="text-sm font-bold text-gray-800">{c.user}</p>
                                            <p className="text-sm text-gray-600">{c.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}