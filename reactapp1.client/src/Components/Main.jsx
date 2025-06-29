import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Main() {
    const sections = [
        {
            title: "Ders Programý Hazýrlama",
            description: "Derslerin haftalýk programýný planlayýn.",
            img: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png",
            link: "/ders-programi"
        },
        {
            title: "Dersliklere Ders Atama ve Görüntüleme",
            description: "Derslik bazlý ders daðýlýmýný yönetin.",
            img: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png",
            link: "/derslik-ders-atama"
        },
        {
            title: "Sýnav Programý Hazýrlama",
            description: "Sýnav tarihlerini ve saatlerini kolayca planlayýn.",
            img: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-mobile-friendly.png",
            link: "/sinav-programi"
        },
        {
            title: "Dersliklere Göre Sýnav Oturma Düzeni (Rastgele)",
            description: "Sýnav oturma planýný otomatik oluþturun.",
            img: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-security.png",
            link: "/sinav-oturma-duzeni"
        },
        {
            title: "Öðretim Elemaný Ders Programý (Kapý Ýsimliði)",
            description: "Hoca programlarýný yazdýrýlabilir þekilde alýn.",
            img: "https://tailwindcss.com/plus-assets/img/component-images/bento-03-performance.png",
            link: "/ogretim-elemani-programi"
        },
    ];

    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        
        const name = localStorage.getItem("userName");
        const id = localStorage.getItem("userId");
        const role = localStorage.getItem('userRole'); 

        setUserRole(role); 

        if (name && id) {
            setUserName(name);
          
            fetch(`https://localhost:7057/api/User/${id}/courses`)
                .then(res => res.json())
                .then(data => setCourses(data))
                .catch(err => console.error("Dersler alýnamadý:", err));
        } else {
          
            window.location.href = "/login";
        }
    }, []); 

   
    const titlesToHideForOE = [
        "Ders Programý Hazýrlama",
        "Dersliklere Ders Atama ve Görüntüleme"
    ];

   
    const displayedSections = userRole === 'oe'
        ? sections.filter(section => !titlesToHideForOE.includes(section.title))
        : sections;

    return (
        <div className="bg-gray-50 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-center text-base font-semibold text-indigo-600">
                    Merhaba {userName}
                </h2>
                <p className="mx-auto mt-2 max-w-xl text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
                    Lütfen yapmak istediðiniz iþlemi seçin
                </p>

                {}
                {userRole === 'admin' && (
                    <div className="mt-8 text-center">
                        <Link
                            to="/user-management"
                            className="inline-block rounded-md bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                            Kullanýcý Yönetim Paneli
                        </Link>
                    </div>
                )}

                <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                    {
                    {displayedSections.map((sec, index) => (
                        <Link to={sec.link} key={index} className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow ring-1 ring-black/5 transition hover:shadow-md">
                            <div className="flex flex-col items-center text-center">
                                <p className="text-lg font-medium text-gray-900">{sec.title}</p>
                                <p className="mt-2 text-sm text-gray-600">{sec.description}</p>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <img
                                    src={sec.img}
                                    alt={sec.title}
                                    className="h-40 w-auto object-cover rounded-lg"
                                />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ders Programý</h3>
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
                                    <td className="border px-4 py-2 font-medium">{slot}</td>
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                                        const courseAtTime = courses.find((c) =>
                                            c.schedules?.some((s) =>
                                                s.day === day && s.startTime.startsWith(slot)
                                            )
                                        );
                                        return (
                                            <td className="border px-4 py-2" key={day + slot}>
                                                {courseAtTime ? (
                                                    <>
                                                        <div>{courseAtTime.courseName}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                courseAtTime.schedules.find(s => s.day === day && s.startTime.startsWith(slot))?.roomName
                                                            }
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
        </div>
    );
}