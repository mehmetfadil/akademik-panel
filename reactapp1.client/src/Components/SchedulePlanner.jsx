import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["09:00", "11:00", "13:00", "15:00"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];


function DraggableCourse({ course }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "COURSE",
        item: course,
        collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
    }));

    return (
        <div
            ref={drag}
            className={`p-2 border rounded bg-indigo-100 mb-2 cursor-move ${isDragging ? "opacity-50" : ""}`}
        >
            {course.courseName}
        </div>
    );
}

function DropSlot({ day, time, className, onDrop, scheduled }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "COURSE",
        drop: (item) => onDrop(day, time, className, item),
        collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }));

    return (
        <div
            ref={drop}
            className={`h-24 border p-2 text-xs text-center whitespace-pre-wrap flex items-center justify-center ${isOver ? "bg-green-100" : "bg-white"}`}
        >
            {scheduled ? (
                <div className="w-full h-full bg-green-200 p-1 rounded">
                    <p className="font-bold">{scheduled.courseName}</p>
                    <p className="text-gray-600">({scheduled.roomName})</p>
                </div>
            ) : null}
        </div>
    );
}



export default function CourseScheduler() {

    const [courses, setCourses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [modalData, setModalData] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [classNames, setClassNames] = useState(["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B"]);


    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return; 

        
        fetch(`https://localhost:7057/api/User/${userId}/courses`)
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((c) => ({
                    courseID: c.courseID ?? c.id,
                    courseName: c.courseName ?? c.name,
                    semester: c.semester,
                }));
                setCourses(formatted);
            })
            .catch(console.error);

        fetch("https://localhost:7057/api/Room")
            .then((res) => res.json())
            .then(setRooms)
            .catch(console.error);

        fetch(`https://localhost:7057/api/User/${userId}/department-instructors`)
            .then((res) => res.json())
            .then((data) => (console.log("Gelen Veri:", data), data))
            .then(setInstructors)
            .catch(console.error);
    }, []);

    const handleDrop = (day, time, className, course) => {
        setModalData({ course, day, time, className, roomId: "", instructorId: "" });
    };

    const isConflict = (day, time, className, instructorId, roomId) => {
        const classSlotKey = `${className}-${day}-${time}`;
        if (schedule[classSlotKey]) {
            alert(`Çakýþma: ${className} sýnýfýnýn bu saatte zaten bir dersi var.`);
            return true;
        }

        for (const key in schedule) {
            const [scClassName, scDay, scTime] = key.split('-');
            if (scDay === day && scTime === time) {
                if (schedule[key].instructorId === instructorId) {
                    alert(`Çakýþma: Öðretim elemaný bu saatte baþka bir derse atanmýþ.`);
                    return true;
                }
                if (schedule[key].roomId === roomId) {
                    alert(`Çakýþma: Derslik bu saatte baþka bir ders için dolu.`);
                    return true;
                }
            }
        }
        return false;
    };

    const confirmSchedule = async () => {
        const { course, day, time, className, roomId, instructorId } = modalData;

        if (!roomId || !instructorId) {
            alert("Lütfen derslik ve öðretim elemaný seçiniz.");
            return;
        }

        if (isConflict(day, time, className, parseInt(instructorId), parseInt(roomId))) {
            return;
        }

        const scheduleBody = {
            CourseID: course.courseID,
            Day: day,
            StartTime: `${time}:00`,
            EndTime: getEndTime(time),
            RoomID: parseInt(roomId),
            Course: null,
            Room: null
        };

        try {
            const res = await fetch("https://localhost:7057/api/Schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(scheduleBody),
            });

            if (res.ok) {
                const key = `${className}-${day}-${time}`;
                setSchedule((prev) => ({
                    ...prev,
                    [key]: {
                        courseName: course.courseName,
                        roomName: rooms.find((r) => r.roomID === parseInt(roomId))?.roomName,
                        instructorId: parseInt(instructorId),
                        roomId: parseInt(roomId)
                    },
                }));
                setModalData(null);
            } else {
                const errorText = await res.text();
                console.error("Kayýt baþarýsýz:", errorText);
                alert(`Program kaydedilemedi: ${errorText}`);
            }
        } catch (err) {
            console.error("Hata:", err);
            alert("Bir hata oluþtu. Lütfen konsolu kontrol edin.");
        }
    };

    const getEndTime = (startTime) => {
        const hours = parseInt(startTime.split(":")[0]) + 2;
        return `${hours.toString().padStart(2, "0")}:00`;
    };

    const filteredCourses = courses.filter((c) => c.semester === selectedSemester);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen p-4 gap-4 bg-gray-50">
                
                <div className="w-1/4 bg-white p-4 border rounded-lg shadow-sm overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Dersler</h2>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Dönem Seç</label>
                    <select
                        className="w-full border rounded p-2 mb-4 bg-gray-50"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                    >
                        {semesters.map((s) => (
                            <option key={s} value={s}>Dönem {s}</option>
                        ))}
                    </select>
                    {filteredCourses.map((c) => (
                        <DraggableCourse key={c.courseID} course={c} />
                    ))}
                </div>

                
                <div className="flex-1 overflow-auto space-y-8">
                    {classNames.map((className) => (
                        <div key={className} className="bg-white p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 text-indigo-700">Sýnýf: {className}</h3>
                            <table className="w-full table-fixed border-collapse text-center text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="w-24 p-2 border">Saat</th>
                                        {days.map((day) => (
                                            <th key={day} className="p-2 border">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((time) => (
                                        <tr key={time}>
                                            <td className="font-semibold p-2 border">{time}</td>
                                            {days.map((day) => {
                                                const key = `${className}-${day}-${time}`;
                                                return (
                                                    <td key={key} className="border">
                                                        <DropSlot
                                                            day={day}
                                                            time={time}
                                                            className={className}
                                                            scheduled={schedule[key]}
                                                            onDrop={handleDrop}
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>

                {modalData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Ders Detaylarýný Seç</h2>
                            <p className="mb-1"><strong>Ders:</strong> {modalData.course.courseName}</p>
                            <p className="mb-4"><strong>Sýnýf:</strong> {modalData.className}</p>

                            <label className="block mt-4 mb-1 font-medium">Derslik Seç:</label>
                            <select
                                className="w-full border rounded p-2"
                                value={modalData.roomId}
                                onChange={(e) =>
                                    setModalData({ ...modalData, roomId: e.target.value })
                                }
                            >
                                <option value="">-- Derslik Seçiniz --</option>
                                {rooms.map((r) => (
                                    <option key={r.roomID} value={r.roomID}>{r.roomName} (Kapasite: {r.capacity})</option>
                                ))}
                            </select>

                            <label className="block mt-4 mb-1 font-medium">Öðretim Elemaný Seç:</label>
                            <select
                                className="w-full border rounded p-2"
                                value={modalData.instructorId}
                                onChange={(e) =>
                                    setModalData({ ...modalData, instructorId: e.target.value })
                                }
                            >
                                <option value="">-- Öðretim Elemaný Seçiniz --</option>
                                {instructors.map((i) => (
                                    <option key={i.id} value={i.id}>{i.name}</option>
                                ))}
                            </select>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setModalData(null)}
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                >
                                    Ýptal
                                </button>
                                <button
                                    onClick={confirmSchedule}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DndProvider>
    );
}
