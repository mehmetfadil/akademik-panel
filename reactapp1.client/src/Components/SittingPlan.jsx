import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const SittingPlan = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignedSeats, setAssignedSeats] = useState([]);
    const [assistantName, setAssistantName] = useState('');
    const [notification, setNotification] = useState('');

    const logSeparator = (title) => {
        console.log(`%c--- ${title} ---`, 'color: #1e90ff; font-weight: bold; font-size: 14px;');
    };

    const fetchCourses = async () => {
        logSeparator("fetchCourses Baþladý");
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setNotification("Kullanýcý ID bulunamadý.");
            return;
        }

        try {
            const apiUrl = `https://localhost:7057/api/User/${userId}/department-courses`;
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Sunucu yanýtý: ${response.statusText}`);
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            console.error("Dersler API HATASI:", err);
            setNotification("Ders verileri çekilirken hata oluþtu.");
        }
    };

    const generateStudents = (count) => {
        return Array.from({ length: count }, (_, i) => ({
            id: `2202290${i.toString().padStart(2, '0')}`,
        }));
    };

    const createAmphiSeats = () => {
        const seats = [];
        for (let row = 1; row <= 10; row++) {
            seats.push({ row, section: 'left', index: 1, classroomType: 'amfi' });
            seats.push({ row, section: 'left', index: 2, classroomType: 'amfi' });
            seats.push({ row, section: 'middle', index: 1, classroomType: 'amfi' });
            seats.push({ row, section: 'right', index: 1, classroomType: 'amfi' });
            seats.push({ row, section: 'right', index: 2, classroomType: 'amfi' });
        }
        return seats;
    };

    const createNormalSeats = () => {
        const seats = [];
        for (let row = 1; row <= 30; row++) {
            seats.push({ row, section: 'left', index: 1, classroomType: 'normal' });
            seats.push({ row, section: 'middle', index: 1, classroomType: 'normal' });
            seats.push({ row, section: 'right', index: 1, classroomType: 'normal' });
        }
        return seats;
    };

    const assignStudents = (studentCount) => {
        const students = generateStudents(studentCount);
        const shuffled = [...students].sort(() => Math.random() - 0.5);
        const amphiSeats = createAmphiSeats();
        const normalSeats = createNormalSeats();
        const assigned = [];

        for (let i = 0; i < shuffled.length; i++) {
            const seat = amphiSeats[i] || normalSeats[i - amphiSeats.length];
            if (!seat) break;
            assigned.push({ ...seat, student: shuffled[i] });
        }
        setAssignedSeats(assigned);
    };

    const generatePDFDirectly = () => {
        if (!assistantName.trim()) {
            setNotification("PDF oluþturmak için lütfen bir gözetmen adý giriniz.");
            setTimeout(() => setNotification(''), 3000);
            return;
        }

        const element = document.getElementById("pdf-capture");

        html2canvas(element, {
            backgroundColor: "#ffffff",
            scale: 2,
            onclone: (clonedDoc) => {
                const container = clonedDoc.getElementById("pdf-capture");
                if (container) {
                    container.style.filter = "grayscale(100%)";
                }
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = 0;
            const imgY = 0;
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;

            pdf.addImage(imgData, "PNG", imgX, imgY, imgScaledWidth, imgScaledHeight);
            pdf.save(`oturma_duzeni_${selectedCourse.courseName}.pdf`);
        }).catch((error) => {
            console.error("PDF oluþturulurken hata:", error);
            setNotification("PDF oluþturulurken bir hata oluþtu.");
        });
    };

    useEffect(() => {
        logSeparator("Bileþen Yüklendi");
        fetchCourses();
    }, []);

    useEffect(() => {
        setAssistantName('');
        if (selectedCourse && typeof selectedCourse.courseSize === 'number' && selectedCourse.courseSize > 0) {
            assignStudents(selectedCourse.courseSize);
        } else {
            setAssignedSeats([]);
        }
    }, [selectedCourse]);

    const groupedByClassroom = assignedSeats.reduce((acc, seat) => {
        const key = seat.classroomType;
        if (!acc[key]) acc[key] = [];
        acc[key].push(seat);
        return acc;
    }, {});

    const renderClassroom = (seats, classroomType) => {
        const grouped = seats.reduce((acc, seat) => {
            if (!acc[seat.row]) acc[seat.row] = [];
            acc[seat.row].push(seat);
            return acc;
        }, {});

        return (
            <div className="w-full md:w-1/2 p-2">
                <h2 className="text-lg font-bold mb-2 text-center">{classroomType === 'amfi' ? 'Amfi Sýnýfý' : 'Normal Sýnýf'}</h2>
                <div className="space-y-2 border rounded p-2 bg-white">
                    {Object.entries(grouped).map(([row, rowSeats]) => (
                        <div key={row} className="flex justify-center space-x-8">
                            {['left', 'middle', 'right'].map((section) => (
                                <div key={section} className="flex space-x-2">
                                    {rowSeats
                                        .filter((s) => s.section === section)
                                        .map((seat, idx) => (
                                            <div key={`${seat.row}-${section}-${idx}`} className="w-16 h-16 border border-black text-xs flex items-center justify-center text-center bg-white">
                                                {seat.student ? seat.student.id : '-'}
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 min-h-screen bg-white font-sans">
            <style>
                {`#pdf-capture * {
                    background-color: white !important;
                    color: black !important;
                    border-color: black !important;
                }`}
            </style>

            <div id="pdf-capture">
                <h1 className="text-3xl font-bold mb-6 text-black">Sýnav Oturma Düzeni Planlayýcý</h1>

                {notification && (
                    <div className="mb-4 p-3 rounded-md bg-gray-200 text-red-700 text-center">
                        {notification}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-3 text-black">1. Ders Seçimi</h2>
                        <div className="flex flex-wrap gap-2">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <button
                                        key={course.courseName}
                                        onClick={() => setSelectedCourse(course)}
                                        className={`px-4 py-2 rounded-md border transition-all duration-200 ${selectedCourse?.courseName === course.courseName
                                            ? "bg-black text-white"
                                            : "bg-white text-black hover:bg-gray-100"
                                            }`}
                                    >
                                        {course.courseName}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500">Yüklenecek ders bulunamadý...</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-3 text-black">2. Gözetmen Adý Giriniz</h2>
                        <input
                            type="text"
                            value={assistantName}
                            onChange={(e) => setAssistantName(e.target.value)}
                            placeholder="Gözetmen adýný ve soyadýný yazýnýz..."
                            className="w-full p-2 border border-gray-600 rounded-md"
                            disabled={!selectedCourse}
                        />
                    </div>
                </div>

                {selectedCourse && (
                    <>
                        <div className="mb-6 text-center p-4 bg-gray-100 border border-black rounded">
                            <p className="font-semibold text-lg text-black">
                                <span className="font-bold">{selectedCourse.courseName}</span> dersi için oturma planý hazýrlanýyor.
                            </p>
                            {assistantName && (
                                <p className="text-md text-black mt-1">
                                    Atanan Gözetmen: <span className="font-bold">{assistantName}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4 border rounded-lg bg-white">
                            {groupedByClassroom['amfi'] && renderClassroom(groupedByClassroom['amfi'], 'amfi')}
                            {groupedByClassroom['normal'] && renderClassroom(groupedByClassroom['normal'], 'normal')}
                        </div>
                    </>
                )}
            </div>

            {selectedCourse && (
                <div className="mt-6 text-center">
                    <button
                        onClick={generatePDFDirectly}
                        disabled={!assistantName.trim()}
                        className="px-6 py-3 text-white font-bold rounded-lg bg-black hover:bg-gray-800 disabled:bg-gray-400"
                    >
                        PDF Olarak Kaydet
                    </button>
                    {!assistantName.trim() && (
                        <p className="text-gray-500 text-sm mt-2">
                            PDF oluþturmak için bir gözetmen adý girmelisiniz.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SittingPlan;
