import React, { useState, useEffect } from 'react';

const ROLES = ['admin', 'oe', 'student', 'assistants'];


export default function UserManagement() {
   
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [currentUserRole, setCurrentUserRole] = useState(null); 

   
    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        setCurrentUserRole(userRole);

        if (userRole !== 'admin') {
            setError("Bu sayfayý görüntüleme yetkiniz yok.");
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://localhost:7057/api/User/all');
                if (!response.ok) {
                    throw new Error('Kullanýcý verileri alýnamadý.');
                }
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); 

  
    const handleRoleChange = async (userId, newRole) => {

        const userToUpdate = users.find(user => user.id === userId);
        if (!userToUpdate) return;

        const updatedUser = { ...userToUpdate, role: newRole };

        const originalUsers = [...users];
        setUsers(users.map(user => (user.id === userId ? updatedUser : user)));

        try {
            const response = await fetch(`https://localhost:7057/api/User/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                
                throw new Error('Rol güncellemesi baþarýsýz oldu.');
            }

            console.log(`Kullanýcý ${userId} rolü baþarýyla ${newRole} olarak güncellendi.`);

        } catch (err) {
            
            setError(err.message);
            setUsers(originalUsers);
            alert("Bir hata oluþtu, rol güncellenemedi.");
        }
    };

    if (loading) {
        return <div className="text-center p-10">Kullanýcýlar yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;
    }

    if (currentUserRole !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <div className="py-4">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Kullanýcý Yönetimi</h1>
                <p className="text-md text-gray-600 mt-1">Kullanýcý rollerini görüntüleyin ve güncelleyin.</p>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                                <th className="px-5 py-3 border-b-2 border-gray-200">Kullanýcý Adý</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">E-posta</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Mevcut Rol</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200">Rolü Deðiþtir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-gray-50 border-b border-gray-200">
                                    <td className="px-5 py-5 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                                    </td>
                                    <td className="px-5 py-5 text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                                    </td>
                                    <td className="px-5 py-5 text-sm">
                                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                            <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                            <span className="relative">{user.role}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 text-sm">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {ROLES.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
