import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';


const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];
const DAYS_OF_WEEK_TR = ["Pazartesi", "Sal�", "�ar�amba", "Per�embe", "Cuma"];
const DAY_MAP = {
    "Monday": "Pazartesi",
    "Tuesday": "Sal�",
    "Wednesday": "�ar�amba",
    "Thursday": "Per�embe",
    "Friday": "Cuma",
};


const RoomAssignments = () => {
 
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [newRoom, setNewRoom] = useState({ roomName: '', capacity: '', departmanID: '' });
    const [departments, setDepartments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'https://localhost:7057/api';

    useEffect(() => {
        console.log("LOG: 1. Component y�klendi, ilk veriler �ekiliyor...");
        const fetchData = async () => {
            setLoadingRooms(true);
            try {
                const [roomsResponse, deptsResponse] = await Promise.all([
                    axios.get(`${API_URL}/Room`),
                    axios.get(`${API_URL}/Department`)
                ]);

                const roomsData = Array.isArray(roomsResponse.data) ? roomsResponse.data : [];
                const deptsData = Array.isArray(deptsResponse.data) ? deptsResponse.data : [];

                console.log("LOG: 2. Derslikler ve departmanlar ba�ar�yla �ekildi.", { rooms: roomsData, departments: deptsData });

                setRooms(roomsData);
                setDepartments(deptsData);

            } catch (err) {
                console.error("HATA LOG: 2. �lk veri �ekme ba�ar�s�z!", err);
                setError('Derslikler veya departmanlar y�klenemedi. API ba�lant�n�z� veya URL\'i kontrol edin.');
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchData();
    }, []);

    const scheduleGrid = useMemo(() => {
        console.log("LOG: 5. scheduleGrid hesaplan�yor. Gelen dersler:", assignedCourses);

        const grid = {};
        DAYS_OF_WEEK_TR.forEach(day => {
            grid[day] = {};
            TIME_SLOTS.forEach(time => {
                grid[day][time] = null;
            });
        });

        if (!assignedCourses || assignedCourses.length === 0) {
            console.log("LOG: 5.1. Hesaplanacak ders bulunmad��� i�in bo� grid d�nd�r�l�yor.");
            return grid;
        }

        assignedCourses.forEach(course => {
            if (!course || !course.day || !course.startTime || !course.endTime) {
                console.warn("UYARI LOG: Eksik bilgi i�eren ders verisi atland�:", course);
                return;
            }

            const turkishDay = DAY_MAP[course.day];
            if (!turkishDay) {
                console.warn(`UYARI LOG: E�le�meyen g�n ismi '${course.day}' olan ders atland�.`);
                return;
            }

            const startHour = parseInt(course.startTime.substring(0, 2));
            const endHour = parseInt(course.endTime.substring(0, 2));
            const duration = endHour - startHour;

            if (duration > 0) {
                const startTimeSlot = `${String(startHour).padStart(2, '0')}:00`;
                grid[turkishDay][startTimeSlot] = { course, rowSpan: duration };

                for (let i = 1; i < duration; i++) {
                    const nextTimeSlot = `${String(startHour + i).padStart(2, '0')}:00`;
                    grid[turkishDay][nextTimeSlot] = 'occupied';
                }
            } else {
                console.warn("UYARI LOG: S�resi 0 veya negatif olan ders atland�:", course);
            }
        });

        console.log("LOG: 6. Grid hesaplamas� tamamland�. Sonu�:", grid);
        return grid;

    }, [assignedCourses]);


    const handleRoomClick = async (room) => {
        console.log(`LOG: 3. Derslik t�kland�: '${room.roomName}' (ID: ${room.roomID}). Dersler �ekiliyor...`);
        setSelectedRoom(room);
        setLoadingCourses(true);
        setAssignedCourses([]); 
        try {
            const response = await axios.get(`${API_URL}/Room/${room.roomID}/courses`);
            console.log(`LOG: 4. API'den gelen dersler (${room.roomName}):`, response.data);
            setAssignedCourses(response.data || []);
        } catch (err) {
            console.error(`HATA LOG: 4. Dersler �ekilemedi (Oda ID: ${room.roomID})!`, err);
            setAssignedCourses([]);
        } finally {
            setLoadingCourses(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prevState => ({ ...prevState, [name]: value }));
    };

    
    const handleCreateRoom = async (e) => {
        e.preventDefault();

       
        if (!newRoom.roomName || !newRoom.capacity || !newRoom.departmanID) {
            setError('T�m alanlar zorunludur.');
            return;
        }

        const capacityValue = parseInt(newRoom.capacity, 10);
        const departmanIDValue = parseInt(newRoom.departmanID, 10);

      
        if (isNaN(capacityValue) || isNaN(departmanIDValue)) {
            setError('Kapasite bir say� olmal�d�r ve Departman se�ilmelidir.');
            return;
        }

        setIsSubmitting(true);
        setError('');
     
       
        const roomData = {
            RoomName: newRoom.roomName,
            Capacity: capacityValue,
            DepartmanID: 1
        };

        try {
            console.log("API'ye g�nderilen derslik verisi:", roomData); 
            const response = await axios.post(`${API_URL}/Room`, roomData);
            setRooms(prevRooms => [...prevRooms, response.data]);
            setNewRoom({ roomName: '', capacity: '', departmanID: '' }); 

        } catch (err) {
            console.error('Derslik olu�turulurken hata:', err);
            if (err.response) {
               
                const errorData = err.response.data;
                const errorMessages = errorData.errors ? Object.values(errorData.errors).flat().join(' ') : JSON.stringify(errorData);
                setError(`Derslik olu�turulamad�: ${errorMessages}`);
            } else {
                setError('Derslik olu�turulamad�. L�tfen tekrar deneyin.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

   
    console.log("LOG: RENDER. Mevcut state'ler:", {
        loadingRooms,
        loadingCourses,
        roomsCount: rooms.length,
        selectedRoom: selectedRoom ? selectedRoom.roomName : null,
        assignedCoursesCount: assignedCourses.length,
        error,
    });


    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

            {}
            <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Yeni Derslik Ekle</h2>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="roomName"
                            value={newRoom.roomName}
                            onChange={handleInputChange}
                            placeholder="Derslik Ad� (�rn: B-101)"
                            className="p-2 border rounded w-full"
                        />
                        <input
                            type="number"
                            name="capacity"
                            value={newRoom.capacity}
                            onChange={handleInputChange}
                            placeholder="Kapasite"
                            className="p-2 border rounded w-full"
                        />
                        <select
                            name="departmanID"
                            value={newRoom.departmanID}
                            onChange={handleInputChange}
                            className="p-2 border rounded w-full"
                        >
                            <option value="">Departman Se�iniz</option>
                            {departments.map(dept => (
                                <option key={dept.departmanID} value={dept.departmanID}>
                                    {dept.departmanName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? 'Ekleniyor...' : 'Derslik Ekle'}
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">T�m Derslikler</h2>
                {loadingRooms ? <p>Y�kleniyor...</p> : rooms.length === 0 ? <p>G�sterilecek derslik bulunamad�.</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow rounded-lg">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">Derslik Ad�</th>
                                    <th className="py-3 px-4 text-left">Kapasite</th>
                                    <th className="py-3 px-4 text-left">��lem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room.roomID} className="border-t hover:bg-gray-50">
                                        <td className="py-2 px-4">{room.roomName}</td>
                                        <td className="py-2 px-4">{room.capacity}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => handleRoomClick(room)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Dersleri G�ster
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selectedRoom && (
                <section>
                    <h2 className="text-xl font-semibold mb-4">
                        �{selectedRoom.roomName}� Ders Program�
                    </h2>
                    {loadingCourses ? <p>Ders program� y�kleniyor...</p> : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="min-w-full text-center border-collapse">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-3 border border-gray-300 w-24">Saat</th>
                                        {DAYS_OF_WEEK_TR.map(day => (
                                            <th key={day} className="p-3 border border-gray-300">{day}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map(time => (
                                        <tr key={time} className="h-20">
                                            <td className="p-2 border border-gray-300 font-semibold bg-gray-100">
                                                {time}
                                            </td>
                                            {DAYS_OF_WEEK_TR.map(day => {
                                                const cellData = scheduleGrid[day]?.[time];

                                                if (cellData && cellData !== 'occupied') {
                                                    return (
                                                        <td
                                                            key={day}
                                                            className="p-2 border border-gray-300 bg-blue-100 text-blue-800 align-top text-left"
                                                            rowSpan={cellData.rowSpan}
                                                        >
                                                            <div className="font-bold">{cellData.course.courseName}</div>
                                                            <div className="text-xs">D�nem: {cellData.course.semester}</div>
                                                        </td>
                                                    );
                                                } else if (cellData === 'occupied') {
                                                    return null;
                                                } else {
                                                    return <td key={day} className="p-2 border border-gray-300"></td>;
                                                }
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default RoomAssignments;

