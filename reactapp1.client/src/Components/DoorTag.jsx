import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DoorTag() {
    const [userName, setUserName] = useState(null);
    const [courses, setCourses] = useState([]);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const name = localStorage.getItem("userName");
        const id = localStorage.getItem("userId");
        if (name && id) {
            setUserName(name);
            fetch(`https://localhost:7057/api/User/${id}/courses`)
                .then(res => res.json())
                .then(data => setCourses(data));
        }
    }, []);

    const generateEntirePagePDF = async () => {
        setNotification("PDF oluþturuluyor, lütfen bekleyin...");

     
        const style = document.createElement('style');
        style.id = 'temp-pdf-styles';
        style.innerHTML = `
            /* Evrensel seçici ile tüm elemanlarý hedefle */
            *, *::before, *::after {
                color: black !important;
                background-color: transparent !important; /* Arka planlarý þeffaf yap */
                border-color: black !important;
                text-shadow: none !important;
                box-shadow: none !important;
            }
            /* Sayfanýn ana arka planýný beyaz yap */
            body {
                background-color: white !important;
            }
            /* SVG ve img gibi elementlerin renklerini sýfýrla */
            svg, img {
                filter: grayscale(100%) !important;
            }
        `;

   
        document.head.appendChild(style);

        try {
       
            const canvas = await html2canvas(document.body, {
                scale: 1.5,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
            const scaledWidth = imgProps.width * ratio;
            const scaledHeight = imgProps.height * ratio;
            const x = (pdfWidth - scaledWidth) / 2;
            const y = (pdfHeight - scaledHeight) / 2;

            pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
            pdf.save(`kapi_isimligi_tam_sayfa.pdf`);
            setNotification("PDF baþarýyla oluþturuldu!");

        } catch (error) {
            console.error("PDF oluþturulurken hata:", error);
            setNotification("PDF oluþturulurken bir hata oluþtu.");
        } finally {
   
            const tempStyle = document.getElementById('temp-pdf-styles');
            if (tempStyle) {
                tempStyle.remove();
            }
            setTimeout(() => setNotification(''), 3000);
        }
    };

    return (

        <div className="p-10 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-indigo-600">
                    Kapý Ýsimliði
                </h2>
                <button
                    onClick={generateEntirePagePDF}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    Tüm Sayfayý PDF Olarak Ýndir
                </button>
            </div>

            {notification && (
                <div className="mb-4 p-3 text-center text-white bg-red-500 rounded-lg">
                    {notification}
                </div>
            )}

            <div className="p-8 bg-white border rounded-lg">
                <h3 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                    {userName}
                </h3>

                <table className="min-w-full bg-white border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Saat</th>
                            <th className="border px-4 py-2">Pazartesi</th>
                            <th className="border px-4 py-2">Salý</th>
                            <th className="border px-4 py-2">Çarþamba</th>
                            <th className="border px-4 py-2">Perþembe</th>
                            <th className="border px-4 py-2">Cuma</th>
                        </tr>
                    </thead>
                    <tbody>
                        {["09:00", "11:00", "13:00", "15:00"].map((slot) => (
                            <tr key={slot}>
                                <td className="border px-4 py-2 font-semibold">{slot}</td>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                                    const courseAtTime = courses.find((c) =>
                                        c.schedules?.some((s) =>
                                            s.day === day && s.startTime.startsWith(slot)
                                        )
                                    );
                                    return (
                                        <td className="border px-4 py-3" key={day + slot}>
                                            {courseAtTime ? (
                                                <>
                                                    <div className="font-semibold">{courseAtTime.courseName}</div>
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {courseAtTime.schedules.find(s =>
                                                            s.day === day &&
                                                            s.startTime.startsWith(slot)
                                                        )?.roomName}
                                                    </div>
                                                </>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}